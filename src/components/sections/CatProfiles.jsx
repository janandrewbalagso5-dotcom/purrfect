import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cats as defaultCats } from '../../data';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Edit2, Plus, X, Upload } from 'lucide-react';

export const CatProfiles = () => {
  const [cats, setCats] = useState(() => {
    const saved = localStorage.getItem('purrfect-cats');
    return saved ? JSON.parse(saved) : defaultCats;
  });

  const [editingCat, setEditingCat] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('purrfect-cats', JSON.stringify(cats));
  }, [cats]);

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCat({
      id: `cat-${Date.now()}`,
      name: '',
      breed: '',
      birthday: '',
      personality: [],
      favoriteFood: '',
      funFact: '',
      mood: 50,
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop'
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const isNew = !cats.find(c => c.id === editingCat.id);
    if (isNew) {
      setCats([...cats, editingCat]);
    } else {
      setCats(cats.map(c => c.id === editingCat.id ? editingCat : c));
    }
    setShowModal(false);
    setEditingCat(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCat({ ...editingCat, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  return (
    <section className="py-24 px-4 md:px-8 bg-pink-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">The Stars of the Show</h2>
          <p className="text-stone-500 text-lg mb-8">Meet the purrfect companions.</p>
          <button 
            onClick={handleAdd}
            className="mx-auto flex items-center gap-2 bg-orange-400 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-500 transition-colors shadow-sm"
          >
            <Plus size={20} /> Add New Star
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {cats.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <SpotlightCard className="bg-white rounded-3xl p-8 shadow-xl shadow-stone-200/50 border border-stone-100 h-full flex flex-col relative group">
                
                <button 
                  onClick={() => handleEdit(cat)}
                  className="absolute top-4 right-4 p-2 bg-stone-100 text-stone-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-stone-200 transition-all z-10"
                >
                  <Edit2 size={18} />
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                  <div className="w-40 h-40 shrink-0 rounded-full overflow-hidden border-4 border-orange-100 relative group/avatar">
                    <img 
                      src={cat.avatar} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-4xl font-bold text-stone-800 mb-2">{cat.name}</h3>
                    <p className="text-orange-500 font-medium mb-4">{cat.breed}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      {cat.personality.map(trait => (
                        <span key={trait} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 flex-grow">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-2">Favorite Food</h4>
                    <p className="text-lg text-stone-700">{cat.favoriteFood}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-2">Fun Fact</h4>
                    <p className="text-lg text-stone-700 italic">"{cat.funFact}"</p>
                  </div>
                  
                  {/* Mood Meter */}
                  <div className="pt-4 mt-auto">
                    <div className="flex justify-between items-end mb-2">
                      <h4 className="text-sm font-semibold text-stone-400 uppercase tracking-widest">Current Mood</h4>
                      <span className="text-2xl font-handwriting text-orange-500">{cat.mood}% Chaotic</span>
                    </div>
                    <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.mood}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-orange-300 to-pink-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {showModal && editingCat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-cream-50 rounded-2xl overflow-hidden max-w-2xl w-full flex flex-col shadow-2xl my-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
                <h3 className="text-xl font-bold text-stone-800">
                  {cats.find(c => c.id === editingCat.id) ? 'Edit Star Profile' : 'Add New Star'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-stone-400 hover:text-stone-800 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh] bg-white space-y-6">
                
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-100 mb-4 bg-stone-100 relative group">
                    <img src={editingCat.avatar} alt="Preview" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Upload className="text-white" size={24} />
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                  <p className="text-sm text-stone-500">Click image to upload new avatar</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      value={editingCat.name}
                      onChange={e => setEditingCat({...editingCat, name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">Breed</label>
                    <input 
                      type="text" 
                      value={editingCat.breed}
                      onChange={e => setEditingCat({...editingCat, breed: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">Favorite Food</label>
                    <input 
                      type="text" 
                      value={editingCat.favoriteFood}
                      onChange={e => setEditingCat({...editingCat, favoriteFood: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">Personality Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={editingCat.personality.join(', ')}
                      onChange={e => setEditingCat({
                        ...editingCat, 
                        personality: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-stone-700 mb-1">Fun Fact</label>
                    <textarea 
                      value={editingCat.funFact}
                      onChange={e => setEditingCat({...editingCat, funFact: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-stone-700 mb-1">Current Mood (Chaos Level: {editingCat.mood}%)</label>
                    <input 
                      type="range" 
                      min="0" max="100"
                      value={editingCat.mood}
                      onChange={e => setEditingCat({...editingCat, mood: parseInt(e.target.value)})}
                      className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-400"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-stone-50 border-t border-stone-200 flex justify-end gap-3">
                {cats.find(c => c.id === editingCat.id) && (
                  <button 
                    onClick={() => {
                      setCats(cats.filter(c => c.id !== editingCat.id));
                      setShowModal(false);
                    }}
                    className="px-6 py-2 rounded-full font-medium text-red-500 hover:bg-red-50 transition-colors mr-auto"
                  >
                    Remove Profile
                  </button>
                )}
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-full font-medium text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 rounded-full font-medium bg-orange-400 text-white hover:bg-orange-500 transition-colors shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
