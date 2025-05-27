
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-haven-dark mb-8">
              Terms of Service
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-8">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700">
                  By accessing and using Haven's website and services, you accept and agree to be bound by the terms and 
                  provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  2. Booking and Reservations
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Confirmation</h3>
                    <p className="text-gray-700">
                      All bookings are subject to availability and confirmation. We reserve the right to refuse any booking 
                      at our discretion.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Full payment is required to confirm your booking</li>
                      <li>We accept major credit cards and digital payment methods</li>
                      <li>All prices are in Indian Rupees (INR) unless otherwise stated</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  3. Cancellation and Refund Policy
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Accommodation Cancellations</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Free cancellation up to 48 hours before check-in</li>
                      <li>Cancellations within 48 hours: 50% refund</li>
                      <li>No-shows: No refund</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Experience Cancellations</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Free cancellation up to 24 hours before the experience</li>
                      <li>Cancellations within 24 hours: No refund</li>
                      <li>Weather-related cancellations by Haven: Full refund or rescheduling</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  4. Guest Responsibilities
                </h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
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
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  5. Check-in and Check-out
                </h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Check-in: 3:00 PM onwards</li>
                  <li>Check-out: 11:00 AM</li>
                  <li>Early check-in or late check-out may be available upon request and additional charges</li>
                  <li>Valid government-issued photo ID required at check-in</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  6. Liability and Insurance
                </h2>
                <p className="text-gray-700 mb-4">
                  Haven is not liable for any loss, damage, or injury to persons or property during your stay or participation 
                  in experiences. Guests are responsible for their own belongings and safety.
                </p>
                <p className="text-gray-700">
                  We strongly recommend that guests obtain travel insurance to cover potential cancellations, medical emergencies, 
                  and personal belongings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  7. Force Majeure
                </h2>
                <p className="text-gray-700">
                  Haven shall not be liable for any failure to perform due to unforeseen circumstances or causes beyond our 
                  reasonable control, including natural disasters, government actions, or other force majeure events.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  8. Privacy and Data Protection
                </h2>
                <p className="text-gray-700">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our services, 
                  to understand our practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  9. Modifications to Terms
                </h2>
                <p className="text-gray-700">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting 
                  to our website. Continued use of our services constitutes acceptance of modified terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  10. Governing Law
                </h2>
                <p className="text-gray-700">
                  These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising 
                  under these terms shall be subject to the exclusive jurisdiction of the courts in Tamil Nadu, India.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-4">
                  11. Contact Information
                </h2>
                <p className="text-gray-700">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@haven-stays.com<br />
                    <strong>Phone:</strong> +91 98765 43210<br />
                    <strong>Address:</strong> Muttukadu Lake Area, ECR, Tamil Nadu, India
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfService;
