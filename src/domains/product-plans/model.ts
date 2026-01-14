import { Model } from 'objection';

export default class ProductPlan extends Model {
    static get tableName() {
        return 'product_plans';
    }

    static get idColumn() {
        return 'id';
    }

    id: number;
    secure_identifier: string;
    product_id: string;
    plan_name: string;
    plan_ui_price: string;
    stripe_price_id: string;
    url_success_callback?: string;
    url_failure_callback?: string;
    allow_promotions_codes: boolean;
    quantity: number;
    permissioned_payment_types: string;
    essays_per_month: number;
    created_at: Date;
}
