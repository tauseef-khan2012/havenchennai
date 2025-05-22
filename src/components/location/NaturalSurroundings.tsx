
import React from 'react';
import { motion } from 'framer-motion';
import Badge from './Badge';
import { fadeInUp } from '@/data/attractionsData';

const NaturalSurroundings = () => {
  return (
    <section className="py-16 bg-haven-beige bg-opacity-20">
      <div className="container-custom">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="font-serif text-3xl font-bold mb-12 text-center"
        >
          Our Natural Surroundings
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h3 className="font-serif text-2xl font-semibold mb-4">Muttukadu Lake & Backwaters</h3>
            <p className="text-gray-700 mb-4">
              Haven sits adjacent to the picturesque Muttukadu Lake, offering breathtaking views from our decks and rooftop. The lake is connected by the Buckingham Canal and opens into the Bay of Bengal, creating a unique ecosystem of backwaters that support diverse wildlife.
            </p>
            <p className="text-gray-700">
              The tranquil waters are perfect for kayaking, birdwatching, or simply enjoying the sunset. Depending on the season, you might witness stunning views of the lake changing colors throughout the day.
            </p>
            
            <div className="mt-6 space-x-3">
              <Badge label="Kayaking" />
              <Badge label="Birdwatching" />
              <Badge label="Fishing" />
              <Badge label="Photography" />
            </div>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <img 
              src="/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png" 
              alt="View of Muttukadu Lake" 
              className="w-full h-[350px] object-cover"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="md:order-2"
          >
            <h3 className="font-serif text-2xl font-semibold mb-4">Rich Birdlife & Wildlife</h3>
            <p className="text-gray-700 mb-4">
              The area around Haven serves as a habitat for diverse birdlife, making it a paradise for birdwatchers and nature enthusiasts. During your stay, you might spot pelicans, flamingos, herons, egrets, kingfishers, and various exotic and migratory birds.
            </p>
            <p className="text-gray-700">
              The best times for birdwatching are early morning and late afternoon when the birds are most active. Our rooftop deck and ground floor deck provide excellent vantage points for observing these magnificent creatures in their natural habitat.
            </p>
            
            <div className="mt-6 space-x-3">
              <Badge label="Pelicans" />
              <Badge label="Flamingos" />
              <Badge label="Herons" />
              <Badge label="Kingfishers" />
            </div>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="rounded-lg overflow-hidden shadow-lg md:order-1"
          >
            <img 
              src="/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png" 
              alt="Sunset view from Haven's rooftop" 
              className="w-full h-[350px] object-cover"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </div>
        
        <VisitingSeasons />
      </div>
    </section>
  );
};

const VisitingSeasons = () => {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="mt-20 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6"
    >
      <h3 className="font-serif text-xl font-semibold mb-4 text-center">Best Times to Visit</h3>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="font-medium text-haven-green mb-2">Winter (Nov-Feb)</div>
          <div className="text-sm text-gray-600">
            <p>Pleasant temperatures</p>
            <p>Ideal for outdoor activities</p>
            <p>22°C - 30°C</p>
          </div>
        </div>
        <div className="text-center">
          <div className="font-medium text-haven-green mb-2">Summer (Mar-Jun)</div>
          <div className="text-sm text-gray-600">
            <p>Warm temperatures</p>
            <p>Great for lake activities</p>
            <p>30°C - 40°C</p>
          </div>
        </div>
        <div className="text-center">
          <div className="font-medium text-haven-green mb-2">Monsoon (Jul-Sep)</div>
          <div className="text-sm text-gray-600">
            <p>Occasional rainfall</p>
            <p>Lush green surroundings</p>
            <p>25°C - 35°C</p>
          </div>
        </div>
        <div className="text-center">
          <div className="font-medium text-haven-green mb-2">Post-Monsoon (Oct)</div>
          <div className="text-sm text-gray-600">
            <p>Fresh atmosphere</p>
            <p>Cooler evenings</p>
            <p>24°C - 32°C</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NaturalSurroundings;
