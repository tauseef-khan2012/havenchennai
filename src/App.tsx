
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { CookieConsent } from "./components/shared/CookieConsent";
import { Loader2 } from "lucide-react";

// Lazy load all pages for better code splitting
const Index = lazy(() => import("./pages/Index"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Stay = lazy(() => import("./pages/Stay"));
const StayAmenities = lazy(() => import("./pages/stay/StayAmenities"));
const StayDeckViews = lazy(() => import("./pages/stay/StayDeckViews"));
const StayLocation = lazy(() => import("./pages/stay/StayLocation"));
const Experiences = lazy(() => import("./pages/Experiences"));
const ExperienceDetail = lazy(() => import("./pages/ExperienceDetail"));
const Packages = lazy(() => import("./pages/Packages"));
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const BookingPaymentPage = lazy(() => import("./pages/BookingPaymentPage"));
const BookingConfirmationPage = lazy(() => import("./components/booking/BookingConfirmationPage"));
const BookingCheckout = lazy(() => import("./pages/BookingCheckout"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Gallery = lazy(() => import("./pages/Gallery"));

const queryClient = new QueryClient();

// Component to handle scroll reset on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-haven-beige bg-opacity-10">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-haven-green" />
      <p className="text-gray-600 font-serif">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <TooltipProvider>
            <ScrollToTop />
            <Toaster />
            <Sonner />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/stay" element={<Stay />} />
                <Route path="/stay/amenities" element={<StayAmenities />} />
                <Route path="/stay/deck-views" element={<StayDeckViews />} />
                <Route path="/stay/location" element={<StayLocation />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/booking/checkout" element={<BookingCheckout />} />
                <Route path="/booking/payment" element={<BookingPaymentPage />} />
                <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
                <Route path="/experiences" element={<Experiences />} />
                <Route path="/experiences/:id" element={<ExperienceDetail />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <CookieConsent />
          </TooltipProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
