
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/shared/PageHero';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageHero 
        title="Privacy Policy"
        subtitle="How we protect and handle your personal information"
        backgroundImage="/lovable-uploads/0bf49c3a-e3e0-4828-badd-a492dc4dd957.png"
      />
      
      <main className="flex-1 bg-white">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-haven-navy/60 mb-8 text-lg">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  1. Introduction
                </h2>
                <p className="text-haven-navy/80 mb-4 leading-relaxed">
                  Welcome to Haven ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  2. Information We Collect
                </h2>
                <div className="space-y-6">
                  <div className="bg-haven-beige/50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-haven-navy mb-3">Personal Information</h3>
                    <ul className="list-disc pl-6 text-haven-navy/80 space-y-2">
                      <li>Name and contact information (email, phone number)</li>
                      <li>Booking and payment information</li>
                      <li>Communication preferences</li>
                      <li>Guest preferences and special requests</li>
                    </ul>
                  </div>
                  <div className="bg-haven-beige/50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-haven-navy mb-3">Usage Information</h3>
                    <ul className="list-disc pl-6 text-haven-navy/80 space-y-2">
                      <li>Website usage data and analytics</li>
                      <li>IP address and browser information</li>
                      <li>Cookies and similar technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  3. How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 text-haven-navy/80 space-y-3">
                  <li>To process and manage your bookings</li>
                  <li>To provide customer support and communication</li>
                  <li>To improve our services and website experience</li>
                  <li>To send relevant updates and marketing communications (with your consent)</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  4. Information Sharing
                </h2>
                <p className="text-haven-navy/80 mb-4 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-haven-navy/80 space-y-3">
                  <li>With your explicit consent</li>
                  <li>To trusted service providers who assist in operating our website and services</li>
                  <li>When required by law or to protect our rights and safety</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  5. Data Security
                </h2>
                <p className="text-haven-navy/80 leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. This includes secure hosting, encryption, and regular security assessments.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  6. Your Rights
                </h2>
                <p className="text-haven-navy/80 mb-4 leading-relaxed">You have the right to:</p>
                <ul className="list-disc pl-6 text-haven-navy/80 space-y-3">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Rectify inaccurate or incomplete data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to or restrict processing of your data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  7. Cookies
                </h2>
                <p className="text-haven-navy/80 leading-relaxed">
                  We use cookies to enhance your experience on our website. You can control cookie settings through your browser, 
                  though this may affect website functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  8. Contact Us
                </h2>
                <p className="text-haven-navy/80 mb-4 leading-relaxed">
                  If you have questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-haven-teal/10 rounded-xl border border-haven-teal/20">
                  <p className="text-haven-navy/80 leading-relaxed">
                    <strong className="text-haven-navy">Email:</strong> havenchennai@gmail.com<br />
                    <strong className="text-haven-navy">Phone:</strong> +91 6380983578 | +91 9787943154<br />
                    <strong className="text-haven-navy">Address:</strong> Gsquare Omega, 4th Cross Street, Modern Layout Second Main Road, Padur, Tamil Nadu 603103, India
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  9. Changes to This Policy
                </h2>
                <p className="text-haven-navy/80 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                  Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
