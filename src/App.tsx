import {Suspense} from "react";
import {useRoutes, Routes, Route, Navigate} from "react-router-dom";
import Home from "./components/home";
import LoginForm from "./components/auth/LoginForm";
import TenantDashboard from "./components/dashboard/TenantDashboard";
import LandlordDashboard from "./components/dashboard/LandlordDashboard";
import ContractorDashboard from "./components/dashboard/ContractorDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import MaintenanceRequestManager from "./components/maintenance/MaintenanceRequestManager";
import MaintenanceRequestForm from "./components/maintenance/MaintenanceRequestForm";
import TenantManagement from "./components/tenant/TenantManagement";
import routes from "tempo-routes";
import {ToastContainer} from "react-toastify";
import {AuthProvider} from "./components/auth/AuthProvider";
import {useStore} from "./lib/zustand";
import Settings from "./components/settings/Settings";

// Protected Route Component
const ProtectedRoute = ({children, allowedRoles = [], redirectTo = "/"}) => {
   const user = useStore(state => state.user);

   // If no user or no UID, redirect to login
   if (!user || !user.uid) {
      return <Navigate to={redirectTo} replace />;
   }

   // If roles are specified and user doesn't have an allowed role
   if (allowedRoles.length > 0 && (!user.role || !allowedRoles.includes(user.role))) {
      return <Navigate to={redirectTo} replace />;
   }

   return <>{children}</>;
};

function App() {
   const user = useStore(state => state.user);
   return (
      <AuthProvider>
         <Suspense fallback={<p>Loading...</p>}>
            <ToastContainer />
            <>
               {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
               <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/tenant" element={<LoginForm userType="tenant" />} />
                  <Route path="/landlord" element={<LoginForm userType="landlord" />} />
                  <Route path="/contractor" element={<LoginForm userType="contractor" />} />

                  {/* Protected Routes */}
                  <Route
                     path="/tenant-dashboard"
                     element={
                        <ProtectedRoute allowedRoles={["tenants"]} redirectTo="/tenant">
                           <TenantDashboard tenantName={user.userName || ""} propertyAddress={""} />
                        </ProtectedRoute>
                     }
                  />

                  <Route
                     path="/landlord-dashboard"
                     element={
                        <ProtectedRoute allowedRoles={["landlords"]} redirectTo="/landlord">
                           <LandlordDashboard />
                        </ProtectedRoute>
                     }
                  />

                  <Route
                     path="/contractor-dashboard"
                     element={
                        <ProtectedRoute allowedRoles={["contractors"]} redirectTo="/contractor">
                           <ContractorDashboard />
                        </ProtectedRoute>
                     }
                  />

                  <Route
                     path="/admin-dashboard"
                     element={
                        <ProtectedRoute allowedRoles={["admin"]} redirectTo="/">
                           <AdminDashboard />
                        </ProtectedRoute>
                     }
                  />

                  <Route
                     path="/maintenance-requests"
                     element={
                        <ProtectedRoute allowedRoles={["landlords", "tenants", "contractors"]} redirectTo="/">
                           <MaintenanceRequestManager />
                        </ProtectedRoute>
                     }
                  />

                  <Route
                     path="/new-maintenance-request"
                     element={
                        <ProtectedRoute allowedRoles={["tenants"]} redirectTo="/tenant">
                           <MaintenanceRequestForm />
                        </ProtectedRoute>
                     }
                  />

                  <Route
                     path="/tenant-management"
                     element={
                        <ProtectedRoute allowedRoles={["landlords"]} redirectTo="/landlord">
                           <TenantManagement />
                        </ProtectedRoute>
                     }
                  />

                  {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
               </Routes>
            </>
         </Suspense>
      </AuthProvider>
   );
}

export default App;
