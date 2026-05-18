import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Zap, Eye, Volume2, Heart } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

const TRANSLATIONS = {
  "Meow": "Feed me immediately or suffer the consequences.",
  "Stare": "I am judging your life choices.",
  "Knock object": "Gravity test complete. Results: It falls.",
  "Purr": "I find your lap acceptable for now.",
  "Slow Blink": "I tolerate your existence."
};

export const MeowTranslator = () => {
  const [activeTranslation, setActiveTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = (action) => {
    setIsTranslating(true);
    setActiveTranslation(null);
    
    // Simulate loading/analyzing
    setTimeout(() => {
      setIsTranslating(false);
      setActiveTranslation({
        action,
        meaning: TRANSLATIONS[action]
      });
    }, 800);
  };

  const getIcon = (action) => {
    switch(action) {
      case 'Meow': return <Volume2 size={20} />;
      case 'Stare': return <Eye size={20} />;
      case 'Knock object': return <Zap size={20} />;
      case 'Purr': return <Heart size={20} />;
      default: return <MessageCircle size={20} />;
    }
  };

  return (
    <section className="py-24 px-4 bg-orange-50/30 overflow-hidden relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-orange-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-800">Meow Translator</h2>
            <p className="text-stone-500">Ever wonder what they're actually saying? Select a behavior to translate.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.keys(TRANSLATIONS).map(action => (
              <MagneticButton key={action}>
                <button 
                  onClick={() => translate(action)}
                  className="flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-orange-100 hover:text-orange-700 text-stone-700 rounded-full font-medium transition-colors"
                >
                  {getIcon(action)}
                  {action}
                </button>
              </MagneticButton>
            ))}
          </div>

          <div className="h-40 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 flex items-center justify-center p-6 relative">
            <AnimatePresence mode="wait">
              {isTranslating && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 text-orange-400 font-medium tracking-widest uppercase text-sm"
                >
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Zap size={20} />
                  </motion.div>
                  Translating Feline Frequency...
                </motion.div>
              )}

              {activeTranslation && !isTranslating && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="text-center"
                >
                  <span className="text-sm font-bold text-orange-400 uppercase tracking-widest block mb-2">
                    {activeTranslation.action} means:
                  </span>
                  <p className="font-handwriting text-3xl md:text-4xl text-stone-800">
                    "{activeTranslation.meaning}"
                  </p>
                </motion.div>
              )}

              {!activeTranslation && !isTranslating && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-stone-400 font-handwriting text-2xl"
                >
                  Waiting for input...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-200 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-200 rounded-full blur-3xl" />
      </div>
    </section>
  );
};
