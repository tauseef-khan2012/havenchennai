
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would connect to Supabase to store the email
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
    
    setEmail('');
  };

  return (
    <div className="bg-haven-beige py-12">
      <div className="container-custom text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">Stay Updated</h2>
        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
          Subscribe to our newsletter for special offers, new experiences, and updates about Haven.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" className="btn-primary whitespace-nowrap">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSignup;
