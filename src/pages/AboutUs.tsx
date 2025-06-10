
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
      <main className="relative">
        {/* Enhanced Hero Section with Nature-Inspired Design */}
        <section className="relative h-[70vh] bg-nature-gradient overflow-hidden">
          <div className="absolute inset-0 bg-water-ripple"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
              filter: 'brightness(0.6)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-haven-green/60 via-haven-teal/40 to-haven-blue/60" />
          
          {/* Floating decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-organic bg-white/10 animate-float-gentle"></div>
          <div className="absolute top-40 right-20 w-16 h-16 rounded-organic-2 bg-haven-sunset/20 animate-float-gentle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-12 h-12 rounded-organic-3 bg-haven-moss/30 animate-float-gentle" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative h-full container-custom flex flex-col justify-center">
            <div className="max-w-3xl glass-panel rounded-3xl p-8 md:p-12 animate-fade-up">
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-haven-dark mb-6">
                About <span className="text-haven-teal">Haven</span>
              </h1>
              <p className="text-xl text-haven-dark/80 font-medium">
                Discover our story rooted in <span className="font-handwritten text-2xl text-haven-green">simplicity</span>, 
                <span className="font-handwritten text-2xl text-haven-teal"> connection</span>, and 
                <span className="font-handwritten text-2xl text-haven-sunset"> nature immersion</span>.
              </p>
            </div>
          </div>
        </section>
        
        {/* Enhanced Our Story Section */}
        <section className="py-20 bg-gradient-to-br from-haven-beige via-white to-haven-beige-warm relative overflow-hidden">
          <div className="absolute inset-0 leaf-pattern opacity-30"></div>
          <div className="container-custom relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-12 h-1 bg-nature-gradient rounded-full"></div>
                  <span className="font-handwritten text-2xl text-haven-green">Our Journey</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-haven-dark mb-8">
                  The Haven <span className="text-haven-teal">Story</span>
                </h2>
                
                <div className="space-y-6 text-lg text-haven-dark/80">
                  <p className="leading-relaxed">
                    Haven was born from a shared passion for nature and a vision to create a new kind of hospitality experience. Our founders, avid outdoor enthusiasts and design lovers, discovered this pristine piece of land and immediately recognized its potential.
                  </p>
                  <div className="glass-panel rounded-2xl p-6 border-l-4 border-haven-teal">
                    <p className="italic leading-relaxed">
                      "The idea was simple yet revolutionary: transform shipping containers into luxurious, eco-friendly accommodations that would allow guests to immerse themselves in nature without sacrificing comfort."
                    </p>
                  </div>
                  <p className="leading-relaxed">
                    After months of careful design and sustainable construction, Haven welcomed its first guests in 2022. Since then, we've been dedicated to creating unforgettable experiences that reconnect people with nature, support local communities, and promote environmental stewardship.
                  </p>
                </div>
              </div>
              
              <div className="animate-fade-in-delay">
                <div className="relative group">
                  <div className="absolute inset-0 bg-nature-gradient rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                  <div className="relative rounded-3xl overflow-hidden shadow-organic-hover">
                    <img 
                      src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                      alt="Founders of Haven in natural setting" 
                      className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Enhanced Our Values Section */}
        <section className="py-20 bg-gradient-to-br from-haven-blue-light/10 via-haven-beige-cool/50 to-haven-moss/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-organic-texture"></div>
          <div className="container-custom relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-1 bg-lake-gradient rounded-full"></div>
                <span className="font-handwritten text-2xl text-haven-teal">What We Believe</span>
                <div className="w-12 h-1 bg-lake-gradient rounded-full"></div>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-haven-dark mb-6">
                Our <span className="text-haven-green">Values</span>
              </h2>
              <p className="text-xl text-haven-dark/70 max-w-3xl mx-auto">
                These principles guide every decision we make and every experience we create
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🧘",
                  title: "Stillness",
                  description: "We believe in the power of quiet moments and mindful presence.",
                  color: "haven-green"
                },
                {
                  icon: "🤝",
                  title: "Connection",
                  description: "Fostering deeper bonds with self, others, and the environment.",
                  color: "haven-teal"
                },
                {
                  icon: "🎨",
                  title: "Mindful Design",
                  description: "Every element has a purpose; minimalism meets comfort.",
                  color: "haven-blue"
                },
                {
                  icon: "🌱",
                  title: "Sustainability",
                  description: "A deep respect for the planet, woven into our operations.",
                  color: "haven-moss"
                },
                {
                  icon: "💫",
                  title: "Authenticity",
                  description: "Real experiences, real stories, real impact.",
                  color: "haven-sunset"
                }
              ].map((value, index) => (
                <div 
                  key={index} 
                  className="group glass-panel rounded-3xl p-8 hover-lift transition-all duration-500 animate-fade-in-delay"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-6 animate-breathe group-hover:animate-organic-pulse">
                      {value.icon}
                    </div>
                    <h3 className="font-serif text-2xl font-semibold mb-4 text-haven-dark">
                      {value.title}
                    </h3>
                    <p className="text-haven-dark/70 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${value.color} to-${value.color}-light rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Contact Section */}
        <section className="py-20 bg-gradient-to-br from-haven-green/5 via-haven-beige to-haven-teal/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-water-ripple opacity-30"></div>
          <div className="container-custom relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-1 bg-sunset-gradient rounded-full"></div>
                <span className="font-handwritten text-2xl text-haven-green">Let's Connect</span>
                <div className="w-12 h-1 bg-sunset-gradient rounded-full"></div>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-haven-dark mb-6">
                Get in <span className="text-haven-teal">Touch</span>
              </h2>
              <p className="text-xl text-haven-dark/70 max-w-2xl mx-auto">
                Ready to begin your journey? We'd love to hear from you.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Information */}
              <div className="animate-fade-in">
                <div className="glass-panel rounded-3xl p-8 md:p-10">
                  <h3 className="font-serif text-3xl font-semibold mb-8 text-haven-dark">Contact Information</h3>
                  
                  <div className="space-y-8">
                    {[
                      {
                        icon: <Mail className="h-6 w-6" />,
                        title: "Email Us",
                        details: ["hello@havenchennai.com", "bookings@havenchennai.com"],
                        color: "haven-teal"
                      },
                      {
                        icon: <Phone className="h-6 w-6" />,
                        title: "Call Us",
                        details: ["+91 98765 43210", "+91 87654 32109"],
                        color: "haven-green"
                      },
                      {
                        icon: <Clock className="h-6 w-6" />,
                        title: "Office Hours",
                        details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday - Sunday: 10:00 AM - 4:00 PM"],
                        color: "haven-blue"
                      }
                    ].map((contact, index) => (
                      <div key={index} className="flex items-start gap-6 group">
                        <div className={`bg-${contact.color}/10 p-4 rounded-2xl group-hover:bg-${contact.color}/20 transition-colors duration-300`}>
                          <div className={`text-${contact.color}`}>
                            {contact.icon}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-xl mb-2 text-haven-dark">{contact.title}</h4>
                          {contact.details.map((detail, idx) => (
                            <p key={idx} className="text-haven-dark/70 mb-1">{detail}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Enhanced Contact Form */}
              <div className="animate-fade-in-delay">
                <div className="glass-panel rounded-3xl p-8 md:p-10">
                  <h3 className="font-serif text-3xl font-semibold mb-8 text-haven-dark">Send us a Message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-haven-dark mb-3">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="w-full rounded-2xl border-haven-beige focus:border-haven-teal focus:ring-haven-teal/20 transition-all duration-300"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-haven-dark mb-3">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="w-full rounded-2xl border-haven-beige focus:border-haven-teal focus:ring-haven-teal/20 transition-all duration-300"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-haven-dark mb-3">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          className="w-full rounded-2xl border-haven-beige focus:border-haven-teal focus:ring-haven-teal/20 transition-all duration-300"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label htmlFor="inquiry_type" className="block text-sm font-semibold text-haven-dark mb-3">
                          Inquiry Type *
                        </label>
                        <Select name="inquiry_type" required>
                          <SelectTrigger className="w-full rounded-2xl border-haven-beige focus:border-haven-teal focus:ring-haven-teal/20">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl">
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
                      <label htmlFor="message" className="block text-sm font-semibold text-haven-dark mb-3">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        className="w-full rounded-2xl border-haven-beige focus:border-haven-teal focus:ring-haven-teal/20 transition-all duration-300 resize-none"
                        placeholder="Tell us about your inquiry or how we can help you..."
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-nature-gradient hover:shadow-organic-hover text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ripple-effect"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="w-5 h-5 mr-3" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Enhanced Call to Action */}
        <section className="py-20 bg-nature-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-water-ripple"></div>
          <div className="absolute top-10 right-10 w-32 h-32 rounded-organic bg-white/10 animate-float-gentle"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 rounded-organic-2 bg-haven-sunset/20 animate-float-gentle" style={{ animationDelay: '1.5s' }}></div>
          
          <div className="container-custom text-center relative z-10">
            <div className="max-w-4xl mx-auto glass-panel-dark rounded-3xl p-12 md:p-16 animate-fade-up">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Experience <span className="text-haven-sunset">Haven</span>?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Book your sustainable lakeside escape and discover why our guests keep coming back to this magical retreat where <span className="font-handwritten text-2xl text-haven-beige">simplicity meets luxury</span>.
              </p>
              <Link to="/stay">
                <Button 
                  size="lg" 
                  className="bg-white text-haven-dark hover:bg-haven-beige font-semibold px-12 py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-organic-hover ripple-effect"
                >
                  Book Your Stay
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;
