import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { Hero } from './components/sections/Hero';
import { Gallery } from './components/sections/Gallery';
import { CatProfiles } from './components/sections/CatProfiles';
import { Timeline } from './components/sections/Timeline';
import { MeowTranslator } from './components/widgets/MeowTranslator';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { Volume2, VolumeX, Palette } from 'lucide-react';
import { MagneticButton } from './components/ui/MagneticButton';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [theme, setTheme] = useState('gojo');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    document.body.className = theme !== 'default' ? `theme-${theme}` : '';
  }, [theme]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Setup audio (Soft, relaxing cat purr from local file)
    audioRef.current = new Audio('/purr.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      lenis.destroy();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      // Need user interaction to play audio in modern browsers
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="relative">
      <ScrollProgress />
      
      {/* Global Theme Toggle */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">
        <AnimatePresence>
          {showThemeMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 flex flex-col gap-2 border border-stone-200"
            >
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">Themes</h4>
              <button onClick={() => { setTheme('gojo'); setShowThemeMenu(false); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors text-left ${theme === 'gojo' ? 'bg-orange-100 text-orange-600' : 'text-stone-600 hover:bg-stone-100'}`}>Gojo Cat (Default)</button>
              <button onClick={() => { setTheme('default'); setShowThemeMenu(false); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors text-left ${theme === 'default' ? 'bg-orange-100 text-orange-600' : 'text-stone-600 hover:bg-stone-100'}`}>Scrapbook </button>
              <button onClick={() => { setTheme('naruto'); setShowThemeMenu(false); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors text-left ${theme === 'naruto' ? 'bg-orange-100 text-orange-600' : 'text-stone-600 hover:bg-stone-100'}`}>Naruto Cat</button>
              <button onClick={() => { setTheme('sailor'); setShowThemeMenu(false); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors text-left ${theme === 'sailor' ? 'bg-orange-100 text-orange-600' : 'text-stone-600 hover:bg-stone-100'}`}>Sailor Moon Cat</button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <MagneticButton>
          <button 
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-stone-700 hover:text-orange-500 transition-colors border border-stone-200"
            aria-label="Toggle themes"
          >
            <Palette size={24} />
          </button>
        </MagneticButton>
      </div>

      {/* Global Audio Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <MagneticButton>
          <button 
            onClick={toggleAudio}
            className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-stone-700 hover:text-orange-500 transition-colors border border-stone-200"
            aria-label="Toggle background audio"
          >
            {isAudioPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </MagneticButton>
      </div>

      <main>
        <Hero />
        <Gallery />
        <CatProfiles />
        <Timeline />
        <MeowTranslator />
      </main>

      {/* Footer */}
      <footer className="py-12 text-center bg-stone-900 text-stone-400">
        <p className="font-handwriting text-2xl mb-4 text-cream-100">Made with 🤍 for our furry friends</p>
        <p className="text-sm">© {new Date().getFullYear()} Purrfect Memories Gallery</p>
      </footer>
    </div>
  );
}

export default App;
