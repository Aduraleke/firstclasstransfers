declare module "@revolut/checkout" {
  type EmbeddedCheckoutResult = {
    destroy: () => void;
  };

  type EmbeddedCheckoutOptions = {
    publicToken: string;
    environment: "sandbox" | "prod";
    target: HTMLElement;
    createOrder: () => Promise<{ publicId?: string }>;
    onSuccess?: () => void;
    onError?: () => void;
    onCancel?: () => void;
  };

  interface RevolutInstance {
    embeddedCheckout(
      options: EmbeddedCheckoutOptions
    ): Promise<EmbeddedCheckoutResult>;
  }

  export default function RevolutCheckout(): Promise<RevolutInstance>;
}
