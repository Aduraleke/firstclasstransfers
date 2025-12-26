declare module "@revolut/checkout" {
  type EmbeddedCheckoutResult = {
    destroy: () => void;
  };

  type EmbeddedCheckoutOptions = {
    publicToken: string;
    environment: "sandbox" | "prod";
    target: HTMLElement;
    createOrder: () => Promise<{ publicId: string }>;

    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    onCancel?: () => void;
  };

  interface RevolutCheckoutLoader {
    embeddedCheckout(
      options: EmbeddedCheckoutOptions
    ): Promise<EmbeddedCheckoutResult>;
  }

  const RevolutCheckout: RevolutCheckoutLoader;
  export default RevolutCheckout;
}
