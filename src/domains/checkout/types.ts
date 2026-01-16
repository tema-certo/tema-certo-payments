import Checkout from '~/domains/checkout/model';

type LineItemsDefinition = {
    price: string;
    quantity: number;
}

type Metadata = {
    userId: number;
    productId: string;
    checkoutId: number;
    daysToUse: number;
    planName: string;
};

export type PaymentMethodTypes = 'card' | 'pix';

export type CheckoutSession = {
    mode: 'payment' | 'subscription';
    lineItems: LineItemsDefinition[];
    successUrl: string;
    cancelUrl: string;
    customerEmail: string;
    metadata: Metadata;
    allowPromotionCodes: boolean;
    paymentMethodTypes: PaymentMethodTypes[];
    paymentIntentData?: {
        metadata: Metadata;
    };
};

export type UpdateCheckoutReference = {
    id: number;
    status: Checkout['status'];
    startedAt?: Date;
    endsAt?: Date;
}
