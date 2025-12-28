import Link from "next/link";

type Props = {
  searchParams?: { orderId?: string };
};

export default function FailedPage({ searchParams }: Props) {
  const orderId = searchParams?.orderId;

  return (
    <div className="pt-32 pb-12 text-center max-w-2xl mx-auto px-4">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-red-900 mb-2">Payment Failed</h1>
        <p className="text-gray-700 mb-4">
          Unfortunately, your payment could not be processed.
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Order reference: {orderId}
          </p>
        )}
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            This could be due to insufficient funds, an incorrect card number, or your bank declining the transaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold shadow-md transition"
              style={{ background: "linear-gradient(135deg,#b07208,#162c4b)" }}
            >
              Try Again
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white border border-gray-300 text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
