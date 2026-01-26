"use client"

import { Icon } from "@iconify/react"
import { BRAND } from "./brand"
import { PriceRule } from "@/lib/api/admin/types"

interface Props {
  prices: PriceRule[]
  onAddPrice: () => void
  onEditPrice: (price: PriceRule) => void
  onDeletePrice: (id: number) => void
}

export const PricingView: React.FC<Props> = ({ prices, onAddPrice, onEditPrice, onDeletePrice }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Price Management</h1>
        <button
          onClick={onAddPrice}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: BRAND.navy }}
        >
          <Icon icon="mdi:plus" className="text-lg" />
          Add Price Rule
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Airport</th>
                <th className="px-4 py-3">Destination Zone</th>
                <th className="px-4 py-3">Vehicle Type</th>
                <th className="px-4 py-3">Day Price</th>
                <th className="px-4 py-3">Night Price</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price) => (
                <tr key={price.id} className="border-b border-slate-800/60 hover:bg-slate-800/60">
                  <td className="px-4 py-3 text-slate-100">{price.airport}</td>
                  <td className="px-4 py-3 text-slate-100">{price.zone}</td>
                  <td className="px-4 py-3 text-slate-100">{price.vehicle}</td>
                  <td className="px-4 py-3 font-semibold text-green-300">€{price.dayPrice}</td>
                  <td className="px-4 py-3 font-semibold text-blue-300">€{price.nightPrice}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditPrice(price)}
                        className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-700"
                      >
                        <Icon icon="mdi:pencil-outline" className="text-lg" />
                      </button>
                      <button
                        onClick={() => onDeletePrice(price.id)}
                        className="rounded-lg p-1.5 text-red-400 hover:bg-red-950/40"
                      >
                        <Icon icon="mdi:trash-can-outline" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {prices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-400">
                    No price rules yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
