
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="py-16 bg-haven-beige bg-opacity-10 min-h-screen" 
        style={{
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('/lovable-uploads/e4f31ab2-de64-417b-af9f-97d3d17e2f47.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
        <div className="container-custom max-w-md">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};
