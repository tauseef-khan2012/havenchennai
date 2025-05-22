
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/data/attractionsData';

const MapSection = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="font-serif text-3xl font-bold mb-6">Finding Haven</h2>
            <p className="text-gray-700 mb-4">
              Haven is strategically located adjacent to the beautiful Muttukadu Lake, offering stunning views of the Muttukadu Bridge and nearby boathouse. Our unique container retreat provides the perfect balance of seclusion and accessibility.
            </p>
            
            <div className="space-y-6 mt-8">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-haven-green bg-opacity-10 rounded-full flex items-center justify-center">
                  <MapPin className="text-haven-green flex-shrink-0" />
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">Haven Container Retreat, Muttukadu Lake Road, ECR, Chennai, Tamil Nadu, India</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-haven-green bg-opacity-10 rounded-full flex items-center justify-center">
                  <Navigation className="text-haven-green flex-shrink-0" />
                </div>
                <div>
                  <h3 className="font-semibold">Getting Here</h3>
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
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="h-[450px] bg-gray-200 rounded-lg overflow-hidden shadow-lg"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7764.696126654798!2d80.24515492272668!3d12.815201699999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52598a9d672347%3A0xf97ab4362c317298!2sMuttukadu%20Boat%20House!5e0!3m2!1sen!2sus!4v1716565790945!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
