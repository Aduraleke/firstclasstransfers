"use client";

import { useEffect, useState, useMemo } from "react";

import { AdminSidebar, AdminViewId } from "@/components/admin/AdminSidebar";
import { DashboardView } from "@/components/admin/DashboardView";
import { BookingsView } from "@/components/admin/BookingView";
import { DriversView } from "@/components/admin/DriversView";
import { RoutesView } from "@/components/admin/RouteView";

import { EmailsView } from "@/components/admin/EmailsView";
import { AdminUsersView } from "@/components/admin/AdminUserView";
// import { AuditLogsView } from "@/components/admin/AuditLogsView";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/api/admin/auth/authStore";
import type { RouteFormInput } from "@/components/admin/modals/RouteFormModal";

import {
  Booking,
  EmailNotification,
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
  getBookings,
  assignDriverToBooking,
  deleteDriverById,
  getEmailNotifications,
  sendCustomEmail,
  sendBookingEmail,
  // getAuditLogs,
  // addAuditLog,
} from "@/lib/api/admin/mocApi";

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
} from "@/lib/api/admin/driverUsers";

type ActiveModal =
  | { type: "bookingDetails"; booking: Booking }
  | { type: "assignDriver"; booking: Booking }
  | { type: "driverForm" }
  | { type: "routeForm"; route?: Route }
  | { type: "adminForm"; admin?: AdminUser }
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

  const [driverTab, setDriverTab] = useState<
    "all" | "available" | "unavailable"
  >("all");

  const [driverSearch, setDriverSearch] = useState("");
  const [driversLoading, setDriversLoading] = useState(false);

  const [routes, setRoutes] = useState<Route[]>([]);

  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [viewAdminLoading, setViewAdminLoading] = useState(false);
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  // const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Simple local-only UI state
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");

  const [composeEmail, setComposeEmail] = useState({
    to: "",
    subject: "",
    message: "",
    recipientName: "",
  });

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [routesLoading, setRoutesLoading] = useState(true);

  const [expandedRouteGroups, setExpandedRouteGroups] = useState<string[]>([]);

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

  // Initial load from mock API
  useEffect(() => {
    if (!hydrated || !admin) return;

    const currentAdmin = admin; // 👈 snapshot (now non-null)

    async function load() {
      setAdminsLoading(true);
      setRoutesLoading(true);

      try {
        // BOOKINGS
        if (currentAdmin.permissions.bookings) {
          const bookingsData = await getBookings();
          setBookings(bookingsData);

          const emailsData = await getEmailNotifications();
          setEmails(emailsData);
        } else {
          setBookings([]);
          setEmails([]);
        }

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

      const { drivers, counts } = await getDrivers({
        status,
        search: driverSearch || undefined,
      });

      setDrivers(drivers);
      setDriverCounts(counts);
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

    if (admin.permissions.bookings) setCurrentView("bookings");
    else if (admin.permissions.drivers) setCurrentView("drivers");
    else if (admin.permissions.routes) setCurrentView("routes");
    else setCurrentView("dashboard");
  }, [admin]);

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

  const handleAssignDriver = async (bookingId: string, driverName: string) => {
    const updated = await assignDriverToBooking(bookingId, driverName);
    if (!updated) return;
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    // const log = await addAuditLog({
    //   adminName: "Admin User",
    //   action: "assign_driver",
    //   details: `Assigned driver ${driverName} to booking ${bookingId}`,
    //   ipAddress: "127.0.0.1",
    // });
    // setAuditLogs((prev) => [log, ...prev]);
    closeModal();
  };

  const handleExportBookings = () => {
    // you already have CSV logic; you can reuse it here or keep it simple for now
    // left empty so you can drop in your existing implementation
  };

  // DRIVERS

  const handleAddDriverClick = () => {
    setActiveModal({ type: "driverForm" });
  };

  
  const handleCreateDriver = async (input: DriverFormInput) => {
  await createDriver({
    name: input.name,
    email: input.email,
    phone: input.phone,
    licenseNumber: input.licenseNumber,
    profilePicture: input.profilePicture,
  })

  const status =
    driverTab === "all"
      ? undefined
      : driverTab === "available"
      ? "available"
      : "unavailable"

  const { drivers, counts } = await getDrivers({
    status,
    search: driverSearch || undefined,
  })

  setDrivers(drivers)
  setDriverCounts(counts)
}


  const handleDeleteDriver = async (id: string) => {
    await deleteDriverById(id);
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    // const log = await addAuditLog({
    //   adminName: "Admin User",
    //   action: "delete_driver",
    //   details: `Deleted driver ${id}`,
    //   ipAddress: "127.0.0.1",
    // });
    // setAuditLogs((prev) => [log, ...prev]);
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

  // EMAILS

  const handleSendCustomEmail = async () => {
    if (!composeEmail.to || !composeEmail.subject || !composeEmail.message)
      return;
    const email = await sendCustomEmail(composeEmail.to, composeEmail.subject);
    setEmails((prev) => [email, ...prev]);

    // const log = await addAuditLog({
    //   adminName: "Admin User",
    //   action: "send_custom_email",
    //   details: `Sent custom email to ${composeEmail.to}`,
    //   ipAddress: "127.0.0.1",
    // });
    // setAuditLogs((prev) => [log, ...prev]);

    setComposeEmail({ to: "", subject: "", message: "", recipientName: "" });
  };

  const handleSendBookingEmail = async (
    bookingId: string,
    type: EmailNotification["type"],
  ) => {
    const email = await sendBookingEmail(bookingId, type);
    if (!email) return;
    setEmails((prev) => [email, ...prev]);

    // const log = await addAuditLog({
    //   adminName: "Admin User",
    //   action: "send_booking_email",
    //   details: `Sent ${type} email for booking ${bookingId}`,
    //   ipAddress: "127.0.0.1",
    // });
    // setAuditLogs((prev) => [log, ...prev]);
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

  // ───────────────────────── UI ─────────────────────────

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Loading admin session…
      </div>
    );
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
            {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
          </h1>
        </header>

        <section className="flex-1 overflow-y-auto px-6 py-6 bg-slate-950">
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
              search={bookingSearch}
              setSearch={setBookingSearch}
              statusFilter={bookingStatusFilter}
              setStatusFilter={setBookingStatusFilter}
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
              loading={driversLoading}
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

          {currentView === "emails" && (
            <EmailsView
              bookings={bookings}
              emails={emails}
              composeEmail={composeEmail}
              setComposeEmail={setComposeEmail}
              onSendCustom={handleSendCustomEmail}
              onSendBookingEmail={handleSendBookingEmail}
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

          {/* {currentView === "audit" && <AuditLogsView logs={auditLogs} />} */}
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
          drivers={drivers}
          onAssign={handleAssignDriver}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "driverForm" && (
        <DriverFormModal
          open
          onSubmit={handleCreateDriver}
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
