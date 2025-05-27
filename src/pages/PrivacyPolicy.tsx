
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-haven-dark mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-8">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  1. Introduction
                </h2>
                <p className="text-gray-700 mb-4">
                  Welcome to Haven ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  2. Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Name and contact information (email, phone number)</li>
                      <li>Booking and payment information</li>
                      <li>Communication preferences</li>
                      <li>Guest preferences and special requests</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Usage Information</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Website usage data and analytics</li>
                      <li>IP address and browser information</li>
                      <li>Cookies and similar technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  3. How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>To process and manage your bookings</li>
                  <li>To provide customer support and communication</li>
                  <li>To improve our services and website experience</li>
                  <li>To send relevant updates and marketing communications (with your consent)</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  4. Information Sharing
                </h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To trusted service providers who assist in operating our website and services</li>
                  <li>When required by law or to protect our rights and safety</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  5. Data Security
                </h2>
                <p className="text-gray-700">
                  We implement appropriate security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. This includes secure hosting, encryption, and regular security assessments.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  6. Your Rights
                </h2>
                <p className="text-gray-700 mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Rectify inaccurate or incomplete data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to or restrict processing of your data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  7. Cookies
                </h2>
                <p className="text-gray-700">
                  We use cookies to enhance your experience on our website. You can control cookie settings through your browser, 
                  though this may affect website functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  8. Contact Us
                </h2>
                <p className="text-gray-700">
                  If you have questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@haven-stays.com<br />
                    <strong>Phone:</strong> +91 98765 43210<br />
                    <strong>Address:</strong> Muttukadu Lake Area, ECR, Tamil Nadu, India
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  9. Changes to This Policy
                </h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                  Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
