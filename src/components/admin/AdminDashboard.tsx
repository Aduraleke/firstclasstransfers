"use client";

import { useEffect, useState } from "react";
import { AdminSidebar, AdminViewId } from "@/components/admin/AdminSidebar";
import { DashboardView } from "@/components/admin/DashboardView";
import { BookingsView } from "@/components/admin/BookingView";
import { DriversView } from "@/components/admin/DriversView";
import { PricingView } from "@/components/admin/PricingView";
import { RoutesView } from "@/components/admin/RouteView";
import { PaymentsView } from "@/components/admin/PaymentView";
import { EmailsView } from "@/components/admin/EmailsView";
import { AdminUsersView } from "@/components/admin/AdminUserView";
import { AuditLogsView } from "@/components/admin/AuditLogsView";

import {
  Booking,
  Driver,
  PriceRule,
  Route,
  PaymentSession,
  EmailNotification,
  AdminUser,
  AuditLog,
  DashboardStats,
} from "@/lib/admin/types";

import {
  getBookings,
  assignDriverToBooking,
  getDrivers,
  createDriver,
  deleteDriverById,
  getPrices,
  createPriceRule,
  updatePriceRule,
  deletePriceRule,
  getRoutes,
  createRoute,
  updateRoute,
  deleteRouteById,
  getPaymentSessions,
  createPaymentSessionForBooking,
  updatePaymentStatus,
  getEmailNotifications,
  sendCustomEmail,
  sendBookingEmail,
  getAdminUsers,
  createAdminUser,
  deactivateAdmin,
  getAuditLogs,
  addAuditLog,
} from "@/lib/admin/mocApi";


import { BookingDetailsModal } from "@/components/admin/modals/BookingDetailsModal";
import { AssignDriverModal } from "@/components/admin/modals/AssignDriverModal";
import { DriverFormModal } from "@/components/admin/modals/DriverFormModal";
import { PriceRuleFormModal } from "@/components/admin/modals/PriceRuleFormModal";
import { RouteFormModal } from "@/components/admin/modals/RouteFormModal";
import { AdminUserFormModal } from "@/components/admin/modals/AdminUserFormModal";

type ActiveModal =
  | { type: "bookingDetails"; booking: Booking }
  | { type: "assignDriver"; booking: Booking }
  | { type: "driverForm" }
  | { type: "priceForm"; price?: PriceRule }
  | { type: "routeForm"; route?: Route }
  | { type: "adminForm" }
  | null;

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<AdminViewId>("dashboard");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [prices, setPrices] = useState<PriceRule[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [paymentSessions, setPaymentSessions] = useState<PaymentSession[]>([]);
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Simple local-only UI state
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");

  const [composeEmail, setComposeEmail] = useState({
    to: "",
    subject: "",
    message: "",
    recipientName: "",
  });

  const [selectedBookingIdForPayment, setSelectedBookingIdForPayment] = useState("");

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Stats derived from bookings
  const stats: DashboardStats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "Pending").length,
    completedToday: 0, // you can compute this later based on date
    revenue: "€0", // you can compute from payments later
  };

  // Initial load from mock API
  useEffect(() => {
    async function load() {
      const [
        bookingsData,
        driversData,
        pricesData,
        routesData,
        paymentsData,
        emailsData,
        adminsData,
        auditsData,
      ] = await Promise.all([
        getBookings(),
        getDrivers(),
        getPrices(),
        getRoutes(),
        getPaymentSessions(),
        getEmailNotifications(),
        getAdminUsers(),
        getAuditLogs(),
      ]);

      setBookings(bookingsData);
      setDrivers(driversData);
      setPrices(pricesData);
      setRoutes(routesData);
      setPaymentSessions(paymentsData);
      setEmails(emailsData);
      setAdmins(adminsData);
      setAuditLogs(auditsData);
    }

    load();
  }, []);

  // Helpers
  const closeModal = () => setActiveModal(null);

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
    const log = await addAuditLog({
      adminName: "Admin User",
      action: "assign_driver",
      details: `Assigned driver ${driverName} to booking ${bookingId}`,
      ipAddress: "127.0.0.1",
    });
    setAuditLogs((prev) => [log, ...prev]);
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

  const handleCreateDriver = async (input: { name: string; phone: string; vehicle: string }) => {
    const driver = await createDriver(input);
    setDrivers((prev) => [...prev, driver]);
    const log = await addAuditLog({
      adminName: "Admin User",
      action: "create_driver",
      details: `Created driver ${driver.name}`,
      ipAddress: "127.0.0.1",
    });
    setAuditLogs((prev) => [log, ...prev]);
    closeModal();
  };

  const handleDeleteDriver = async (id: string) => {
    await deleteDriverById(id);
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    const log = await addAuditLog({
      adminName: "Admin User",
      action: "delete_driver",
      details: `Deleted driver ${id}`,
      ipAddress: "127.0.0.1",
    });
    setAuditLogs((prev) => [log, ...prev]);
  };

  // PRICING

  const handleAddPriceClick = () => {
    setActiveModal({ type: "priceForm" });
  };

  const handleEditPriceClick = (price: PriceRule) => {
    setActiveModal({ type: "priceForm", price });
  };

  const handleSavePrice = async (input: Omit<PriceRule, "id">, existingId?: number) => {
    if (existingId) {
      const updated = await updatePriceRule(existingId, input);
      if (!updated) return;
      setPrices((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      const log = await addAuditLog({
        adminName: "Admin User",
        action: "edit_price",
        details: `Updated price rule ${updated.id}`,
        ipAddress: "127.0.0.1",
      });
      setAuditLogs((prev) => [log, ...prev]);
    } else {
      const created = await createPriceRule(input);
      setPrices((prev) => [...prev, created]);
      const log = await addAuditLog({
        adminName: "Admin User",
        action: "create_price",
        details: `Created price rule ${created.id}`,
        ipAddress: "127.0.0.1",
      });
      setAuditLogs((prev) => [log, ...prev]);
    }
    closeModal();
  };

  const handleDeletePrice = async (id: number) => {
    await deletePriceRule(id);
    setPrices((prev) => prev.filter((p) => p.id !== id));
  };

  // ROUTES

  const handleAddRouteClick = () => {
    setActiveModal({ type: "routeForm" });
  };

  const handleEditRouteClick = (route: Route) => {
    setActiveModal({ type: "routeForm", route });
  };

  const handleSaveRoute = async (input: Omit<Route, "id">, existingId?: number) => {
    if (existingId) {
      const updated = await updateRoute(existingId, input);
      if (!updated) return;
      setRoutes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } else {
      const created = await createRoute(input);
      setRoutes((prev) => [...prev, created]);
    }
    closeModal();
  };

  const handleDeleteRoute = async (id: number) => {
    await deleteRouteById(id);
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  // PAYMENTS

  const handleCreatePaymentSession = async (bookingId: string) => {
    const session = await createPaymentSessionForBooking(bookingId);
    if (!session) return;
    setPaymentSessions((prev) => [session, ...prev]);
    const log = await addAuditLog({
      adminName: "Admin User",
      action: "create_payment_session",
      details: `Created payment session for booking ${bookingId}`,
      ipAddress: "127.0.0.1",
    });
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleUpdatePaymentStatus = async (sessionId: string, status: PaymentSession["status"]) => {
    const updated = await updatePaymentStatus(sessionId, status);
    if (!updated) return;
    setPaymentSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    const log = await addAuditLog({
      adminName: "Admin User",
      action: "update_payment_status",
      details: `Updated payment ${sessionId} to ${status}`,
      ipAddress: "127.0.0.1",
    });
    setAuditLogs((prev) => [log, ...prev]);
  };

  // EMAILS

  const handleSendCustomEmail = async () => {
    if (!composeEmail.to || !composeEmail.subject || !composeEmail.message) return;
    const email = await sendCustomEmail(composeEmail.to, composeEmail.subject);
    setEmails((prev) => [email, ...prev]);

    const log = await addAuditLog({
      adminName: "Admin User",
      action: "send_custom_email",
      details: `Sent custom email to ${composeEmail.to}`,
      ipAddress: "127.0.0.1",
    });
    setAuditLogs((prev) => [log, ...prev]);

    setComposeEmail({ to: "", subject: "", message: "", recipientName: "" });
  };

  const handleSendBookingEmail = async (bookingId: string, type: EmailNotification["type"]) => {
    const email = await sendBookingEmail(bookingId, type);
    if (!email) return;
    setEmails((prev) => [email, ...prev]);

    const log = await addAuditLog({
      adminName: "Admin User",
      action: "send_booking_email",
      details: `Sent ${type} email for booking ${bookingId}`,
      ipAddress: "127.0.0.1",
    });
    setAuditLogs((prev) => [log, ...prev]);
  };

  // ADMINS

  const handleAddAdminClick = () => {
    setActiveModal({ type: "adminForm" });
  };

  const handleCreateAdmin = async (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "super_admin" | "admin";
    permissions: AdminUser["permissions"];
  }) => {
    const admin = await createAdminUser({
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: input.role,
      permissions: input.permissions,
    });
    setAdmins((prev) => [...prev, admin]);
    const log = await addAuditLog({
      adminName: "Admin User",
      action: "create_admin",
      details: `Created admin ${admin.name}`,
      ipAddress: "127.0.0.1",
    });
    setAuditLogs((prev) => [log, ...prev]);
    closeModal();
  };

  const handleDeactivateAdmin = async (id: string) => {
    const updated = await deactivateAdmin(id);
    if (!updated) return;
    setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    const log = await addAuditLog({
      adminName: "Admin User",
      action: "deactivate_admin",
      details: `Deactivated admin ${updated.name}`,
      ipAddress: "127.0.0.1",
    });
    setAuditLogs((prev) => [log, ...prev]);
  };

  // ───────────────────────── UI ─────────────────────────

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={() => {
          // later you’ll hook real auth here
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
            <DashboardView stats={stats} bookings={bookings} onOpenBooking={handleViewBooking} />
          )}

          {currentView === "bookings" && (
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

          {currentView === "drivers" && (
            <DriversView drivers={drivers} onAddDriver={handleAddDriverClick} onDeleteDriver={handleDeleteDriver} />
          )}

          {currentView === "pricing" && (
            <PricingView
              prices={prices}
              onAddPrice={handleAddPriceClick}
              onEditPrice={handleEditPriceClick}
              onDeletePrice={handleDeletePrice}
            />
          )}

          {currentView === "routes" && (
            <RoutesView
              routes={routes}
              expandedGroups={[...new Set(routes.map((r) => r.origin))]}
              toggleGroup={() => {}}
              onAddRoute={handleAddRouteClick}
              onEditRoute={handleEditRouteClick}
              onDeleteRoute={handleDeleteRoute}
            />
          )}

          {currentView === "payments" && (
            <PaymentsView
              bookings={bookings}
              selectedBookingId={selectedBookingIdForPayment}
              setSelectedBookingId={setSelectedBookingIdForPayment}
              paymentSessions={paymentSessions}
              onCreateSession={handleCreatePaymentSession}
              onUpdateStatus={handleUpdatePaymentStatus}
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
            <AdminUsersView admins={admins} onAddAdmin={handleAddAdminClick} onDeactivate={handleDeactivateAdmin} />
          )}

          {currentView === "audit" && <AuditLogsView logs={auditLogs} />}

          {currentView === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              {/* You can move your SettingsView here later */}
            </div>
          )}
        </section>
      </main>

      {/* MODALS */}
      {activeModal?.type === "bookingDetails" && (
        <BookingDetailsModal open booking={activeModal.booking} onClose={closeModal} />
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
        <DriverFormModal open onSubmit={handleCreateDriver} onClose={closeModal} />
      )}

      {activeModal?.type === "priceForm" && (
        <PriceRuleFormModal
          open
          initial={activeModal.price}
          onSubmit={handleSavePrice}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "routeForm" && (
        <RouteFormModal
          open
          initial={activeModal.route}
          onSubmit={handleSaveRoute}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "adminForm" && <AdminUserFormModal open onSubmit={handleCreateAdmin} onClose={closeModal} />}
    </div>
  );
}
