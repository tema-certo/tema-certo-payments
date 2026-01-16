import Checkout from '~/domains/checkout/model';
import { UpdateCheckoutReference } from '~/domains/checkout/types';

export interface CheckoutRepository {
    createCheckoutReference(userId: number, productSafeId: string, status: Checkout['status']): Promise<Checkout>;
    updateCheckoutReference(data: UpdateCheckoutReference): Promise<Checkout>;
}

export default class CheckoutImplementation implements CheckoutRepository {
    async createCheckoutReference(userId: number, productSafeId: string, status: Checkout['status']) {
        return Checkout
            .query()
            .insertAndFetch({
                user_id: userId,
                product_safe_id: productSafeId,
                status,
            });
    }

    async updateCheckoutReference(data: UpdateCheckoutReference) {
        const patchBody: Partial<Checkout> = {
            status: data.status,
            ...(data.startedAt && { started_at: data.startedAt }),
            ...(data.endsAt && { ends_at: data.endsAt }),
        };

        return Checkout
            .query()
            .patchAndFetchById(data.id, patchBody);
    }
}
