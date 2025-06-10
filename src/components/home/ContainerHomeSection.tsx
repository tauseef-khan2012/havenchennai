
import { motion } from 'framer-motion';
import { Wifi, Monitor, Users, Building2 } from 'lucide-react';

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
        staggerChildren: 0.2
      }
    }
  };

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
          <p className="text-haven-beige/80 mb-6 text-lg">
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
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-haven-navy-light/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-haven-yellow/20"
          >
            <div className="text-5xl font-bold text-haven-yellow mb-2">5</div>
            <div className="text-haven-beige text-lg font-medium tracking-wide">MAX GUESTS</div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-haven-navy-light/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-haven-yellow/20"
          >
            <div className="text-5xl font-bold text-haven-yellow mb-2">3</div>
            <div className="text-haven-beige text-lg font-medium tracking-wide">DECK LEVELS</div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-4 p-6 bg-haven-navy-light/50 rounded-2xl border border-haven-yellow/10"
          >
            <div className="w-12 h-12 bg-haven-yellow/20 rounded-full flex items-center justify-center">
              <Wifi className="h-6 w-6 text-haven-yellow" />
            </div>
            <div>
              <div className="text-haven-beige font-medium text-lg">High-Speed Wi-Fi</div>
              <div className="text-haven-beige/70">(500 Mbps)</div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-4 p-6 bg-haven-navy-light/50 rounded-2xl border border-haven-yellow/10"
          >
            <div className="w-12 h-12 bg-haven-yellow/20 rounded-full flex items-center justify-center">
              <Monitor className="h-6 w-6 text-haven-yellow" />
            </div>
            <div>
              <div className="text-haven-beige font-medium text-lg">32-inch Monitor/Smart TV</div>
              <div className="text-haven-beige/70">Entertainment & Work</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContainerHomeSection;
