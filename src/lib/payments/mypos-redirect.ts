import crypto from "crypto";
import querystring from "querystring";

type MyPOSRedirectParams = {
  orderId: string;
  amount: number;
  currency: "EUR";
  customerEmail: string;
  customerPhone?: string;
};

export function buildMyPOSRedirectUrl(params: MyPOSRedirectParams) {
  const {
    orderId,
    amount,
    currency,
    customerEmail,
    customerPhone,
  } = params;

  const baseUrl = "https://www.mypos.com/vmp/checkout";

  const payload: Record<string, string | number> = {
    IPCmethod: "IPCPurchase",
    IPCVersion: "1.4",
    IPCLanguage: "EN",

    SID: process.env.MYPOS_SID!,
    walletnumber: process.env.MYPOS_CLIENT_NUMBER!,

    Amount: amount,
    Currency: currency,
    OrderID: orderId,

    URL_OK: process.env.MYPOS_OK_URL!,
    URL_Cancel: process.env.MYPOS_CANCEL_URL!,

    customeremail: customerEmail,
    customerphone: customerPhone ?? "",

    CartItems: 1,
    Article_1: "Airport Transfer",
    Quantity_1: 1,
    Price_1: amount,
    Currency_1: currency,
    Amount_1: amount,

    KeyIndex: Number(process.env.MYPOS_KEY_INDEX),
    PaymentMethod: 1,
    PaymentParametersRequired: 0,
  };

  // 🔐 Build signature string
  const signString = Object.keys(payload)
    .sort()
    .map((k) => `${k}=${payload[k]}`)
    .join("&");

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(signString)
    .sign(process.env.MYPOS_PRIVATE_KEY!, "base64");

  payload.Signature = signature;

  return `${baseUrl}?${querystring.stringify(payload)}`;
}
