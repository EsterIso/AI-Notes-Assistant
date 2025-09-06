import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/app/Dashboard';

export default function AuthenticatedApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* other authenticated routes */}
      </Routes>
    </BrowserRouter>
  );
}
