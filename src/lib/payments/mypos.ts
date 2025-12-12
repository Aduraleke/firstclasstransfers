// src/lib/payments/mypos.ts

export type MyPOSCheckoutResult = {
  redirectUrl: string;
};

type PurchaseParams = {
  orderId: string;
  amount: number;
  currency: string;
  udf1?: string;
  customer: {
    email: string;
    name?: string;
    phone?: string;
  };
};
// Minimal type definition for the parts of the myPOS SDK we use
type MyPOSModule = {
  default?: (config: unknown) => MyPOSClient;
};

type MyPOSClient = {
  checkout: {
    purchase: (args: {
      orderId: string;
      amount: number;
      currency: string;
      udf1?: string;
      customer: {
        email: string;
        name?: string;
        phone?: string;
      };
      cartItems: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
    }) => Promise<{ redirectUrl?: string; checkoutUrl?: string; url?: string }>;
  };
};


export async function createMyPOSCheckout(
  config: unknown,
  params: PurchaseParams
): Promise<MyPOSCheckoutResult> {
  // typed import
  const mod = (await import("@mypos-ltd/mypos")) as MyPOSModule;

  const createClient = mod.default ?? mod;
  if (typeof createClient !== "function") {
    throw new Error("Invalid myPOS SDK: expected factory function");
  }

  const client = createClient(config);

  if (!client?.checkout?.purchase) {
    throw new Error("myPOS checkout.purchase() not available");
  }

  const result = await client.checkout.purchase({
    orderId: params.orderId,
    amount: params.amount,
    currency: params.currency,
    udf1: params.udf1,
    customer: {
      email: params.customer.email,
      name: params.customer.name,
      phone: params.customer.phone,
    },
    cartItems: [
      {
        name: "Airport Transfer",
        quantity: 1,
        price: params.amount,
      },
    ],
  });

  const redirectUrl = result.redirectUrl || result.checkoutUrl || result.url;

  if (!redirectUrl) {
    console.error("Unexpected myPOS response:", result);
    throw new Error("myPOS did not return redirect URL");
  }

  return { redirectUrl };
}

export function buildMyPOSConfig() {
  const required = [
    "MYPOS_SID",
    "MYPOS_CLIENT_NUMBER",
    "MYPOS_PRIVATE_KEY",
    "MYPOS_KEY_INDEX",
    "MYPOS_OK_URL",
    "MYPOS_CANCEL_URL",
    "MYPOS_NOTIFY_URL",
  ] as const;

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing env: ${key}`);
    }
  }

  return {
    logLevel: "info",
    isSandbox: true,
    checkout: {
      sid: process.env.MYPOS_SID!,
      clientNumber: process.env.MYPOS_CLIENT_NUMBER!,
      privateKey: process.env.MYPOS_PRIVATE_KEY!,
      keyIndex: Number(process.env.MYPOS_KEY_INDEX),
      lang: "EN",
      currency: "EUR",

      okUrl: process.env.MYPOS_OK_URL!,
      cancelUrl: process.env.MYPOS_CANCEL_URL!,
      notifyUtr: process.env.MYPOS_NOTIFY_URL!,

      // 🔥 CRITICAL: prevents HTML streaming
      paymentParametersRequired: 0,
    },
  };
}
