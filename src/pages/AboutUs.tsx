
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AboutUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const inquiryData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone_number: formData.get('phone') as string,
      inquiry_type: formData.get('inquiry_type') as string,
      message: formData.get('message') as string,
    };

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([inquiryData]);

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-black overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
              filter: 'brightness(0.6)'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="relative h-full container-custom flex flex-col justify-center">
            <div className="max-w-2xl animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Haven</h1>
              <p className="text-xl text-white">Discover our story and values that guide our lakeside retreat experience.</p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold mb-6">The Haven Journey</h2>
                <p className="text-gray-700 mb-4">
                  Haven was born from a shared passion for nature and a vision to create a new kind of hospitality experience. Our founders, avid outdoor enthusiasts and design lovers, discovered this pristine piece of land and immediately recognized its potential.
                </p>
                <p className="text-gray-700 mb-4">
                  The idea was simple yet revolutionary: transform shipping containers into luxurious, eco-friendly accommodations that would allow guests to immerse themselves in nature without sacrificing comfort.
                </p>
                <p className="text-gray-700">
                  After months of careful design and sustainable construction, Haven welcomed its first guests in 2022. Since then, we've been dedicated to creating unforgettable experiences that reconnect people with nature, support local communities, and promote environmental stewardship.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Founders of Haven" 
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 bg-haven-beige bg-opacity-20">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-haven-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Stillness</h3>
                <p className="text-gray-600">
                  We believe in the power of quiet moments.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-haven-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Connection</h3>
                <p className="text-gray-600">
                  Fostering deeper bonds with self, others, and the environment.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-haven-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Mindful Design</h3>
                <p className="text-gray-600">
                  Every element has a purpose; minimalism meets comfort.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-haven-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Sustainability</h3>
                <p className="text-gray-600">
                  A deep respect for the planet, woven into our operations.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md lg:col-start-2">
                <div className="text-haven-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Authenticity</h3>
                <p className="text-gray-600">
                  Real experiences, real stories, real impact.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Meet the Team */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Emma Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-1">Emma Johnson</h3>
                <p className="text-haven-green mb-3">Founder & Experience Director</p>
                <p className="text-gray-600 px-4">With a background in outdoor education and sustainable tourism, Emma designs our unique nature experiences.</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="David Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-1">David Chen</h3>
                <p className="text-haven-green mb-3">Co-Founder & Design Lead</p>
                <p className="text-gray-600 px-4">An architect specializing in sustainable design, David transformed shipping containers into our beautiful accommodations.</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Maya Rodriguez" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-1">Maya Rodriguez</h3>
                <p className="text-haven-green mb-3">Hospitality Manager</p>
                <p className="text-gray-600 px-4">With years of experience in luxury hospitality, Maya ensures every guest receives exceptional service during their stay.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-haven-beige bg-opacity-20">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Get in Touch</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-haven-green bg-opacity-10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-haven-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Email Us</h4>
                      <p className="text-gray-600">hello@havenchennai.com</p>
                      <p className="text-gray-600">bookings@havenchennai.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-haven-green bg-opacity-10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-haven-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Call Us</h4>
                      <p className="text-gray-600">+91 98765 43210</p>
                      <p className="text-gray-600">+91 87654 32109</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-haven-green bg-opacity-10 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-haven-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Office Hours</h4>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="w-full"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry_type" className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Type *
                      </label>
                      <Select name="inquiry_type" required>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Booking Inquiry</SelectItem>
                          <SelectItem value="general">General Information</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="media">Media Inquiry</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full"
                      placeholder="Tell us about your inquiry or how we can help you..."
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-haven-green hover:bg-haven-green/90 text-white font-semibold py-3"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-haven-green text-white">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Ready to Experience Haven?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Book your stay and discover why our guests keep coming back to this magical lakeside retreat.
            </p>
            <Link to="/stay">
              <Button variant="secondary" size="lg">Book Your Stay</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;
