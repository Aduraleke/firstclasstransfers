declare module "@revolut/checkout" {
  type EmbeddedCheckoutResult = {
    destroy: () => void;
  };

  type EmbeddedCheckoutOptions = {
    publicToken?: string;
    environment: "sandbox" | "prod";
    target: HTMLElement;
    createOrder: () => Promise<{ token: string }>;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    onCancel?: () => void;
  };

  interface RevolutInstance {
    embeddedCheckout(
      options: EmbeddedCheckoutOptions
    ): Promise<EmbeddedCheckoutResult>;
  }

  export default function RevolutCheckout(): Promise<RevolutInstance>;
}
