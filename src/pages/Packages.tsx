
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const packagesData = [
  {
    id: 'weekend-escape',
    title: 'Weekend Escape',
    description: 'Perfect for a quick getaway to recharge and reconnect with nature.',
    includes: [
      '2 nights in our container home',
      'Welcome basket with local treats',
      'Guided forest meditation session',
      'Daily breakfast delivered to your door'
    ],
    price: 599,
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'adventure-week',
    title: 'Adventure Week',
    description: 'Immerse yourself in a full week of outdoor activities and relaxation.',
    includes: [
      '5 nights in our container home',
      'Choice of 3 outdoor experiences',
      'Welcome bottle of local wine',
      'Farm-to-table dinner prepared by our chef',
      'Exclusive use of our mountain bikes'
    ],
    price: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'romantic-retreat',
    title: 'Romantic Retreat',
    description: 'Celebrate your special relationship with this curated romantic experience.',
    includes: [
      '3 nights in our container home',
      'Champagne and chocolate-covered strawberries on arrival',
      'Private stargazing experience with wine and cheese',
      'Couples massage in the privacy of your accommodation',
      'Sunrise breakfast picnic'
    ],
    price: 899,
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  }
];

const Packages = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would connect to Supabase to store the inquiry
    toast({
      title: "Success!",
      description: "Your inquiry has been submitted. We'll contact you shortly to discuss your custom package.",
    });
    
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setSelectedPackage('');
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
              backgroundImage: 'url(https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
              filter: 'brightness(0.6)'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="relative h-full container-custom flex flex-col justify-center">
            <div className="max-w-2xl animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Tailored Packages</h1>
              <p className="text-xl text-white">Explore our curated packages or let us create a custom experience just for you.</p>
            </div>
          </div>
        </section>
        
        {/* Featured Packages */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Our Popular Packages</h2>
            
            <div className="space-y-12">
              {packagesData.map((pkg, index) => (
                <div 
                  key={pkg.id}
                  className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="rounded-lg overflow-hidden shadow-md">
                      <img 
                        src={pkg.imageUrl} 
                        alt={pkg.title} 
                        className="w-full h-[400px] object-cover"
                      />
                    </div>
                  </div>
                  <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <h3 className="font-serif text-2xl font-bold mb-3">{pkg.title}</h3>
                    <p className="text-gray-700 mb-4">{pkg.description}</p>
                    
                    <h4 className="font-medium mb-2">Package Includes:</h4>
                    <ul className="space-y-2 mb-6">
                      {pkg.includes.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-bold">Starting at ${pkg.price}</span>
                      <span className="text-sm text-gray-600">Per package</span>
                    </div>
                    
                    <Button 
                      className="btn-primary"
                      onClick={() => {
                        setSelectedPackage(pkg.title);
                        setMessage(`I'm interested in the ${pkg.title} package. Please provide more information.`);
                        
                        // Scroll to inquiry form
                        document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Inquire Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Custom Packages */}
        <section className="py-12 bg-haven-beige bg-opacity-30">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold mb-4">Create Your Custom Package</h2>
                <p className="text-gray-700 mb-4">
                  Looking for something unique? We specialize in creating tailored experiences that match your interests, 
                  preferences, and special occasions.
                </p>
                <p className="text-gray-700 mb-6">
                  Whether you're planning a family reunion, a corporate retreat, or a special celebration, 
                  our team will work with you to design the perfect Haven experience.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 text-haven-green">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold mb-1">Completely Personalized</h3>
                      <p className="text-gray-600">Every element of your package can be customized to suit your preferences.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 text-haven-green">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold mb-1">Perfect for Groups</h3>
                      <p className="text-gray-600">We can coordinate accommodations for larger groups across multiple stay options.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 text-haven-green">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold mb-1">Special Occasions</h3>
                      <p className="text-gray-600">Celebrate birthdays, anniversaries, and other milestones with special touches.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Custom experiences" 
                  className="rounded-lg shadow-md w-full h-[450px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Inquiry Form */}
        <section id="inquiry-form" className="py-16">
          <div className="container-custom max-w-3xl">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Inquire About a Package</h2>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="name" className="block mb-2">Name *</Label>
                  <Input 
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block mb-2">Email *</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="block mb-2">Phone</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="package" className="block mb-2">Interested In</Label>
                  <select 
                    id="package"
                    value={selectedPackage}
                    onChange={(e) => {
                      setSelectedPackage(e.target.value);
                      if (e.target.value) {
                        setMessage(`I'm interested in the ${e.target.value} package. Please provide more information.`);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a package (optional)</option>
                    {packagesData.map(pkg => (
                      <option key={pkg.id} value={pkg.title}>{pkg.title}</option>
                    ))}
                    <option value="Custom Package">Custom Package</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="message" className="block mb-2">Your Message *</Label>
                <Textarea 
                  id="message"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you're looking for in your package. Include details like preferred dates, number of guests, special occasions, or specific experiences you're interested in."
                  required
                />
              </div>
              
              <Button type="submit" className="w-full btn-primary">
                Submit Inquiry
              </Button>
              
              <p className="text-sm text-gray-600 text-center mt-4">
                We'll respond to your inquiry within 24 hours to start planning your perfect Haven experience.
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Packages;
