import { motion, useScroll, useTransform } from 'framer-motion';
import { PawPrint, Heart } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

export const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  
  return (
    <section className="relative h-[100svh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorations */}
      <motion.div style={{ y: y1 }} className="absolute top-20 left-20 text-orange-200/40 rotate-12">
        <PawPrint size={120} />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute bottom-40 right-20 text-pink-200/40 -rotate-12">
        <PawPrint size={160} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -20, 0] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-40 right-1/4 text-red-300/30"
      >
        <Heart size={80} />
      </motion.div>

      {/* Main Content */}
      <div className="z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-6xl md:text-8xl font-extrabold text-stone-800 mb-6 drop-shadow-sm tracking-tight">
            Purrfect <span className="text-orange-400">Memories</span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xl md:text-3xl text-stone-600 mb-12 font-handwriting leading-relaxed">
            A gallery of love, whiskers, and unforgettable moments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MagneticButton>
            <a href="#gallery" className="inline-flex items-center gap-2 bg-stone-800 text-cream-50 px-8 py-4 rounded-full text-lg font-medium hover:bg-stone-700 transition-colors shadow-lg">
              <PawPrint size={20} />
              <span>Enter the Gallery</span>
            </a>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400"
      >
        <span className="text-sm tracking-widest uppercase font-semibold">Scroll</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-0.5 h-8 bg-stone-300 rounded-full"
        />
      </motion.div>
    </section>
  );
};
