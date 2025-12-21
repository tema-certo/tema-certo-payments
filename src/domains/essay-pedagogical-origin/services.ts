import { EssayPedagogicalOriginRepository } from '~/domains/essay-pedagogical-origin/repository';

export class EssayPedagogicalOriginService {
    constructor(private readonly repository: EssayPedagogicalOriginRepository) {}

    async getAllPossiblePedagogicalOrigin() {
        const pedagogicalOrigin = await this.repository.getAllPossiblePedagogicalOrigin();

        return pedagogicalOrigin.map((value) => {
            return {
                id: value.id,
                institution_name: value.institution_name,
                label: value.institution_name.toUpperCase(),
            };
        });
    }
}
