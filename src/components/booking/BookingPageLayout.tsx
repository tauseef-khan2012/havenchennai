
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface BookingPageLayoutProps {
  children: React.ReactNode;
}

export const BookingPageLayout: React.FC<BookingPageLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};
