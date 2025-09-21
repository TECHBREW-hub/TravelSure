import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ChatBot } from "./components/ChatBot";
import { HomePage } from "./pages/HomePage";
import { PackagesPage } from "./pages/PackagesPage";
import { HotelsPage } from "./pages/HotelsPage";
import { ExperiencesPage } from "./pages/ExperiencesPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { HelpPage } from "./pages/HelpPage";
import { AppProvider } from "./contexts/AppContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/packages"
              element={<PackagesPage />}
            />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route
              path="/experiences"
              element={<ExperiencesPage />}
            />
            <Route
              path="/my-bookings"
              element={<MyBookingsPage />}
            />
            <Route path="/help" element={<HelpPage />} />
            {/* Catch-all route for any unmatched paths */}
            <Route path="*" element={<HomePage />} />
          </Routes>
          <Footer />
          <ChatBot />
          <Toaster />
        </div>
      </Router>
    </AppProvider>
  );
}