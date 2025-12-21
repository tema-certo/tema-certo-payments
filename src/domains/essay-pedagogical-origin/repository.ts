import { EssayPedagogicalOrigin } from '~/domains/essay-pedagogical-origin/model';

export interface EssayPedagogicalOriginRepository {
    getAllPossiblePedagogicalOrigin(): Promise<EssayPedagogicalOrigin[]>;
}

export class EssayPedagogicalOriginImplementation implements EssayPedagogicalOriginRepository {
    async getAllPossiblePedagogicalOrigin(): Promise<EssayPedagogicalOrigin[]> {
        return EssayPedagogicalOrigin
            .query()
            .where('can_be_used', true);
    }
}
