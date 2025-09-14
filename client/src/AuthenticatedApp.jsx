import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/app/Dashboard";
import StudyNotes from "./pages/app/StudyNotes";
import StudyNoteDetail from "./pages/app/StudyNoteDetail";
import AppLayout from "./components/layout/AppLayout";

export default function AuthenticatedApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Parent route with layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/study-notes" element={<StudyNotes />} />
          <Route path="/study-notes/:id" element={<StudyNoteDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
