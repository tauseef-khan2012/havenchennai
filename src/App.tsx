import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Stay from "./pages/Stay";
import StayAmenities from "./pages/stay/StayAmenities";
import StayDeckViews from "./pages/stay/StayDeckViews";
import StayLocation from "./pages/stay/StayLocation";
import Experiences from "./pages/Experiences";
import ExperienceDetail from "./pages/ExperienceDetail";
import Packages from "./pages/Packages";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import BookingPage from "./pages/BookingPage";
import BookingConfirmationPage from "./components/booking/BookingConfirmationPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Location from "./pages/Location";
import Gallery from "./pages/Gallery";
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import PaymentPage from '@/pages/PaymentPage';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/stay" element={<Stay />} />
              <Route path="/stay/amenities" element={<StayAmenities />} />
              <Route path="/stay/deck-views" element={<StayDeckViews />} />
              <Route path="/stay/location" element={<StayLocation />} />
              <Route path="/location" element={<Location />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
              <Route path="/booking/payment" element={<PaymentPage />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/experiences/:id" element={<ExperienceDetail />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </QueryClientProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
