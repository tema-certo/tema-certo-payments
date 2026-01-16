import { Model } from 'objection';

type Status = 'pending' | 'paid' | 'canceled' | 'expired' | 'error' | 'failed';

export default class Checkout extends Model {
    static get tableName() {
        return 'checkout';
    }

    static get idColumn() {
        return 'id';
    }

    id: number;
    user_id: number;
    stripe_consumer_id?: number;
    stripe_subscription_id?: number;
    product_safe_id: string;
    status: Status;
    started_at: Date;
    ends_at: Date;
}
