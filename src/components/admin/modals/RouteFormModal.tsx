"use client";

import React, { useEffect, useState } from "react";

import {
  RouteBasics,
  RouteSEO,
  RouteContent,
  RouteTripInfo,
  RouteVehicles,
  RouteFaqs,
  RouteCTA,
  RouteHighlights,
} from "./sections";
import { RouteFormInput } from "@/lib/api/admin/types";
import { Icon } from "@iconify/react";

const emptyForm: RouteFormInput = {
  fromLocation: "",
  toLocation: "",
  metaTitle: "",
  metaDescription: "",
  heroTitle: "",
  subHeadline: "",
  body: "",
  distance: "",
  time: "",
  sedanPrice: 0,
  duration_minutes: 0,
  vanPrice: 0,
  whatMakesBetter: [],
  whatsIncluded: [],
  destinationHighlights: [],
  idealFor: [],
  vehicleOptions: [],
  faqs: [],
  image: null,
  bookCtaLabel: "",
  bookCtaSupport: "",
};

type Props = {
  open: boolean;
  initial?: RouteFormInput;
  onSubmit: (data: RouteFormInput) => Promise<void>;
  onClose: () => void;
};

export const RouteFormModal = ({ open, initial, onSubmit, onClose }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [form, setForm] = useState<RouteFormInput>(
    initial ? { ...initial, image: null } : emptyForm,
  );
useEffect(() => {
  if (!open) return;
  if (!initial) return;
  if (!initial.vehicleOptions?.length) return; // 🛡️ guard

  setForm({ ...initial, image: null });
}, [open, initial]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(form);
      onClose(); // close ONLY after success
    } catch (err) {
      console.error("Failed to save route", err);
      // later: toast / inline error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const update = <K extends keyof RouteFormInput>(
    key: K,
    value: RouteFormInput[K],
  ) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-5xl max-h-[90vh] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {initial ? "Edit Route" : "Create New Route"}
            </h2>
            <p className="text-sm text-slate-400">
              Configure route content, pricing, vehicles, and booking CTA
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition"
          >
            <Icon icon="mdi:close" width={22} />
          </button>
        </div>

        {/* BODY */}
        <form
          id="route-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-8"
        >
          <RouteBasics form={form} update={update} />
          <RouteSEO form={form} update={update} />
          <RouteContent form={form} update={update} />
          <RouteTripInfo form={form} update={update} />

          <RouteHighlights
            title="What Makes This Route Better"
            description="Key advantages that set this transfer apart"
            items={form.whatMakesBetter}
            placeholder="e.g. Fixed pricing with no hidden fees"
            onAdd={() =>
              setForm((p) => ({
                ...p,
                whatMakesBetter: [...p.whatMakesBetter, ""],
              }))
            }
            onUpdate={(i, v) =>
              setForm((p) => {
                const next = [...p.whatMakesBetter];
                next[i] = v;
                return { ...p, whatMakesBetter: next };
              })
            }
            onRemove={(i) =>
              setForm((p) => {
                const next = [...p.whatMakesBetter];
                next.splice(i, 1);
                return { ...p, whatMakesBetter: next };
              })
            }
          />

          <RouteHighlights
            title="What’s Included"
            description="Included services for this transfer"
            items={form.whatsIncluded}
            placeholder="e.g. Meet & greet at the airport"
            onAdd={() =>
              setForm((p) => ({
                ...p,
                whatsIncluded: [...p.whatsIncluded, ""],
              }))
            }
            onUpdate={(i, v) =>
              setForm((p) => {
                const next = [...p.whatsIncluded];
                next[i] = v;
                return { ...p, whatsIncluded: next };
              })
            }
            onRemove={(i) =>
              setForm((p) => {
                const next = [...p.whatsIncluded];
                next.splice(i, 1);
                return { ...p, whatsIncluded: next };
              })
            }
          />

          <RouteHighlights
            title="Destination Highlights"
            description="Notable features of the destination"
            items={form.destinationHighlights}
            placeholder="e.g. Beautiful Mediterranean coastline"
            onAdd={() =>
              setForm((p) => ({
                ...p,
                destinationHighlights: [...p.destinationHighlights, ""],
              }))
            }
            onUpdate={(i, v) =>
              setForm((p) => {
                const next = [...p.destinationHighlights];
                next[i] = v;
                return { ...p, destinationHighlights: next };
              })
            }
            onRemove={(i) =>
              setForm((p) => {
                const next = [...p.destinationHighlights];
                next.splice(i, 1);
                return { ...p, destinationHighlights: next };
              })
            }
          />

          <RouteHighlights
            title="Ideal For"
            description="Who this route is best suited for"
            items={form.idealFor}
            placeholder="e.g. Families and groups"
            onAdd={() =>
              setForm((p) => ({
                ...p,
                idealFor: [...p.idealFor, ""],
              }))
            }
            onUpdate={(i, v) =>
              setForm((p) => {
                const next = [...p.idealFor];
                next[i] = v;
                return { ...p, idealFor: next };
              })
            }
            onRemove={(i) =>
              setForm((p) => {
                const next = [...p.idealFor];
                next.splice(i, 1);
                return { ...p, idealFor: next };
              })
            }
          />

          <RouteVehicles
            vehicles={form.vehicleOptions}
            onAdd={() =>
              setForm((p) => ({
                ...p,
                vehicleOptions: [
                  ...p.vehicleOptions,
                  {
                    vehicleType: "",
                    maxPassengers: 1,
                    idealFor: "",
                    fixedPrice: 0,
                  },
                ],
              }))
            }
            onUpdate={(i, k, v) =>
              setForm((p) => {
                const next = [...p.vehicleOptions];
                next[i] = { ...next[i], [k]: v };

                console.log("🚗 VehicleOptions update:", {
                  index: i,
                  field: k,
                  value: v,
                  nextVehicleOptions: next,
                });

                return { ...p, vehicleOptions: next };
              })
            }
            onRemove={(i) =>
              setForm((p) => {
                const next = [...p.vehicleOptions];
                next.splice(i, 1);
                return { ...p, vehicleOptions: next };
              })
            }
          />

          <RouteFaqs
            faqs={form.faqs}
            onAdd={() =>
              setForm((p) => ({
                ...p,
                faqs: [...p.faqs, { question: "", answer: "" }],
              }))
            }
            onUpdate={(i, k, v) =>
              setForm((p) => {
                const next = [...p.faqs];
                next[i] = { ...next[i], [k]: v };
                return { ...p, faqs: next };
              })
            }
            onRemove={(i) =>
              setForm((p) => {
                const next = [...p.faqs];
                next.splice(i, 1);
                return { ...p, faqs: next };
              })
            }
          />

          <RouteCTA form={form} update={update} />
        </form>

        {/* FOOTER (STICKY ACTIONS) */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="
              flex-1 py-3 rounded-xl
              bg-slate-800
              text-slate-200
              hover:bg-slate-700
              transition
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            form="route-form"
            disabled={isSubmitting}
            className="
    flex-1 py-3 rounded-xl
    bg-linear-to-r from-blue-600 to-indigo-600
    text-white font-semibold
    shadow-lg
    transition
    disabled:opacity-70 disabled:cursor-not-allowed
    inline-flex items-center justify-center gap-2
  "
          >
            {isSubmitting && (
              <Icon icon="mdi:loading" className="animate-spin" width={18} />
            )}
            {isSubmitting ? "Saving Route…" : "Save Route"}
          </button>
        </div>
      </div>
    </div>
  );
};

export type { RouteFormInput };
