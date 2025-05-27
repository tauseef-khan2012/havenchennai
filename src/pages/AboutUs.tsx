
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Phone, Mail, Clock, Send } from 'lucide-react';
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
              <p className="text-xl text-white">Discover our story, values, and the perfect lakeside location where nature meets luxury.</p>
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

        {/* Location Section */}
        <section className="py-16 bg-haven-beige bg-opacity-20">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Our Perfect Location</h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="font-serif text-2xl font-semibold mb-4">Finding Haven</h3>
                <p className="text-gray-700 mb-4">
                  Haven is strategically located adjacent to the beautiful Muttukadu Lake, offering stunning views of the Muttukadu Bridge and nearby boathouse. Our unique container retreat provides the perfect balance of seclusion and accessibility.
                </p>
                
                <div className="space-y-6 mt-8">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-haven-green bg-opacity-10 rounded-full flex items-center justify-center">
                      <MapPin className="text-haven-green flex-shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-gray-600">Haven Container Retreat, Muttukadu Lake Road, ECR, Chennai, Tamil Nadu, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-haven-green bg-opacity-10 rounded-full flex items-center justify-center">
                      <Navigation className="text-haven-green flex-shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Getting Here</h4>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">From Chennai city center</span>
                          <span className="bg-haven-beige bg-opacity-30 px-3 py-1 rounded-full text-sm">40 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">From Chennai International Airport</span>
                          <span className="bg-haven-beige bg-opacity-30 px-3 py-1 rounded-full text-sm">35 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">From Mahabalipuram</span>
                          <span className="bg-haven-beige bg-opacity-30 px-3 py-1 rounded-full text-sm">15 min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-[450px] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7764.696126654798!2d80.24515492272668!3d12.815201699999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52598a9d672347%3A0xf97ab4362c317298!2sMuttukadu%20Boat%20House!5e0!3m2!1sen!2sus!4v1716565790945!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Natural Surroundings */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="font-serif text-2xl font-semibold mb-4">Muttukadu Lake & Backwaters</h3>
                <p className="text-gray-700 mb-4">
                  Haven sits adjacent to the picturesque Muttukadu Lake, offering breathtaking views from our decks and rooftop. The lake is connected by the Buckingham Canal and opens into the Bay of Bengal, creating a unique ecosystem of backwaters that support diverse wildlife.
                </p>
                <p className="text-gray-700">
                  The tranquil waters are perfect for kayaking, birdwatching, or simply enjoying the sunset. Depending on the season, you might witness stunning views of the lake changing colors throughout the day.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png" 
                  alt="View of Muttukadu Lake from Haven's rooftop" 
                  className="w-full h-[350px] object-cover"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <div className="md:order-2">
                <h3 className="font-serif text-2xl font-semibold mb-4">Rich Birdlife & Wildlife</h3>
                <p className="text-gray-700 mb-4">
                  The area around Haven serves as a habitat for diverse birdlife, making it a paradise for birdwatchers and nature enthusiasts. During your stay, you might spot pelicans, flamingos, herons, egrets, kingfishers, and various exotic and migratory birds.
                </p>
                <p className="text-gray-700">
                  The best times for birdwatching are early morning and late afternoon when the birds are most active. Our rooftop deck and ground floor deck provide excellent vantage points for observing these magnificent creatures in their natural habitat.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg md:order-1">
                <img 
                  src="/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png" 
                  alt="Sunset view from Haven's rooftop" 
                  className="w-full h-[350px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-haven-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Environmental Stewardship</h3>
                <p className="text-gray-600">
                  We're committed to minimizing our environmental footprint, using renewable energy, implementing water conservation measures, and supporting local reforestation efforts.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-haven-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Community Connection</h3>
                <p className="text-gray-600">
                  We collaborate with local experts, source ingredients from nearby farms, and contribute to community initiatives that preserve the cultural heritage of our region.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-haven-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Authentic Experiences</h3>
                <p className="text-gray-600">
                  We believe in the power of genuine connections with nature and local culture, creating experiences that inspire, educate, and refresh our guests.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Meet the Team */}
        <section className="py-16 bg-haven-beige bg-opacity-20">
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
        <section className="py-16">
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
                      <MapPin className="h-6 w-6 text-haven-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Visit Us</h4>
                      <p className="text-gray-600">Haven Container Retreat</p>
                      <p className="text-gray-600">Muttukadu Lake Road, ECR</p>
                      <p className="text-gray-600">Chennai, Tamil Nadu 603112</p>
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
