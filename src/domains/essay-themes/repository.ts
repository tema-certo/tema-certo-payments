import { Pagination } from '~/types/express';
import { EssayThemes } from './model';
import { EssayClassification } from '../essay-classification/model';
import { EssayThemesPossibleClassification } from './services';
import { EssayResults } from '~/domains/essay-results/model';

interface ThemeWithClassification {
    essayTheme: EssayThemes;
    classification: EssayClassification[];
}

interface ListThemeWithClassification {
    theme: EssayThemes;
    classification: EssayClassification | null;
}

interface ListThemesStats {
    totalThemes: number;
    totalEnemThemes: number;
}

type EssayThemesStats = EssayThemes & {
    total: number;
}

type ThemeUsesCount = {
    essay_theme_id: number;
    total: number | string;
};

export interface EssayThemesRepository {
    getThemes(pagination: Pagination): Promise<ListThemeWithClassification[] | []>;
    getThemeById(id: number): Promise<ThemeWithClassification | undefined>;
    createTheme(theme: EssayThemesPossibleClassification): Promise<EssayThemesPossibleClassification>;
    getThemesStats(): Promise<ListThemesStats>;
}

export class EssayThemesImplementation implements EssayThemesRepository {
    async getThemes(pagination: Pagination): Promise<ListThemeWithClassification[] | []> {
        const query = EssayThemes
            .query()
            .where('is_active', true);

        const essayClassification = await EssayClassification
            .query()
            .select()
            .withGraphFetched('[category(baseCategory), pedagogical_origin(basePedagogicalOrigin),'
                + 'difficulty_level(baseDifficultyLevel)]');

        query.offset(pagination.offset);
        query.limit(pagination.limit);

        const result = await query;

        if (!result ||!result.length) return [];

        const countUsesPerTheme = await EssayResults
            .query()
            .select('essay_user_try.essay_theme_id')
            .innerJoinRelated('essay_user_try')
            .count('* as total')
            .groupBy('essay_user_try.essay_theme_id')
            .whereIn('essay_user_try.essay_theme_id', result.map(theme => theme.id)) as unknown as ThemeUsesCount[];

        const usesMap = new Map<number, number>();

        countUsesPerTheme.forEach(item => {
            usesMap.set(item.essay_theme_id, Number(item.total));
        });

        return result.map(theme => ({
            total: usesMap.get(theme.id) ?? 0,
            theme,
            classification:
                essayClassification.find(
                    classification => classification.essay_id === theme.id,
                ) || null,
        }));
    }

    async getThemeById(id: number): Promise<ThemeWithClassification | undefined> {
        const theme = await EssayThemes
            .query()
            .findById(id);

        if (!theme) return undefined;

        const classification = await EssayClassification
            .query()
            .where('essay_id', id)
            .withGraphFetched('[category(baseCategory), pedagogical_origin(basePedagogicalOrigin),'
                + 'difficulty_level(baseDifficultyLevel)]')
            .select('id');

        return {
            essayTheme: theme,
            classification,
        };
    }

    async createTheme(theme: EssayThemesPossibleClassification): Promise<EssayThemesPossibleClassification> {
        const essayTheme = await EssayThemes
            .query()
            .insertAndFetch(theme.essayTheme);

        let classification = {} as EssayClassification;

        if (theme.classification) {
            classification = await EssayClassification
                .query()
                .insertAndFetch({
                    essay_id: essayTheme.id,
                    category_id: theme.classification.category_id,
                    pedagogical_origin_id: theme.classification.pedagogical_origin_id,
                    difficulty_level_id: theme.classification.difficulty_level_id,
                });
        }

        return {
            essayTheme,
            classification,
        };
    }

    async getThemesStats(): Promise<ListThemesStats> {
        const totalThemes = await EssayThemes
            .query()
            .count('* as total')
            .first() as EssayThemesStats;

        const totalEnemThemes = await EssayThemes
            .query()
            .innerJoin('essay_classification', 'essay_classification.essay_id', 'essay_themes.id')
            .innerJoin(
                'essay_pedagogical_origin',
                'essay_pedagogical_origin.id',
                'essay_classification.pedagogical_origin_id',
            )
            .where('essay_pedagogical_origin.institution_name', '=', 'ENEM')
            .count('* as total')
            .first() as EssayThemesStats;

        return {
            totalThemes: Number(totalThemes?.total),
            totalEnemThemes: Number(totalEnemThemes?.total),
        };
    }
}
