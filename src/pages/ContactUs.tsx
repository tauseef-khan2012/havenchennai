
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().optional(),
  inquiry_type: z.string().min(1, 'Please select an inquiry type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          name: data.name,
          email: data.email,
          phone_number: data.phone_number || null,
          inquiry_type: data.inquiry_type,
          message: data.message,
          status: 'Open'
        }]);

      if (error) throw error;

      setSubmitSuccess(true);
      reset();
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-custom py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-haven-dark mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about your stay or our experiences? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-haven-dark mb-6">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-haven-teal mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <a href="mailto:hello@haven-stays.com" className="text-haven-teal hover:underline">
                        hello@haven-stays.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-haven-teal mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <a href="tel:+91-9876543210" className="text-haven-teal hover:underline">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-haven-teal mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">
                        Muttukadu Lake Area<br />
                        East Coast Road (ECR)<br />
                        Tamil Nadu, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div>
                <h3 className="text-xl font-serif font-bold text-haven-dark mb-4">
                  Find Us
                </h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-600">Interactive Map Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-serif font-bold text-haven-dark mb-6">
                Send us a Message
              </h2>

              {submitSuccess && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    Thank you for your message! We'll get back to you within 24 hours.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="mt-1"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="mt-1"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    {...register('phone_number')}
                    className="mt-1"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <Label htmlFor="inquiry_type">Inquiry Type *</Label>
                  <select
                    id="inquiry_type"
                    {...register('inquiry_type')}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-haven-teal focus:ring-2 focus:ring-haven-teal focus:ring-opacity-20"
                  >
                    <option value="">Select inquiry type</option>
                    <option value="Booking">Booking Inquiry</option>
                    <option value="Experiences">Experience Information</option>
                    <option value="Packages">Package Information</option>
                    <option value="General">General Question</option>
                    <option value="Support">Support</option>
                  </select>
                  {errors.inquiry_type && (
                    <p className="text-sm text-red-600 mt-1">{errors.inquiry_type.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    {...register('message')}
                    className="mt-1"
                    rows={5}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-haven-teal hover:bg-haven-teal/90"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactUs;
