// types/mypos.d.ts
declare module "@mypos-ltd/mypos" {
  // Minimal typed surface for the SDK based on typical usage in examples.
  // Expand this if you need more SDK features typed.

  export type MyPOSCheckoutConfig = {
    isSandbox?: boolean;
    logLevel?: "error" | "warn" | "info" | "debug";
    checkout: {
      sid: string;
      lang?: string;
      currency?: string;
      clientNumber?: string;
      okUrl?: string;
      cancelUrl?: string;
      notifyUtr?: string;
      keyIndex?: number;
      privateKey?: string; // PEM
    };
  };

  export type MyPOSCustomer = {
    email?: string;
    firstNames?: string;
    familyName?: string;
    phone?: string;
    country?: string;
  };

  export type MyPOSCartItem = {
    name: string;
    quantity: number;
    price: number;
  };

  export type MyPOSPurchaseParams = {
    orderId: string;
    amount: number; // integer or decimal depending on SDK; using number
    cartItems: MyPOSCartItem[];
    customer?: MyPOSCustomer;
    note?: string;
    // other optional SDK-specific fields may exist
    [key: string]: unknown;
  };

  // The checkout object with purchase method that writes HTML to the response
  export interface MyPOSCheckout {
    purchase: (params: MyPOSPurchaseParams, res: {
      write: (chunk: string | Buffer) => void;
      end: (chunk?: string | Buffer) => void;
      setHeader?: (name: string, value: string) => void;
      getHeader?: (name: string) => string | undefined;
    }) => void;
  }

  export interface MyPOSInstance {
    checkout: MyPOSCheckout;
    // other namespaces could exist
    [k: string]: unknown;
  }

  // Factory that receives a config and returns an instance
  export type MyPOSFactory = (cfg: MyPOSCheckoutConfig) => MyPOSInstance;

  const factory: MyPOSFactory;
  export default factory;
}
