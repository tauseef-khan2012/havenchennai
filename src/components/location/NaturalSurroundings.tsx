
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { fadeInUp } from '@/data/attractionsData';

const NaturalSurroundings = () => {
  return (
    <section className="py-16 bg-navy-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
      <div className="absolute inset-0 leaf-pattern opacity-10"></div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
            <span className="font-handwritten text-2xl text-haven-yellow">Natural Paradise</span>
            <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-haven-beige mb-6">
            Muttukadu Lake
            <span className="block text-haven-yellow">Wildlife Sanctuary</span>
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="glass-panel-navy rounded-3xl p-8"
          >
            <Badge className="mb-4 bg-haven-yellow/20 text-haven-yellow border-haven-yellow/30">
              Lakeside Location
            </Badge>
            <h3 className="font-serif text-2xl font-semibold mb-4 text-haven-beige">Muttukadu Lake & Backwaters</h3>
            <p className="text-haven-beige/80 mb-4 leading-relaxed">
              Haven sits beside the picturesque Muttukadu Lake, connected by the Buckingham Canal to the Bay of Bengal. 
              This unique ecosystem supports diverse wildlife and offers breathtaking views from our multi-level decks.
            </p>
            <p className="text-haven-beige/80 leading-relaxed">
              Perfect for kayaking, birdwatching, and sunset photography. Experience the lake's changing colors throughout the day.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-haven-navy-light text-haven-beige">Kayaking</Badge>
              <Badge variant="secondary" className="bg-haven-navy-light text-haven-beige">Birdwatching</Badge>
              <Badge variant="secondary" className="bg-haven-navy-light text-haven-beige">Photography</Badge>
            </div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="rounded-3xl overflow-hidden shadow-navy hover-lift transition-all duration-500"
          >
            <img 
              src="/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png" 
              alt="Muttukadu Lake view from Haven Chennai container home" 
              className="w-full h-[350px] object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="rounded-3xl overflow-hidden shadow-navy hover-lift transition-all duration-500 md:order-1"
          >
            <img 
              src="/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png" 
              alt="Birdlife and sunset views from Haven rooftop deck" 
              className="w-full h-[350px] object-cover"
              loading="lazy"
            />
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="glass-panel-navy rounded-3xl p-8 md:order-2"
          >
            <Badge className="mb-4 bg-haven-yellow/20 text-haven-yellow border-haven-yellow/30">
              Rich Birdlife
            </Badge>
            <h3 className="font-serif text-2xl font-semibold mb-4 text-haven-beige">Wildlife & Birdwatching</h3>
            <p className="text-haven-beige/80 mb-4 leading-relaxed">
              The area serves as habitat for diverse birdlife including pelicans, flamingos, herons, and exotic migratory species. 
              Our rooftop deck provides the perfect vantage point for observation.
            </p>
            <p className="text-haven-beige/80 leading-relaxed">
              Best viewing times are early morning and late afternoon when birds are most active.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-haven-navy-light text-haven-beige">Pelicans</Badge>
              <Badge variant="secondary" className="bg-haven-navy-light text-haven-beige">Flamingos</Badge>
              <Badge variant="secondary" className="bg-haven-navy-light text-haven-beige">Herons</Badge>
              <Badge variant="secondary" className="bg-haven-navy-light text-haven-beige">Kingfishers</Badge>
            </div>
          </motion.div>
        </div>
        
        {/* Seasonal Information */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="mt-20 glass-panel-navy rounded-3xl p-8"
        >
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-haven-yellow/20 text-haven-yellow border-haven-yellow/30">
              Year-Round Beauty
            </Badge>
            <h3 className="font-serif text-2xl font-semibold text-haven-beige">Best Times to Visit</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="font-semibold text-haven-yellow mb-2">Winter (Nov-Feb)</div>
              <div className="text-sm text-haven-beige/70">
                <p>Pleasant 22°C - 30°C</p>
                <p>Ideal for outdoor activities</p>
              </div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-haven-yellow mb-2">Summer (Mar-Jun)</div>
              <div className="text-sm text-haven-beige/70">
                <p>Warm 30°C - 40°C</p>
                <p>Great for lake activities</p>
              </div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-haven-yellow mb-2">Monsoon (Jul-Sep)</div>
              <div className="text-sm text-haven-beige/70">
                <p>Fresh 25°C - 35°C</p>
                <p>Lush green surroundings</p>
              </div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-haven-yellow mb-2">Post-Monsoon (Oct)</div>
              <div className="text-sm text-haven-beige/70">
                <p>Cool 24°C - 32°C</p>
                <p>Fresh atmosphere</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NaturalSurroundings;
