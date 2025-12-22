import { signMyPOS } from "./mypos-signature";



type CartItem = {
  article: string;
  quantity: number;
  price: number;
  currency: "EUR";
};

type Params = {
  orderId: string;
  amount: number;
  currency: "EUR";
  customerEmail: string;
  customerPhone: string;
  udf1?: string;
  cartItems?: CartItem[];
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}



export function buildMyPOSFormHTML(params: Params): string {
  console.log("🔥 buildMyPOSFormHTML called");
  console.log("🔥 params received:", params);

  
  const isSandbox = process.env.MYPOS_SANDBOX === "true";

  const actionUrl = isSandbox
    ? "https://www.mypos.eu/vmp/checkout-test"
    : "https://www.mypos.eu/vmp/checkout";

  const fields: Record<string, string | number> = {
    IPCmethod: "IPCPurchase",
    IPCVersion: "1.4",
    IPCLanguage: "EN",

    SID: requireEnv("MYPOS_SID"),
    WalletNumber: requireEnv("MYPOS_WALLET_NUMBER"),

    Amount: params.amount.toFixed(2),
    Currency: params.currency,
    OrderID: params.orderId,

    // ✅ CORRECT myPOS FIELD NAMES
    CustomerEmail: params.customerEmail,
    CustomerPhone: params.customerPhone,

    URL_OK: requireEnv("MYPOS_OK_URL"),
    URL_Cancel: requireEnv("MYPOS_CANCEL_URL"),
    URL_Notify: requireEnv("MYPOS_NOTIFY_URL"),

    KeyIndex: Number(requireEnv("MYPOS_KEY_INDEX")),
  };

  // ✅ Enforce full checkout if cart is present
  if (params.cartItems?.length) {
    fields.PaymentParametersRequired = 3;
    fields.CartItems = params.cartItems.length;

    params.cartItems.forEach((item, index) => {
      const i = index + 1;
      fields[`Article_${i}`] = item.article;
      fields[`Quantity_${i}`] = item.quantity;
      fields[`Price_${i}`] = item.price.toFixed(2);
      fields[`Currency_${i}`] = item.currency;
      fields[`Amount_${i}`] = (item.price * item.quantity).toFixed(2);
    });
  }

  if (params.udf1) {
    fields.UDF1 = params.udf1;
  }


  // 🔐 SIGNATURE MUST BE LAST
  fields.Signature = signMyPOS(fields);


  const inputs = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<input type="hidden" name="${k}" value="${String(v)}" />`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Redirecting to secure payment…</title>
</head>
<body onload="document.forms[0].submit()">
  <form method="POST" action="${actionUrl}">
    ${inputs}
  </form>
  <p style="text-align:center">Redirecting to secure payment…</p>
</body>
</html>`;
}
