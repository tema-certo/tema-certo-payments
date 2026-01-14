import { ProductRepository } from '~/domains/product-plans/repository';
import { DefaultHttpError } from '~/generic-errors';
import ProductPlan from '~/domains/product-plans/model';

export default class ProductPlanService {
    constructor(private productRepository: ProductRepository) {
    }

    async findSecureId(uuid: string): Promise<ProductPlan> {
        const product = await this.productRepository.findSecureId(uuid);

        if (!product) {
            throw DefaultHttpError({ element: 'Product', error: 'NOT_FOUND' });
        }

        return product;
    }

    async findManyProducts({
        uiSecurity = false,
    }): Promise<ProductPlan[] | []> {
        let select: string | string[] = '*';

        if (uiSecurity) {
            select = ([
                'secure_identifier',
                'plan_name',
                'plan_ui_price',
                'essays_per_month',
            ] as string[]);
        }

        const products = await this.productRepository.findManyProducts(select);

        if (products.length <= 0) {
            return [];
        }

        return products;
    }
}
