import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import LoginForm from "./components/auth/LoginForm";
import TenantDashboard from "./components/dashboard/TenantDashboard";
import LandlordDashboard from "./components/dashboard/LandlordDashboard";
import ContractorDashboard from "./components/dashboard/ContractorDashboard";
import MaintenanceRequestManager from "./components/maintenance/MaintenanceRequestManager";
import MaintenanceRequestForm from "./components/maintenance/MaintenanceRequestForm";
import TenantManagement from "./components/tenant/TenantManagement";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tenant" element={<LoginForm userType="tenant" />} />
          <Route path="/landlord" element={<LoginForm userType="landlord" />} />
          <Route
            path="/contractor"
            element={<LoginForm userType="contractor" />}
          />
          <Route path="/tenant-dashboard" element={<TenantDashboard />} />
          <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
          <Route
            path="/contractor-dashboard"
            element={<ContractorDashboard />}
          />
          <Route
            path="/maintenance-requests"
            element={<MaintenanceRequestManager />}
          />
          <Route
            path="/new-maintenance-request"
            element={<MaintenanceRequestForm />}
          />
          <Route path="/tenant-management" element={<TenantManagement />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
