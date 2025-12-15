import { Model } from 'objection';
import { EssayUserTry } from '~/domains/essay-user-try/model';
import { EssayJsonResult } from '~/types/UseAi';
import { User } from '~/domains/users/model';
import { EssayThemes } from '~/domains/essay-themes/model';

export class EssayResults extends Model {
    static get tableName() {
        return 'essay_results';
    }

    static get idColumn() {
        return 'id';
    }

    id: number;
    essay_try_id: number;
    score: number;
    ia_result: EssayJsonResult;
    created_at: Date;
    updated_at: Date;
    sequence: number;
    user_id: number;

    $beforeInsert() {
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    $beforeUpdate() {
        this.updated_at = new Date();
    }

    static get relationMappings() {
        return {
            essay_user_try: {
                relation: Model.BelongsToOneRelation,
                modelClass: EssayUserTry,
                join: {
                    from: 'essay_results.essay_try_id',
                    to: 'essay_user_try.id',
                },
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'essay_results.user_id',
                    to: 'users.id',
                },
            },
            themes: {
                relation: Model.HasOneThroughRelation,
                modelClass: EssayThemes,
                join: {
                    from: 'essay_results.essay_try_id',
                    through: {
                        from: 'essay_user_try.id',
                        to: 'essay_user_try.essay_theme_id',
                    },
                    to: 'essay_themes.id',
                },
            },
        };
    }
}
