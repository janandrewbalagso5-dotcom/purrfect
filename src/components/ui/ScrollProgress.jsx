import React from 'react';
import { motion, useScroll } from 'framer-motion';

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 bg-orange-300 transform origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
};
