type LineItemsDefinition = {
    price: string;
    quantity: number;
}

type Metadata = {
    userId: number;
    productId: number;
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
};
