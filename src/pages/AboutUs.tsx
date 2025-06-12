
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/shared/PageHero';
import { Heart, Leaf, Users, Mail, Phone, MapPin } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageHero 
        title="About Haven"
        subtitle="Sustainable Container Home Experience by Muttukadu Lake"
        backgroundImage="/lovable-uploads/0bf49c3a-e3e0-4828-badd-a492dc4dd957.png"
      />
      
      <main className="flex-1">
        {/* Vision Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
                <span className="font-handwritten text-2xl text-haven-yellow">Our Purpose</span>
                <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
              </div>
              <h2 className="text-4xl font-serif font-bold mb-6 text-gray-900">Our Vision</h2>
              <div className="w-24 h-1 bg-haven-teal mx-auto mb-8"></div>
            </div>
            
            <div className="bg-white rounded-2xl p-10 shadow-lg">
              <p className="text-xl text-gray-700 leading-relaxed mb-8 text-center">
                Haven is the first chapter in a larger story of creating conscious hospitality experiences across unique locations. 
                We envision a network of thoughtfully designed spaces that demonstrate how travel can be both transformative and responsible.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 text-center">
                <div className="p-6 bg-haven-teal/5 rounded-xl">
                  <h4 className="font-serif text-xl font-bold mb-3 text-gray-900">Expanding Mindfully</h4>
                  <p className="text-gray-600">
                    Each new location will honor local ecosystems and communities, creating employment and showcasing regional sustainability practices.
                  </p>
                </div>
                
                <div className="p-6 bg-haven-teal/5 rounded-xl">
                  <h4 className="font-serif text-xl font-bold mb-3 text-gray-900">Inspiring Change</h4>
                  <p className="text-gray-600">
                    We aim to inspire guests to integrate sustainable practices into their daily lives, creating ripple effects far beyond their stay.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600 leading-relaxed">
                  As we grow, our commitment remains unwavering: to provide authentic experiences that restore both people and planet, 
                  proving that conscious choices create the most meaningful journeys.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold mb-6 text-gray-900">What We Stand For</h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Every element of Haven reflects our commitment to sustainable living, authentic experiences, 
                and the belief that the best moments happen when we slow down and connect.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="bg-haven-teal/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-haven-teal/20 transition-colors duration-300">
                  <Leaf className="h-10 w-10 text-haven-teal" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Sustainable Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  We prove that eco-conscious choices don't mean compromising comfort. Our repurposed shipping containers 
                  showcase how sustainable architecture can be both beautiful and functional, inspiring guests to reimagine 
                  their own relationship with the environment.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="bg-haven-teal/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-haven-teal/20 transition-colors duration-300">
                  <Heart className="h-10 w-10 text-haven-teal" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Authentic Connection</h3>
                <p className="text-gray-600 leading-relaxed">
                  In our hyper-connected world, we create spaces for genuine disconnection and reflection. 
                  Whether it's watching sunrise from our rooftop deck or sharing stories around evening tea, 
                  Haven fosters moments that matter.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="bg-haven-teal/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-haven-teal/20 transition-colors duration-300">
                  <Users className="h-10 w-10 text-haven-teal" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Mindful Hospitality</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every detail is intentionally curated—from locally sourced amenities to our carefully selected book collection. 
                  We believe that thoughtful touches create transformative experiences that guests carry with them long after they leave.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-6 text-gray-900">Get in Touch</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Ready to plan your mindful escape? We're here to help you create the perfect retreat experience.
              </p>
            </div>
            
            <div className="bg-haven-teal/5 rounded-2xl p-8 shadow-lg border border-haven-teal/10" itemScope itemType="https://schema.org/Organization">
              <meta itemProp="name" content="Haven Chennai" />
              <meta itemProp="description" content="Sustainable Container Home Experience by Muttukadu Lake" />
              
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-4" itemProp="email">
                  <div className="w-16 h-16 bg-haven-teal/10 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-haven-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold mb-2 text-gray-900">Email</h3>
                    <a 
                      href="mailto:havenchennai@gmail.com" 
                      className="text-haven-teal hover:text-haven-teal/80 transition-colors font-medium"
                      itemProp="email"
                    >
                      havenchennai@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="space-y-4" itemProp="telephone">
                  <div className="w-16 h-16 bg-haven-teal/10 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="h-8 w-8 text-haven-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold mb-2 text-gray-900">Phone</h3>
                    <div className="space-y-1">
                      <div>
                        <a 
                          href="tel:+916380983578" 
                          className="text-haven-teal hover:text-haven-teal/80 transition-colors font-medium block"
                          itemProp="telephone"
                        >
                          +91 6380983578
                        </a>
                      </div>
                      <div>
                        <a 
                          href="tel:+919787943154" 
                          className="text-haven-teal hover:text-haven-teal/80 transition-colors font-medium block"
                          itemProp="telephone"
                        >
                          +91 9787943154
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <div className="w-16 h-16 bg-haven-teal/10 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="h-8 w-8 text-haven-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold mb-2 text-gray-900">Address</h3>
                    <address className="text-gray-700 not-italic leading-relaxed">
                      <span itemProp="streetAddress">Gsquare Omega, 4th Cross Street,<br />Modern Layout Second Main Road</span><br />
                      <span itemProp="addressLocality">Padur</span>, <span itemProp="addressRegion">Tamil Nadu</span> <span itemProp="postalCode">603103</span><br />
                      <span itemProp="addressCountry">India</span>
                    </address>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-haven-teal/10 text-center">
                <p className="text-gray-600">
                  We typically respond to inquiries within 24 hours. For immediate assistance, 
                  please call us directly during business hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
