import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/app/Dashboard";
import AppLayout from "./components/layout/AppLayout";

export default function AuthenticatedApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Parent route with layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          {/* Add other authenticated routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
