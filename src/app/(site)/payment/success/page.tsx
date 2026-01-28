// import { notFound } from "next/navigation";
// import SuccessClient from "./SuccessClient";
// import { connectDB } from "@/lib/db/mongo";
// import { Booking } from "@/lib/db/models/Booking";

// type Props = {
//   searchParams?: { orderId?: string };
// };

// export default async function SuccessPage({ searchParams }: Props) {
//   const orderId = searchParams?.orderId;
//   if (!orderId) notFound();

//   try {
//     await connectDB();
//     const booking = await Booking.findOne({ orderId }).lean();
    
//     if (!booking) {
//       console.error(`[SUCCESS PAGE] Booking not found for orderId: ${orderId}`);
//       notFound();
//     }

//     return (
//       <SuccessClient
//         orderId={booking.orderId}
//         amount={booking.expectedAmount}
//         currency={booking.currency}
//       />
//     );
//   } catch (error) {
//     console.error("[SUCCESS PAGE] Error fetching booking:", error);
//     notFound();
//   }
// }


import React from 'react'

export default function page() {
  return (
    <div>
      succeess page
    </div>
  )
}
