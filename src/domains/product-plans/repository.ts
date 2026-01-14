import ProductPlan from './model';

export interface ProductRepository {
    findSecureId(uuid: string): Promise<ProductPlan | undefined>;
    findManyProducts(select: string | string[]): Promise<ProductPlan[]>;
}

export default class ProductPlanImplementation implements ProductRepository {
    async findSecureId(uuid: string): Promise<ProductPlan | undefined> {
        return ProductPlan
            .query()
            .findOne({ secure_identifier: uuid });
    }

    async findManyProducts(select: string | string[] = '*'): Promise<ProductPlan[]> {
        return ProductPlan
            .query()
            .select(select);
    }
}
