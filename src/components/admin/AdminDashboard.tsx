"use client";

import { useEffect, useState, useMemo, useCallback } from "react";


import { AdminSidebar, AdminViewId } from "@/components/admin/AdminSidebar";
import { DashboardView } from "@/components/admin/DashboardView";
import { BookingsView } from "@/components/admin/BookingView";
import { DriversView } from "@/components/admin/DriversView";
import { RoutesView } from "@/components/admin/RouteView";

import { AdminUsersView } from "@/components/admin/AdminUserView";
// import { AuditLogsView } from "@/components/admin/AuditLogsView";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/api/admin/auth/authStore";
import type { RouteFormInput } from "@/components/admin/modals/RouteFormModal";

import {
  Booking,

  // AuditLog,
  DashboardStats,
  AdminUser,
  Driver,
} from "@/lib/api/admin/types";
import {
  getAdminUsers,
  getAdminById,
  deleteAdmin,
  updateAdmin,
} from "@/lib/api/admin/adminUsers";

import {
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  Route,
} from "@/lib/api/admin/routeDestination";

import {
  getVehicles,
  createVehicle,
  deleteVehicle,
  VehicleFormInput,
  patchVehicle,
  mapApiToVehicle,
  Vehicle,
} from "@/lib/api/admin/vehicles";

import {
  getActivityLogs,
  downloadActivityLogs,
} from "@/lib/api/admin/superAdmin";

import { BookingDetailsModal } from "@/components/admin/modals/BookingDetailsModal";
import { AssignDriverModal } from "@/components/admin/modals/AssignDriverModal";
import { DriverFormModal } from "@/components/admin/modals/DriverFormModal";
import { RouteFormModal } from "@/components/admin/modals/RouteFormModal";
import { AdminUserFormModal } from "@/components/admin/modals/AdminUserFormModal";
import { createAdmin } from "@/lib/api/admin/adminUsers";
import { AdminUserDetailsModal } from "@/components/admin/modals/AdminUserDetailsModal";
import {
  createDriver,
  DriverFormInput,
  getDrivers,
  updateDriver,
  deleteDriver,
} from "@/lib/api/admin/driverUsers";
import { AdminHome } from "./AdminHome";
import { VehiclesView } from "./VehiclesView";
import { VehicleFormModal } from "./modals/VehicleFormModal";
import { AuditLogsView } from "./AuditLogsView";
import {
  BookingApiResponse,
  getBookings,
} from "@/lib/api/admin/bookingDetails";
import Loader from "../Loader";

type ActiveModal =
  | { type: "bookingDetails"; booking: Booking }
  | { type: "assignDriver"; booking: Booking }
  | { type: "driverForm"; driver?: Driver }
  | { type: "routeForm"; route?: Route }
  | { type: "adminForm"; admin?: AdminUser }
  | { type: "vehicleForm"; vehicle?: Vehicle }
  | { type: "viewAdmin" }
  | null;

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<AdminViewId>("dashboard");
  const [adminError, setAdminError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverCounts, setDriverCounts] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
  });
  const [driverMeta, setDriverMeta] = useState<{
    next: string | null;
    previous: string | null;
  }>({
    next: null,
    previous: null,
  });

  const [driverTab, setDriverTab] = useState<
    "all" | "available" | "unavailable"
  >("all");

  const [driverSearch, setDriverSearch] = useState("");
  const [driversLoading, setDriversLoading] = useState(false);

  const [routes, setRoutes] = useState<Route[]>([]);

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [viewAdminLoading, setViewAdminLoading] = useState(false);
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  // Simple local-only UI state
  const [bookingFilters, setBookingFilters] = useState({
    passenger_name: "",
    from_location: "",
    to_location: "",
    pickup_date: "",
    return_date: "",
    vehicle_type: "",
    status: "all",
  });

  const [bookingsLoading, setBookingsLoading] = useState(false);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [routesLoading, setRoutesLoading] = useState(true);

  const [expandedRouteGroups, setExpandedRouteGroups] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const admin = useAuthStore((s) => s.admin);
  const hydrated = useAuthStore((s) => s.hydrated);



  // Stats derived from bookings

  const stats: DashboardStats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "Pending").length,
    completedToday: 0, // you can compute this later based on date
    revenue: "€0", // you can compute from payments later
  };
  function normalizeTripType(value: string): "One Way" | "Round Trip" {
    return value.toLowerCase().includes("round") ? "Round Trip" : "One Way";
  }

  function normalizePaymentStatus(
    value: string,
  ): "Paid" | "Not Paid" | "Pending" {
    switch (value.toLowerCase()) {
      case "paid":
        return "Paid";
      case "not paid":
      case "unpaid":
        return "Not Paid";
      default:
        return "Pending";
    }
  }
const mapBookingApiToBooking = useCallback(
  (api: BookingApiResponse): Booking => ({
    id: api.bookingId,

    customerName: api.passengerInformation.fullName,
    email: api.passengerInformation.emailAddress,
    phone: api.passengerInformation.phoneNumber,

    airport: api.route.fromLocation,
    destination: api.route.toLocation,

    date: api.pickupDate,
    time: api.pickupTime,

    tripType: normalizeTripType(api.tripType),
    timePeriod: api.timePeriod,

    price: api.price ?? null,
    paymentMethod: api.paymentType,
    paymentStatus: normalizePaymentStatus(api.paymentStatus),

    status: api.status,

    driver: api.driver?.fullName ?? null,
    vehicleType: api.vehicleType ?? null,

    passengers:
      (api.transferInformation?.adults ?? 0) +
        (api.transferInformation?.children ?? 0) || null,

    stripeRef: Boolean(api.paymentId),

    notes: api.passengerInformation.additionalInformation ?? "",

    raw: api,
  }),
  [],
);


  // Initial load from mock API
useEffect(() => {
  if (!hydrated || !admin) return;

  const currentAdmin = admin;

  async function load() {
    setAdminsLoading(true);
    setRoutesLoading(true);

    try {
      // ROUTES
      if (currentAdmin.permissions.routes) {
        const routesData = await getRoutes();
        setRoutes(routesData);
      } else {
        setRoutes([]);
      }

      // ADMINS
      if (currentAdmin.isSuperuser || currentAdmin.permissions.adminUsers) {
        const adminsData = await getAdminUsers();
        setAdmins(adminsData);
      } else {
        setAdmins([]);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setAdminsLoading(false);
      setRoutesLoading(false);
    }
  }

  load();
}, [hydrated, admin]);


  useEffect(() => {
    if (!admin?.permissions.drivers) return;

    async function loadDrivers() {
      setDriversLoading(true);

      const status =
        driverTab === "all"
          ? undefined
          : driverTab === "available"
            ? "available"
            : "unavailable";

      const response = await getDrivers({
        status,
        search: driverSearch || undefined,
      });

      setDrivers(response.drivers);
      setDriverCounts(response.counts);

      // 🔥 NEW: keep the rest of the backend data
      setDriverMeta({
        next: response.next,
        previous: response.previous,
      });

      setDriversLoading(false);
    }

    loadDrivers();
  }, [driverTab, driverSearch, admin]);

  useEffect(() => {
    const origins = Array.from(
      new Set(routes.map((r) => r.fromLocation).filter(Boolean)),
    );

    setExpandedRouteGroups(origins);
  }, [routes]);

  useEffect(() => {
    if (!admin) return;

    if (admin.isSuperuser) {
      setCurrentView("dashboard");
      return;
    }

    if (admin.permissions.bookings) setCurrentView("bookings");
    else if (admin.permissions.drivers) setCurrentView("drivers");
    else if (admin.permissions.routes) setCurrentView("routes");
    else setCurrentView("home");
  }, [admin]);

  useEffect(() => {
    if (!admin?.permissions.vehicles) return;

    async function loadVehicles() {
      setVehiclesLoading(true);

      const apiData = await getVehicles();
      setVehicles(apiData.map(mapApiToVehicle)); // 🔥 boundary conversion

      setVehiclesLoading(false);
    }

    loadVehicles();
  }, [admin]);

  useEffect(() => {
    if (!admin?.isSuperuser) return;

    async function loadActivityLogs() {
      try {
        const res = await getActivityLogs();
        setAuditLogs(res.logs);
      } catch (err) {
        console.error("Failed to load activity logs", err);
      }
    }

    loadActivityLogs();
  }, [admin]);

  useEffect(() => {
  if (!hydrated || !admin || !admin.permissions.bookings) return;

  async function loadBookings() {
    setBookingsLoading(true);

    try {
      const params = {
        passenger_name: bookingFilters.passenger_name || undefined,
        from_location: bookingFilters.from_location || undefined,
        to_location: bookingFilters.to_location || undefined,
        pickup_date: bookingFilters.pickup_date || undefined,
        return_date: bookingFilters.return_date || undefined,
        vehicle_type: bookingFilters.vehicle_type || undefined,
        status:
          bookingFilters.status !== "all"
            ? bookingFilters.status
            : undefined,
      };

      const bookingsData = await getBookings(params);
      setBookings(bookingsData.map(mapBookingApiToBooking));
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  }

  loadBookings();
}, [hydrated, admin, bookingFilters, mapBookingApiToBooking]);


  const activeRoute =
    activeModal?.type === "routeForm" ? activeModal.route : undefined;

  const routeFormInitial = useMemo<RouteFormInput | undefined>(() => {
    if (!activeRoute) return undefined;
    return mapRouteToFormInput(activeRoute);
  }, [activeRoute]);

  // Helpers
  const closeModal = () => setActiveModal(null);

  const toggleRouteGroup = (group: string) => {
    setExpandedRouteGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
    );
  };

  // BOOKINGS

  const handleViewBooking = (booking: Booking) => {
    setActiveModal({ type: "bookingDetails", booking });
  };

  const handleAssignDriverClick = (booking: Booking) => {
    setActiveModal({ type: "assignDriver", booking });
  };

  const handleExportBookings = () => {
    // you already have CSV logic; you can reuse it here or keep it simple for now
    // left empty so you can drop in your existing implementation
  };

  // DRIVERS

  const handleAddDriverClick = () => {
    setActiveModal({ type: "driverForm" });
  };

  const handleUpsertDriver = async (
    input: DriverFormInput,
    driverId?: string,
  ) => {
    if (driverId) {
      await updateDriver(driverId, {
        name: input.name,
        email: input.email,
        phone: input.phone,
        licenseNumber: input.licenseNumber,
        profilePicture: input.profilePicture,
      });
    } else {
      await createDriver(input);
    }

    const response = await getDrivers({
      status:
        driverTab === "all"
          ? undefined
          : driverTab === "available"
            ? "available"
            : "unavailable",
      search: driverSearch || undefined,
    });

    setDrivers(response.drivers);
    setDriverCounts(response.counts);
    setDriverMeta({
      next: response.next,
      previous: response.previous,
    });

    closeModal();
  };

  const handleEditDriverClick = (driver: Driver) => {
    setActiveModal({ type: "driverForm", driver });
  };
  const handleDeleteDriver = async (id: string) => {
    await deleteDriver(id);

    const response = await getDrivers({
      status:
        driverTab === "all"
          ? undefined
          : driverTab === "available"
            ? "available"
            : "unavailable",
      search: driverSearch || undefined,
    });

    setDrivers(response.drivers);
    setDriverCounts(response.counts);
    setDriverMeta({
      next: response.next,
      previous: response.previous,
    });
  };

  // ROUTES

  const handleAddRouteClick = () => {
    setActiveModal({ type: "routeForm" });
  };

  const handleEditRouteClick = (route: Route) => {
    setActiveModal({ type: "routeForm", route });
  };
  function mapRouteToFormInput(route: Route): RouteFormInput {
    return {
      fromLocation: route.fromLocation,
      toLocation: route.toLocation,

      metaTitle: route.metaTitle,
      metaDescription: route.metaDescription,
      heroTitle: route.heroTitle,
      subHeadline: route.subHeadline,
      body: route.body,

      distance: route.distance,
      time: route.time,

      sedanPrice: route.sedanPrice,
      vanPrice: route.vanPrice,

      whatMakesBetter: route.whatMakesBetter ?? [],
      whatsIncluded: route.whatsIncluded ?? [],
      destinationHighlights: route.destinationHighlights ?? [],
      idealFor: route.idealFor ?? [],

      vehicleOptions: (route.vehicleOptions ?? []).map((v) => ({
        id: v.id,
        vehicleType: v.vehicleType ?? "",
        idealFor: v.idealFor ?? "",
        maxPassengers: Number(v.maxPassengers ?? 0),
        fixedPrice: Number(v.fixedPrice ?? 0),
      })),

      faqs: route.faqs ?? [],

      image: null, // cannot preload File
      bookCtaLabel: route.bookCtaLabel,
      bookCtaSupport: route.bookCtaSupport,
    };
  }

  const handleSaveRoute = async (
    input: RouteFormInput,
    existingRoute?: Route,
  ) => {
    try {
      if (existingRoute) {
        const updated = await updateRoute(existingRoute.routeId, {
          fromLocation: input.fromLocation,
          toLocation: input.toLocation,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          heroTitle: input.heroTitle,
          subHeadline: input.subHeadline,
          body: input.body,
          distance: input.distance,
          time: input.time,
          sedanPrice: input.sedanPrice,
          vanPrice: input.vanPrice,

          // 🔥 REQUIRED
          faqs: input.faqs,
          vehicleOptions: input.vehicleOptions,

          whatMakesBetter: input.whatMakesBetter,
          whatsIncluded: input.whatsIncluded,
          destinationHighlights: input.destinationHighlights,
          idealFor: input.idealFor,

          image: input.image,
          bookCtaLabel: input.bookCtaLabel,
          bookCtaSupport: input.bookCtaSupport,
        });

        setRoutes((prev) =>
          prev.map((r) => (r.routeId === updated.routeId ? updated : r)),
        );
      } else {
        const created = await createRoute({
          fromLocation: input.fromLocation,
          toLocation: input.toLocation,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          heroTitle: input.heroTitle,
          subHeadline: input.subHeadline,
          body: input.body,
          distance: input.distance,
          time: input.time,
          sedanPrice: input.sedanPrice,
          vanPrice: input.vanPrice,

          whatMakesBetter: input.whatMakesBetter,
          whatsIncluded: input.whatsIncluded,
          destinationHighlights: input.destinationHighlights,
          idealFor: input.idealFor,

          // 🔥 REQUIRED
          faqs: input.faqs,
          vehicleOptions: input.vehicleOptions,

          image: input.image,
          bookCtaLabel: input.bookCtaLabel,
          bookCtaSupport: input.bookCtaSupport,
        });

        setRoutes((prev) => [...prev, created]);
      }

      // ✅ ONLY close modal if everything succeeded
      closeModal();
    } catch (err) {
      console.error("Failed to save route", err);
      throw err; // 🔥 lets RouteFormModal keep loading state + show error
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    await deleteRoute(routeId);
    setRoutes((prev) => prev.filter((r) => r.routeId !== routeId));
  };

  //VEHICLES

  const handleAddVehicleClick = () => {
    setActiveModal({ type: "vehicleForm" });
  };

  const handleEditVehicleClick = (vehicle: Vehicle) => {
    setActiveModal({ type: "vehicleForm", vehicle });
  };

  const handleUpsertVehicle = async (input: VehicleFormInput, id?: number) => {
    if (id) {
      await patchVehicle(id, input);
    } else {
      await createVehicle(input);
    }

    const apiData = await getVehicles();
    setVehicles(apiData.map(mapApiToVehicle));
    closeModal();
  };

  const handleDeleteVehicle = async (id: number) => {
    await deleteVehicle(id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // ADMINS

  const handleAddAdminClick = () => {
    setActiveModal({ type: "adminForm" });
  };

  const handleCreateAdmin = async (input: {
    name: string;
    email: string;
    phone: string;
    permissions: AdminUser["permissions"];
    dp?: File | null;
  }) => {
    try {
      setAdminError(null);
      setAdminSubmitting(true);

      await createAdmin(input);

      const updatedAdmins = await getAdminUsers();
      setAdmins(updatedAdmins);
      setAdminSubmitting(false);

      closeModal();
    } catch (err) {
      if (err instanceof Error) {
        setAdminSubmitting(false);
        setAdminError(err.message);
      } else {
        setAdminError("Failed to create admin.");
      }
    }
  };
  const handleUpdateAdmin = async (
    adminId: string,
    input: {
      name: string;
      email: string;
      phone: string;
      permissions: AdminUser["permissions"];
      dp?: File | null;
    },
  ) => {
    try {
      setAdminError(null);
      setAdminSubmitting(true);

      await updateAdmin(adminId, input);

      const updatedAdmins = await getAdminUsers();
      setAdminSubmitting(false);
      setAdmins(updatedAdmins);
      closeModal();
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : "Failed to update admin.",
      );
    }
  };

  const handleViewAdmin = async (id: string) => {
    setViewAdminLoading(true);
    setActiveModal({ type: "viewAdmin" });

    const admin = await getAdminById(id);
    setSelectedAdmin(admin);

    setViewAdminLoading(false);
  };

  const handleDeleteAdmin = async (id: string) => {
    await deleteAdmin(id);
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    closeModal();
  };

  const VIEW_TITLES: Record<AdminViewId, string> = {
    home: "Overview",
    dashboard: "Dashboard",
    bookings: "Bookings",
    drivers: "Drivers",
    routes: "Routes",
    vehicles: "Vehicles",
    admins: "Admin Users",
    audit: "Audit Logs",
  };

  // ───────────────────────── UI ─────────────────────────



if (!hydrated) {
  return <Loader />;
}


  if (!admin) {
    router.replace("/admin/login");
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        admin={admin} // ⭐ REQUIRED
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={() => {
          logout();
          router.replace("/admin/login");
        }}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">
            {VIEW_TITLES[currentView]}
          </h1>
        </header>

        <section className="flex-1 overflow-y-auto px-6 py-6 bg-slate-950">
          {/* 🏠 HOME */}
          {currentView === "home" && <AdminHome />}

          {currentView === "dashboard" && (
            <DashboardView
              stats={stats}
              bookings={bookings}
              onOpenBooking={handleViewBooking}
            />
          )}

          {currentView === "bookings" && admin?.permissions.bookings && (
            <BookingsView
              bookings={bookings}
              loading={bookingsLoading}
              filters={bookingFilters}
              setFilters={setBookingFilters}
              onExport={handleExportBookings}
              onViewBooking={handleViewBooking}
              onAssignDriver={handleAssignDriverClick}
            />
          )}

          {currentView === "drivers" && admin?.permissions.drivers && (
            <DriversView
              drivers={drivers}
              counts={driverCounts}
              activeTab={driverTab}
              onTabChange={setDriverTab}
              search={driverSearch}
              onSearchChange={setDriverSearch}
              onAddDriver={handleAddDriverClick}
              onDeleteDriver={handleDeleteDriver}
              onEditDriver={handleEditDriverClick} // ✅
              loading={driversLoading}
              pagination={driverMeta}
            />
          )}

          {currentView === "routes" && (
            <RoutesView
              routes={routes}
              loading={routesLoading}
              expandedGroups={expandedRouteGroups}
              toggleGroup={toggleRouteGroup}
              onAddRoute={handleAddRouteClick}
              onEditRoute={handleEditRouteClick}
              onDeleteRoute={handleDeleteRoute}
            />
          )}

          {currentView === "vehicles" && admin.permissions.vehicles && (
            <VehiclesView
              vehicles={vehicles}
              loading={vehiclesLoading}
              onAdd={handleAddVehicleClick}
              onEdit={handleEditVehicleClick}
              onDelete={handleDeleteVehicle} // ✅ CORRECT
            />
          )}

          {currentView === "admins" && (
            <AdminUsersView
              admins={admins}
              loading={adminsLoading}
              onAddAdmin={handleAddAdminClick}
              onViewAdmin={handleViewAdmin}
            />
          )}

          {currentView === "audit" && admin.isSuperuser && (
            <AuditLogsView logs={auditLogs} onDownload={downloadActivityLogs} />
          )}
        </section>
      </main>

      {/* MODALS */}
      {activeModal?.type === "bookingDetails" && (
        <BookingDetailsModal
          open
          booking={activeModal.booking}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "assignDriver" && (
        <AssignDriverModal
          open
          booking={activeModal.booking}
          onSuccess={() => {
            // refresh bookings
            setBookingFilters({ ...bookingFilters });
          }}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "driverForm" && (
        <DriverFormModal
          open
          initialData={activeModal.driver ?? null}
          onSubmit={handleUpsertDriver} // ✅ ONE handler
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "routeForm" && (
        <RouteFormModal
          open
          initial={routeFormInitial}
          onSubmit={(input) => handleSaveRoute(input, activeModal.route)}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "adminForm" && (
        <AdminUserFormModal
          key={activeModal.admin ? `edit-${activeModal.admin.id}` : "create"}
          open
          mode={activeModal.admin ? "edit" : "create"}
          initialData={activeModal.admin ?? null}
          error={adminError}
          submitting={adminSubmitting}
          onClose={closeModal}
          onSubmit={(input) => {
            if (activeModal.admin) {
              handleUpdateAdmin(activeModal.admin.id, input);
            } else {
              handleCreateAdmin(input);
            }
          }}
        />
      )}

      {activeModal?.type === "vehicleForm" && (
        <VehicleFormModal
          open
          initial={activeModal.vehicle ?? null}
          onSubmit={handleUpsertVehicle}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "viewAdmin" && (
        <AdminUserDetailsModal
          open
          admin={selectedAdmin}
          loading={viewAdminLoading}
          onClose={closeModal}
          onEdit={(admin) => {
            closeModal();
            setActiveModal({ type: "adminForm", admin });
          }}
          onDelete={handleDeleteAdmin}
        />
      )}
    </div>
  );
}
