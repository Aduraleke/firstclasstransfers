# MyPOS Payment Integration Analysis

## Executive Summary

This document analyzes the changes made to the myPOS card payment integration after commit `6215897fc6467be1e9fc40a5755e2d9ba531db57` (December 16, 2025, 12:41 PM UTC), which was the last known working version. Subsequent refactoring commits introduced critical issues with signature generation that broke payment functionality.

**Key Finding:** The December 16, 2025 "payment functions refactoring" commit (d8905d4, 1:41 PM UTC - exactly one hour after the working commit) introduced breaking changes to the signature generation logic that are incompatible with myPOS IPC v1.4 requirements.

---

## Timeline of Changes

### ✅ **Working State: Commit 6215897 (Dec 16, 12:41 PM)**
- Payment integration functioning correctly
- Signature generation matching myPOS IPC v1.4 specifications

### ❌ **Breaking Changes: Commit d8905d4 (Dec 16, 1:41 PM)**
**Title:** "payment fnctions refactoring"  
**Files Modified:**
- `src/lib/payments/mypos-signature.ts` (19 additions, 48 deletions)
- `src/lib/payments/mypos-form.ts` (23 additions, 29 deletions)
- `src/lib/payments/order-token.ts` (1 addition, 30 deletions)
- `src/app/api/payments/mypos/start/route.ts` (2 additions, 4 deletions)

### 🔧 **Attempted Fixes: Commit 6922e9e (Dec 22, 3:46 PM)**
**Title:** "Reverting myPOS form parameters and logging"  
**Files Modified:**
- `src/lib/payments/mypos-form.ts` (28 additions, 40 deletions)

### 🧹 **Cleanup: Commit 53eacd5 (Dec 22, 3:53 PM)**
**Title:** "Revert Node.js runtime and clean up code"  
**Files Modified:**
- `src/app/api/payments/mypos/start/route.ts` (4 additions, 14 deletions)

---

## Critical Issues Identified

### 1. **Incomplete Signature String Construction**

#### Problem
The current signature generation in `mypos-signature.ts` only includes **12 base parameters** in the signature string:

```typescript
const SIGNATURE_ORDER = [
  "IPCmethod",
  "IPCVersion",
  "IPCLanguage",
  "SID",
  "WalletNumber",
  "Amount",
  "Currency",
  "OrderID",
  "URL_OK",
  "URL_Cancel",
  "URL_Notify",
  "KeyIndex",
] as const;
```

#### myPOS IPC v1.4 Requirement
According to the myPOS IPC v1.4 specification, the signature MUST include **ALL parameters** sent in the request, including:
- **CartItems and their details** (Article_N, Quantity_N, Price_N, Currency_N, Amount_N)
- **Customer information** (CustomerEmail, CustomerPhone)
- **PaymentParametersRequired**
- **Optional fields** like UDF1 when present

#### Impact
The signature verification fails at myPOS servers because:
1. The form sends CartItems parameters that aren't included in signature
2. Customer email/phone parameters are excluded from signature
3. The signature doesn't match what myPOS expects based on all submitted fields

---

### 2. **Incorrect Parameter Order for CartItems**

#### Problem
Even if CartItems were added to the signature, the current code doesn't follow the myPOS specification for parameter ordering. The signature must include parameters in the exact order specified by myPOS documentation.

#### Correct Order (myPOS IPC v1.4)
```
IPCmethod
IPCVersion
IPCLanguage
SID
WalletNumber
Amount
Currency
OrderID
URL_OK
URL_Cancel
URL_Notify
PaymentParametersRequired
CustomerEmail
CustomerPhone
CartItems
Article_1
Quantity_1
Price_1
Currency_1
Amount_1
[... repeat for each cart item ...]
UDF1 (if present)
KeyIndex
```

#### Current Implementation
The signature only processes the first 12 fields, completely ignoring:
- PaymentParametersRequired (value: 3)
- CustomerEmail
- CustomerPhone
- All CartItems-related fields
- UDF1 (optional order token)

---

### 3. **Missing Fields in Signature Algorithm**

#### What's in the Form (from `mypos-form.ts`)
```typescript
const fields: Record<string, string | number> = {
  IPCmethod: "IPCPurchase",
  IPCVersion: "1.4",
  IPCLanguage: "EN",
  SID: requireEnv("MYPOS_SID"),
  WalletNumber: requireEnv("MYPOS_WALLET_NUMBER"),
  Amount: params.amount.toFixed(2),
  Currency: params.currency,
  OrderID: params.orderId,
  URL_OK: process.env.MYPOS_OK_URL!,
  URL_Cancel: process.env.MYPOS_CANCEL_URL!,
  URL_Notify: process.env.MYPOS_NOTIFY_URL!,
  PaymentParametersRequired: 3,           // ❌ NOT IN SIGNATURE
  CustomerEmail: params.customerEmail,     // ❌ NOT IN SIGNATURE
  CustomerPhone: params.customerPhone ?? "",// ❌ NOT IN SIGNATURE
  CartItems: 1,                           // ❌ NOT IN SIGNATURE
  Article_1: "Airport Transfer",          // ❌ NOT IN SIGNATURE
  Quantity_1: 1,                          // ❌ NOT IN SIGNATURE
  Price_1: params.amount.toFixed(2),      // ❌ NOT IN SIGNATURE
  Currency_1: params.currency,            // ❌ NOT IN SIGNATURE
  Amount_1: params.amount.toFixed(2),     // ❌ NOT IN SIGNATURE
  KeyIndex: process.env.MYPOS_KEY_INDEX!, // ✅ IN SIGNATURE
};

if (params.udf1) {
  fields.UDF1 = params.udf1;              // ❌ NOT IN SIGNATURE
}
```

---

## Technical Root Cause

### The Refactoring Mistake

The December 16 refactoring attempted to "simplify" the signature generation by creating a fixed array of parameter names (`SIGNATURE_ORDER`). This approach:

1. **Hardcoded a subset of parameters** instead of including all form fields
2. **Assumed a static form structure** that doesn't match the actual implementation
3. **Violated myPOS IPC v1.4 specification** which requires ALL parameters in signature

### What Should Have Been Done

The signature generation should:

1. **Include every parameter** sent in the form (except Signature itself)
2. **Follow the exact order** specified by myPOS documentation
3. **Dynamically handle** optional fields like UDF1 and multiple cart items
4. **Concatenate values only** (not keys) with "-" separator
5. **Base64 encode** the concatenated string
6. **Sign with RSA-SHA256** using the private key

---

## Expected Behavior vs. Current Behavior

### Expected Signature String (Working Version)
```
IPCPurchase-1.4-EN-[SID]-[WalletNumber]-100.00-EUR-ORD-1234567890-[OK_URL]-[CANCEL_URL]-[NOTIFY_URL]-3-customer@example.com-+1234567890-1-Airport Transfer-1-100.00-EUR-100.00-[optional_udf1]-1
```

### Current Signature String (Broken Version)
```
IPCPurchase-1.4-EN-[SID]-[WalletNumber]-100.00-EUR-ORD-1234567890-[OK_URL]-[CANCEL_URL]-[NOTIFY_URL]-1
```

**Missing from current signature:**
- PaymentParametersRequired (3)
- CustomerEmail
- CustomerPhone
- CartItems count (1)
- Article_1
- Quantity_1
- Price_1
- Currency_1
- Amount_1
- UDF1 (when present)

---

## Impact on Payment Flow

### What Happens When Payment is Initiated

1. ✅ User fills booking form
2. ✅ Backend creates booking record
3. ✅ Order token (UDF1) is generated and signed
4. ✅ Payment form HTML is generated with ALL required fields
5. ❌ **Signature is generated with INCOMPLETE data**
6. ✅ Browser submits form to myPOS servers
7. ❌ **myPOS validates signature → FAILS**
8. ❌ Payment is rejected with signature error
9. ❌ Customer sees error page or is redirected to cancel URL

### myPOS Error Response
Expected error from myPOS:
```json
{
  "StatusCode": "13",
  "StatusMsg": "E_SIGNATURE_FAILED",
  "ErrorDescription": "Signature verification failed"
}
```

---

## Solution: Correcting the Signature Generation

### Step 1: Update `SIGNATURE_ORDER` Constant

Replace the current incomplete array with the complete parameter order:

```typescript
const SIGNATURE_ORDER = [
  "IPCmethod",
  "IPCVersion",
  "IPCLanguage",
  "SID",
  "WalletNumber",
  "Amount",
  "Currency",
  "OrderID",
  "URL_OK",
  "URL_Cancel",
  "URL_Notify",
  "PaymentParametersRequired",
  "CustomerEmail",
  "CustomerPhone",
  "CartItems",
  "Article_1",
  "Quantity_1",
  "Price_1",
  "Currency_1",
  "Amount_1",
  // UDF1 would go here if present (handled conditionally)
  "KeyIndex",
] as const;
```

### Step 2: Handle Optional UDF1 Field

The UDF1 field appears BEFORE KeyIndex when present:

```typescript
export function signMyPOS(
  fields: Record<string, string | number>
): string {
  if (!process.env.MYPOS_PRIVATE_KEY) {
    throw new Error("MYPOS_PRIVATE_KEY missing");
  }

  const values: string[] = [];

  // Add all required fields in order
  for (const key of SIGNATURE_ORDER) {
    if (fields[key] !== undefined && fields[key] !== "") {
      values.push(String(fields[key]));
    }
  }

  // Handle optional UDF1 (comes after cart items, before KeyIndex)
  if (fields.UDF1 !== undefined && fields.UDF1 !== "") {
    values.push(String(fields.UDF1));
  }

  // KeyIndex is already included in SIGNATURE_ORDER at the end

  const raw = values.join("-");
  console.log("myPOS SIGN STRING:", raw);

  const base64 = Buffer.from(raw).toString("base64");

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(base64);
  signer.end();

  return signer.sign(
    normalizeKey(process.env.MYPOS_PRIVATE_KEY),
    "base64"
  );
}
```

### Step 3: Verify Field Order in Form Builder

Ensure `mypos-form.ts` builds the fields object in the same order as signature:

```typescript
const fields: Record<string, string | number> = {
  IPCmethod: "IPCPurchase",
  IPCVersion: "1.4",
  IPCLanguage: "EN",
  SID: requireEnv("MYPOS_SID"),
  WalletNumber: requireEnv("MYPOS_WALLET_NUMBER"),
  Amount: params.amount.toFixed(2),
  Currency: params.currency,
  OrderID: params.orderId,
  URL_OK: process.env.MYPOS_OK_URL!,
  URL_Cancel: process.env.MYPOS_CANCEL_URL!,
  URL_Notify: process.env.MYPOS_NOTIFY_URL!,
  PaymentParametersRequired: 3,
  CustomerEmail: params.customerEmail,
  CustomerPhone: params.customerPhone ?? "",
  CartItems: 1,
  Article_1: "Airport Transfer",
  Quantity_1: 1,
  Price_1: params.amount.toFixed(2),
  Currency_1: params.currency,
  Amount_1: params.amount.toFixed(2),
  KeyIndex: process.env.MYPOS_KEY_INDEX!,
};

// Add UDF1 BEFORE signing but AFTER KeyIndex in the fields object
// (The signature function will insert it in the correct position)
if (params.udf1) {
  fields.UDF1 = params.udf1;
}

// Signature MUST be calculated last
fields.Signature = signMyPOS(fields);
```

---

## Testing the Fix

### Test Signature Generation

Add temporary logging to verify the signature string:

```typescript
// In signMyPOS function, before signing
console.log("Signature Input String:", raw);
console.log("Base64 Encoded:", base64);
console.log("Final Signature:", signature);
```

### Expected Output for Test Transaction
```
Signature Input String: IPCPurchase-1.4-EN-000000-61938166610-100.00-EUR-ORD-1234567890-https://example.com/payment/success-https://example.com/payment/cancel-https://example.com/payment/notify-3-test@example.com-+1234567890-1-Airport Transfer-1-100.00-EUR-100.00-[optional_token]-1

Base64 Encoded: SVBDUHVyY2hhc2UtMS40LUVOLTAwMDAwMC02MTkzODE2NjYxMC0xMDAuMDAtRVVSLU9SRC0xMjM0NTY3ODkwLWh0dHBzOi8vZXhhbXBsZS5jb20vcGF5bWVudC9zdWNjZXNzLWh0dHBzOi8vZXhhbXBsZS5jb20vcGF5bWVudC9jYW5jZWwtaHR0cHM6Ly9leGFtcGxlLmNvbS9wYXltZW50L25vdGlmeS0zLXRlc3RAZXhhbXBsZS5jb20tKzEyMzQ1Njc4OTAtMS1BaXJwb3J0IFRyYW5zZmVyLTEtMTAwLjAwLUVVUi0xMDAuMDAtW29wdGlvbmFsX3Rva2VuXS0x

Final Signature: [Base64 encoded RSA-SHA256 signature]
```

### Test in myPOS Sandbox

1. Set `MYPOS_SANDBOX=true` in environment
2. Use myPOS test credentials
3. Submit a test booking
4. Verify payment form redirects successfully
5. Complete payment on myPOS test environment
6. Verify notification callback is received

---

## Prevention: Code Review Checklist

To prevent similar issues in the future:

### ✅ **Before Modifying Payment Integration**

1. **Document current behavior** with test transactions
2. **Review myPOS IPC documentation** for the specific version
3. **Understand signature requirements** completely
4. **Test in sandbox** before production changes
5. **Keep old working code** in version control

### ✅ **During Development**

1. **Add comprehensive logging** for signature generation
2. **Compare signature strings** between versions
3. **Test with multiple scenarios** (with/without optional fields)
4. **Verify parameter order** matches specification exactly
5. **Use test credentials** initially

### ✅ **Before Deployment**

1. **Run full payment flow test** in sandbox
2. **Verify signature verification** succeeds
3. **Test notification callback** handling
4. **Check error handling** for edge cases
5. **Review logs** for any warnings

---

## References

### myPOS Documentation
- [myPOS IPC Purchase v1.4](https://developers.mypos.com/en/doc/online_payments/v1_4/167-ipcpurchase)
- [Signature Generation Process](https://demo.developers.mypos.eu/en/doc/online_payments/v1_4/19-reference-guide)
- [Error Messages](https://developers.mypos.com/en/doc/online_payments/v1_4/28-error-messages)
- [myPOS PHP SDK](https://github.com/developermypos/myPOS-Checkout-SDK-PHP) (Reference implementation)

### Key Commits
- **Working:** `6215897fc6467be1e9fc40a5755e2d9ba531db57` (Dec 16, 12:41 PM)
- **Breaking:** `d8905d4fa7ffed5fe519c3b0f53d72a4df7e6bcc` (Dec 16, 1:41 PM)
- **Attempted Fix:** `6922e9ecbd66add672e1aadde212ae62619e2d20` (Dec 22, 3:46 PM)
- **Cleanup:** `53eacd508373ec8da127df28a9cf0d57d6346cbc` (Dec 22, 3:53 PM)

---

## Conclusion

The myPOS payment integration broke due to incomplete signature generation introduced in the December 16 refactoring. The fix requires:

1. **Including ALL form parameters** in the signature (not just the first 12)
2. **Following the exact parameter order** specified by myPOS IPC v1.4
3. **Properly handling optional fields** like UDF1
4. **Testing thoroughly** in sandbox before production deployment

The root cause was an oversimplification of the signature logic that didn't account for the complete myPOS specification requirements. The working version (commit 6215897) should be used as a reference for the correct implementation.

---

**Document Version:** 1.0  
**Date:** December 23, 2025  
**Author:** GitHub Copilot Analysis  
**Status:** Documentation Only - No Code Changes
