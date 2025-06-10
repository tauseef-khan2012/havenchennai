
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/shared/PageHero';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageHero 
        title="Terms of Service"
        subtitle="Terms and conditions for using Haven's services"
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
                  1. Acceptance of Terms
                </h2>
                <p className="text-haven-navy/80 leading-relaxed">
                  By accessing and using Haven's website and services, you accept and agree to be bound by the terms and 
                  provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  2. Booking and Reservations
                </h2>
                <div className="space-y-6">
                  <div className="bg-haven-beige/50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-haven-navy mb-3">Booking Confirmation</h3>
                    <p className="text-haven-navy/80 leading-relaxed">
                      All bookings are subject to availability and confirmation. We reserve the right to refuse any booking 
                      at our discretion.
                    </p>
                  </div>
                  <div className="bg-haven-beige/50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-haven-navy mb-3">Payment</h3>
                    <ul className="list-disc pl-6 text-haven-navy/80 space-y-2">
                      <li>Full payment is required to confirm your booking</li>
                      <li>We accept major credit cards and digital payment methods</li>
                      <li>All prices are in Indian Rupees (INR) unless otherwise stated</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  3. Cancellation and Refund Policy
                </h2>
                <div className="space-y-6">
                  <div className="bg-haven-teal/10 p-6 rounded-xl border border-haven-teal/20">
                    <h3 className="text-xl font-semibold text-haven-navy mb-3">Accommodation Cancellations</h3>
                    <ul className="list-disc pl-6 text-haven-navy/80 space-y-2">
                      <li>Free cancellation up to 48 hours before check-in</li>
                      <li>Cancellations within 48 hours: 50% refund</li>
                      <li>No-shows: No refund</li>
                    </ul>
                  </div>
                  <div className="bg-haven-yellow/10 p-6 rounded-xl border border-haven-yellow/30">
                    <h3 className="text-xl font-semibold text-haven-navy mb-3">Experience Cancellations</h3>
                    <ul className="list-disc pl-6 text-haven-navy/80 space-y-2">
                      <li>Free cancellation up to 24 hours before the experience</li>
                      <li>Cancellations within 24 hours: No refund</li>
                      <li>Weather-related cancellations by Haven: Full refund or rescheduling</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  4. Guest Responsibilities
                </h2>
                <ul className="list-disc pl-6 text-haven-navy/80 space-y-3">
                  <li>Respect the property and follow house rules</li>
                  <li>Be considerate of other guests and neighbors</li>
                  <li>Report any damages or issues immediately</li>
                  <li>Comply with local laws and regulations</li>
                  <li>Maximum occupancy limits must be observed</li>
                  <li>No smoking inside the property</li>
                  <li>Pets are not allowed unless specifically arranged</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  5. Check-in and Check-out
                </h2>
                <div className="bg-haven-beige/50 p-6 rounded-xl">
                  <ul className="list-disc pl-6 text-haven-navy/80 space-y-3">
                    <li>Check-in: 3:00 PM onwards</li>
                    <li>Check-out: 11:00 AM</li>
                    <li>Early check-in or late check-out may be available upon request and additional charges</li>
                    <li>Valid government-issued photo ID required at check-in</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  6. Liability and Insurance
                </h2>
                <p className="text-haven-navy/80 mb-4 leading-relaxed">
                  Haven is not liable for any loss, damage, or injury to persons or property during your stay or participation 
                  in experiences. Guests are responsible for their own belongings and safety.
                </p>
                <p className="text-haven-navy/80 leading-relaxed">
                  We strongly recommend that guests obtain travel insurance to cover potential cancellations, medical emergencies, 
                  and personal belongings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  7. Force Majeure
                </h2>
                <p className="text-haven-navy/80 leading-relaxed">
                  Haven shall not be liable for any failure to perform due to unforeseen circumstances or causes beyond our 
                  reasonable control, including natural disasters, government actions, or other force majeure events.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  8. Privacy and Data Protection
                </h2>
                <p className="text-haven-navy/80 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our services, 
                  to understand our practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  9. Modifications to Terms
                </h2>
                <p className="text-haven-navy/80 leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting 
                  to our website. Continued use of our services constitutes acceptance of modified terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  10. Governing Law
                </h2>
                <p className="text-haven-navy/80 leading-relaxed">
                  These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising 
                  under these terms shall be subject to the exclusive jurisdiction of the courts in Tamil Nadu, India.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-haven-navy mb-6">
                  11. Contact Information
                </h2>
                <p className="text-haven-navy/80 mb-4 leading-relaxed">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-haven-teal/10 rounded-xl border border-haven-teal/20">
                  <p className="text-haven-navy/80 leading-relaxed">
                    <strong className="text-haven-navy">Email:</strong> havenchennai@gmail.com<br />
                    <strong className="text-haven-navy">Phone:</strong> +91 6380983578 | +91 9787943154<br />
                    <strong className="text-haven-navy">Address:</strong> Gsquare Omega, 4th Cross Street, Modern Layout Second Main Road, Padur, Tamil Nadu 603103, India
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
