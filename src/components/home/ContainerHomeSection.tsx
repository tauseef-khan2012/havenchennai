
import { motion } from 'framer-motion';
import { Wifi, Monitor, Users, Building2, Car, Coffee, Waves, TreePine } from 'lucide-react';

const ContainerHomeSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const popularAmenities = [
    {
      icon: Wifi,
      title: "High-Speed Wi-Fi",
      subtitle: "(500 Mbps)"
    },
    {
      icon: Monitor,
      title: "32-inch Monitor/Smart TV",
      subtitle: "Entertainment & Work"
    },
    {
      icon: Users,
      title: "Up to 5 Guests",
      subtitle: "Perfect for Groups"
    },
    {
      icon: Building2,
      title: "3 Deck Levels",
      subtitle: "Multi-level Experience"
    },
    {
      icon: Car,
      title: "Free Parking",
      subtitle: "On-site Parking"
    },
    {
      icon: Coffee,
      title: "Full Kitchen",
      subtitle: "Cook Your Meals"
    },
    {
      icon: Waves,
      title: "Lake Views",
      subtitle: "Muttukadu Lake"
    },
    {
      icon: TreePine,
      title: "Nature Immersion",
      subtitle: "Eco-friendly Retreat"
    }
  ];

  return (
    <section className="py-20 bg-haven-navy text-white">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-haven-beige mb-6">
            Book Your Stay
          </h2>
          <p className="text-haven-beige/80 mb-6 text-lg max-w-4xl mx-auto">
            An intimate getaway thoughtfully built using{' '}
            <span className="text-haven-yellow font-semibold">sustainable container architecture</span>, designed to promote
            connection and nature immersion. Located in Padur beside the serene Muttukadu Lake along
            Chennai's OMR, this eco-friendly accommodation blends minimal living with expansive lakeside views.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerChildren}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {popularAmenities.map((amenity, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="flex flex-col items-center text-center p-6 bg-haven-navy-light/50 rounded-2xl border border-haven-yellow/10 hover:border-haven-yellow/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-haven-yellow/20 rounded-full flex items-center justify-center mb-4">
                <amenity.icon className="h-6 w-6 text-haven-yellow" />
              </div>
              <div className="text-haven-beige font-medium text-sm mb-1">{amenity.title}</div>
              <div className="text-haven-beige/70 text-xs">{amenity.subtitle}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ContainerHomeSection;
