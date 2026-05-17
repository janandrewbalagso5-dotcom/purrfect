import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, X, Download, Upload, Trash2, LayoutDashboard, Grid, Camera, Edit3 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { memories } from '../../data';
import { SpotlightCard } from '../ui/SpotlightCard';

const MOODS = ['All', 'Sleepy', 'Chaotic', 'Majestic', 'Hungry', 'Mischievous'];

export const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('masonry');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('purrfect-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [customMoods, setCustomMoods] = useState(() => {
    const saved = localStorage.getItem('purrfect-custom-moods');
    return saved ? JSON.parse(saved) : [];
  });

  const allMoods = [...new Set([...MOODS, ...customMoods])];

  useEffect(() => {
    localStorage.setItem('purrfect-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('purrfect-custom-moods', JSON.stringify(customMoods));
  }, [customMoods]);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const [customMemories, setCustomMemories] = useState(() => {
    const saved = localStorage.getItem('purrfect-custom-memories');
    return saved ? JSON.parse(saved) : [];
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ photo: '', caption: '', story: '', tags: '', mood: 'All' });
  const [memoryToDelete, setMemoryToDelete] = useState(null);
  const [showAddMoodModal, setShowAddMoodModal] = useState(false);
  const [newMoodInput, setNewMoodInput] = useState('');

  useEffect(() => {
    localStorage.setItem('purrfect-custom-memories', JSON.stringify(customMemories));
  }, [customMemories]);

  const [deletedMemories, setDeletedMemories] = useState(() => {
    const saved = localStorage.getItem('purrfect-deleted-memories');
    return saved ? JSON.parse(saved) : [];
  });

  const [editedMemories, setEditedMemories] = useState(() => {
    const saved = localStorage.getItem('purrfect-edited-memories');
    return saved ? JSON.parse(saved) : {};
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem('purrfect-deleted-memories', JSON.stringify(deletedMemories));
  }, [deletedMemories]);

  useEffect(() => {
    localStorage.setItem('purrfect-edited-memories', JSON.stringify(editedMemories));
  }, [editedMemories]);

  const confirmDeleteMemory = (id) => {
    setMemoryToDelete(id);
  };

  const executeDeleteMemory = () => {
    if (memoryToDelete) {
      if (String(memoryToDelete).startsWith('custom-')) {
        setCustomMemories(customMemories.filter(m => m.id !== memoryToDelete));
      } else {
        setDeletedMemories([...deletedMemories, memoryToDelete]);
      }
      setSelectedPhoto(null);
      setMemoryToDelete(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadData({ ...uploadData, photo: reader.result, date: new Date().toISOString().split('T')[0] });
        setShowUploadModal(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null; // reset
  };

  const handleSaveUpload = () => {
    const memoryData = {
      photo: uploadData.photo,
      caption: uploadData.caption || 'A purrfect moment',
      story: uploadData.story || '',
      date: uploadData.date || new Date().toISOString().split('T')[0],
      location: uploadData.location || 'Home',
      mood: uploadData.mood === 'All' ? 'Sleepy' : uploadData.mood,
      tags: uploadData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (editingId) {
      if (String(editingId).startsWith('custom-')) {
        setCustomMemories(customMemories.map(m => m.id === editingId ? { ...m, ...memoryData } : m));
      } else {
        setEditedMemories({ ...editedMemories, [editingId]: memoryData });
      }
      setSelectedPhoto({ id: editingId, catId: selectedPhoto?.catId || 'custom', ...memoryData });
    } else {
      const newMemory = {
        id: `custom-${Date.now()}`,
        catId: 'custom',
        ...memoryData
      };
      setCustomMemories([newMemory, ...customMemories]);
    }
    
    setShowUploadModal(false);
    setEditingId(null);
    setUploadData({ photo: '', caption: '', story: '', tags: '', mood: 'All', location: '', date: '' });
  };

  const handleEditClick = () => {
    setUploadData({
      photo: selectedPhoto.photo,
      caption: selectedPhoto.caption,
      story: selectedPhoto.story || '',
      tags: selectedPhoto.tags.join(', '),
      mood: selectedPhoto.mood,
      date: selectedPhoto.date,
      location: selectedPhoto.location || ''
    });
    setEditingId(selectedPhoto.id);
    setShowUploadModal(true);
  };

  const executeAddMood = () => {
    if (newMoodInput && newMoodInput.trim() !== '') {
      const formattedMood = newMoodInput.trim().charAt(0).toUpperCase() + newMoodInput.trim().slice(1).toLowerCase();
      if (!allMoods.includes(formattedMood)) {
        setCustomMoods([...customMoods, formattedMood]);
      }
    }
    setShowAddMoodModal(false);
    setNewMoodInput('');
  };

  const baseMemories = [...customMemories, ...memories].filter(m => !deletedMemories.includes(m.id));
  const allMemories = baseMemories.map(m => editedMemories[m.id] ? { ...m, ...editedMemories[m.id] } : m);

  const allMonthsList = [...new Set(allMemories.map(m => {
    let dateObj = new Date(m.date);
    if (isNaN(dateObj)) dateObj = new Date();
    return dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }))].sort((a, b) => new Date(b) - new Date(a));

  const filteredMemories = allMemories.filter(m => {
    const matchesMood = filter === 'All' || m.mood === filter;
    const matchesSearch = m.caption.toLowerCase().includes(search.toLowerCase()) || 
                          m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    let matchesMonth = true;
    if (monthFilter !== 'All') {
      let dateObj = new Date(m.date);
      if (isNaN(dateObj)) dateObj = new Date();
      const mYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      matchesMonth = (mYear === monthFilter);
    }

    return matchesMood && matchesSearch && matchesMonth;
  });

  const groupedMemories = filteredMemories.reduce((acc, memory) => {
    let dateObj = new Date(memory.date);
    if (isNaN(dateObj)) dateObj = new Date(); // fallback
    const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(memory);
    return acc;
  }, {});

  const groupedArray = Object.keys(groupedMemories)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(key => ({ monthYear: key, memories: groupedMemories[key] }));

  const exportMonthToImage = async (monthYear) => {
    const element = document.getElementById(`month-grid-${monthYear}`);
    if (!element) return;
    
    // Temporarily force desktop layout for mobile exports
    const originalWidth = element.style.width;
    const gridContainer = element.querySelector('.grid');
    const originalGridClasses = gridContainer ? gridContainer.className : '';
    
    if (gridContainer) {
      element.style.width = '1200px';
      // Replace mobile gap with desktop gap
      gridContainer.className = originalGridClasses.replace('gap-1 md:gap-4', 'gap-4');
    }

    // Add just the month name to the top of the image so people know what month it is when uploaded
    const titleDiv = document.createElement('div');
    titleDiv.className = "text-center mb-6 pb-4 border-b border-stone-200/50";
    titleDiv.innerHTML = `<h2 style="font-family: 'Caveat', cursive; font-size: 3.5rem; color: #292524; margin: 0;">${monthYear}</h2>`;
    element.insertBefore(titleDiv, element.firstChild);
    
    try {
      const dataUrl = await htmlToImage.toPng(element, {
        backgroundColor: '#fffefa', // Match cream background
        pixelRatio: 2, // High resolution for Instagram
        skipFonts: true, // Prevents cross-origin cssRules error
        style: {
          width: '1200px',
        }
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${monthYear.replace(' ', '-')}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to export image", error);
    } finally {
      if (element.contains(titleDiv)) {
        element.removeChild(titleDiv);
      }
      if (gridContainer) {
        element.style.width = originalWidth;
        gridContainer.className = originalGridClasses;
      }
    }
  };

  const exportScrapbookToImage = async () => {
    const element = document.getElementById('masonry-grid-export');
    const columnsContainer = document.getElementById('masonry-columns-container');
    if (!element) return;
    
    // Temporarily force desktop layout for mobile exports
    const originalWidth = element.style.width;
    const originalClasses = columnsContainer ? columnsContainer.className : '';
    
    if (columnsContainer) {
      element.style.width = '1200px';
      columnsContainer.className = originalClasses.replace('columns-1 sm:columns-2 lg:columns-3', 'columns-3');
    }

    try {
      const dataUrl = await htmlToImage.toPng(element, {
        backgroundColor: '#fffefa', 
        pixelRatio: 2, 
        skipFonts: true, // Prevents cross-origin cssRules error
        style: {
          padding: '40px',
          width: '1200px',
        }
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `my-purrfect-scrapbook.png`;
      link.click();
    } catch (error) {
      console.error("Failed to export scrapbook", error);
    } finally {
      if (columnsContainer) {
        element.style.width = originalWidth;
        columnsContainer.className = originalClasses;
      }
    }
  };

  return (
    <section id="gallery" className="py-24 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Memory Lane</h2>
        
        {/* Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          {/* Search, Upload, Month Filter */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto flex-wrap justify-center">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input 
                type="text"
                placeholder="Search memories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-2 rounded-full border border-stone-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
              />
            </div>

            <select 
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-2 rounded-full border border-stone-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all font-medium text-stone-600 cursor-pointer"
            >
              <option value="All">All Months</option>
              {allMonthsList.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            
            <label className="w-full md:w-auto cursor-pointer bg-stone-800 text-white px-6 py-2 rounded-full font-medium hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
              <Upload size={18} />
              <span>Upload</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            <div className="flex bg-white/50 p-1 rounded-full border border-stone-200">
              <button 
                onClick={() => setViewMode('masonry')} 
                className={`p-2 rounded-full transition-all ${viewMode === 'masonry' ? 'bg-white shadow-sm text-orange-500' : 'text-stone-400 hover:text-stone-600'}`}
                title="Scrapbook View"
              >
                 <LayoutDashboard size={18} />
              </button>
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-500' : 'text-stone-400 hover:text-stone-600'}`}
                title="Instagram Grid View"
              >
                 <Grid size={18} />
              </button>
            </div>
          </div>

          {/* Mood Filter */}
          <div className="flex flex-wrap justify-center gap-2 mt-6 md:mt-0 w-full md:w-auto">
            {allMoods.map(mood => (
              <button
                key={mood}
                onClick={() => setFilter(mood)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === mood 
                    ? 'bg-orange-400 text-white shadow-md transform scale-105' 
                    : 'bg-white text-stone-600 hover:bg-orange-100 border border-stone-100'
                }`}
              >
                {mood}
              </button>
            ))}
            <button
              onClick={() => setShowAddMoodModal(true)}
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-stone-50 text-stone-500 hover:bg-stone-200 border border-dashed border-stone-300 transition-all duration-300 flex items-center gap-1"
              title="Add custom mood"
            >
              + Mood
            </button>
          </div>
        </div>

        {/* Gallery Views */}
        {viewMode === 'masonry' ? (
          <div>
            <div className="flex justify-end mb-6">
              <button 
                onClick={exportScrapbookToImage}
                className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-5 py-2.5 rounded-full transition-colors shadow-sm"
                title="Download Scrapbook"
              >
                <Camera size={18} /> Export Scrapbook
              </button>
            </div>
            <div id="masonry-grid-export" className="bg-[#fffefa] -mx-4 md:mx-0 p-4 rounded-xl">
              <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredMemories.map((memory) => {
                const isFav = favorites.includes(memory.id);
                // Slight random rotation for scrapbook feel
                const rotation = Math.random() * 6 - 3;
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={memory.id}
                    className="break-inside-avoid"
                    style={{ rotate: rotation }}
                  >
                    <SpotlightCard className="polaroid cursor-pointer group" >
                      <div onClick={() => setSelectedPhoto(memory)}>
                        <div className="overflow-hidden rounded-sm relative">
                          <img 
                            src={memory.photo} 
                            alt={memory.caption}
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white font-medium px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm">View</span>
                          </div>
                        </div>
                        <p className="polaroid-caption mt-4 px-2 line-clamp-2">
                          {memory.caption}
                        </p>
                        
                        {/* Favorite Button */}
                        <button 
                          onClick={(e) => toggleFavorite(memory.id, e)}
                          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${
                            isFav ? 'bg-red-500/20 text-red-500' : 'bg-white/20 text-white hover:bg-white/40'
                          }`}
                        >
                          <Heart size={20} className={isFav ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
          </div>
          </div>
        ) : (
          <motion.div layout className="space-y-16">
            <AnimatePresence>
              {groupedArray.map((group) => (
                <motion.div 
                  key={group.monthYear}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between border-b border-stone-200/60 mb-6 pb-2">
                    <h3 className="text-3xl font-handwriting text-stone-800 text-left m-0">{group.monthYear}</h3>
                    <button 
                      onClick={() => exportMonthToImage(group.monthYear)}
                      className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-full transition-colors shadow-sm"
                      title="Download as Instagram Post"
                    >
                      <Camera size={16} /> Export Collage
                    </button>
                  </div>
                  
                  <div id={`month-grid-${group.monthYear}`} className="bg-[#fffefa] p-4 rounded-xl -mx-4 md:mx-0">
                    <div className="grid grid-cols-3 gap-1 md:gap-4">
                      {group.memories.map(memory => (
                      <motion.div 
                        key={memory.id} 
                        layoutId={memory.id}
                        onClick={() => setSelectedPhoto(memory)} 
                        className="aspect-square relative group cursor-pointer overflow-hidden bg-stone-100 rounded-sm md:rounded-xl"
                      >
                        <img 
                          src={memory.photo} 
                          alt={memory.caption}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                           <Heart className={favorites.includes(memory.id) ? 'fill-red-500 text-red-500' : 'text-white'} size={24} />
                           <span className="text-white text-xs md:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 hidden sm:block px-4 text-center truncate w-full">
                             {memory.caption}
                           </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredMemories.length === 0 && (
          <div className="py-20 text-stone-500 font-handwriting text-2xl">
            No memories found matching your search. Maybe they're hiding? 🐾
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-cream-50 rounded-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full md:w-3/5 bg-black">
                <img 
                  src={selectedPhoto.photo} 
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-contain max-h-[70vh] md:max-h-[80vh]"
                />
              </div>
              <div className="w-full md:w-2/5 p-8 flex flex-col justify-between relative bg-[#fffefa]">
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 transition-colors"
                >
                  <X size={24} />
                </button>
                
                <div>
                  <div className="flex items-center gap-2 mb-4 text-orange-500 text-sm font-semibold tracking-wider uppercase">
                    <span>{selectedPhoto.date}</span>
                    <span>•</span>
                    <span>{selectedPhoto.location}</span>
                  </div>
                  <h3 className="font-handwriting text-4xl text-stone-800 mb-6">{selectedPhoto.caption}</h3>
                  <p className="text-stone-600 leading-relaxed text-lg mb-6">{selectedPhoto.story}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedPhoto.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-auto w-full pt-4">
                  <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                    <button 
                      onClick={(e) => toggleFavorite(selectedPhoto.id, e)}
                      className={`flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 rounded-full font-medium transition-all text-xs md:text-sm ${
                        favorites.includes(selectedPhoto.id)
                          ? 'bg-red-50 text-red-500'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <Heart size={16} className={favorites.includes(selectedPhoto.id) ? 'fill-current' : ''} />
                      <span className="hidden sm:inline">{favorites.includes(selectedPhoto.id) ? 'Favorited' : 'Favorite'}</span>
                    </button>
                    <button 
                      onClick={handleEditClick}
                      className="flex items-center justify-center p-2 md:p-2.5 bg-stone-100 text-stone-600 hover:bg-stone-200 rounded-full transition-colors"
                      title="Edit memory"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => confirmDeleteMemory(selectedPhoto.id)}
                      className="flex items-center justify-center p-2 md:p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete memory"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-stone-800 text-white rounded-full font-medium hover:bg-stone-700 transition-colors text-xs md:text-sm whitespace-nowrap">
                    <Download size={16} />
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-cream-50 rounded-2xl overflow-hidden max-w-xl w-full flex flex-col shadow-2xl my-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
                <h3 className="text-xl font-bold text-stone-800">Add New Memory</h3>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-stone-400 hover:text-stone-800 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh] bg-white">
                <div className="mb-6 rounded-lg overflow-hidden bg-stone-100 flex justify-center max-h-64">
                  <img src={uploadData.photo} alt="Preview" className="object-contain w-auto h-full" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">Caption</label>
                    <input 
                      type="text" 
                      value={uploadData.caption}
                      onChange={e => setUploadData({...uploadData, caption: e.target.value})}
                      placeholder="Caught orange-handed..."
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">Story (Optional)</label>
                    <textarea 
                      value={uploadData.story}
                      onChange={e => setUploadData({...uploadData, story: e.target.value})}
                      placeholder="What happened?"
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">Tags (Comma separated)</label>
                      <input 
                        type="text" 
                        value={uploadData.tags}
                        onChange={e => setUploadData({...uploadData, tags: e.target.value})}
                        placeholder="Cute, Funny"
                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">Date</label>
                      <input 
                        type="date" 
                        value={uploadData.date || ''}
                        onChange={e => setUploadData({...uploadData, date: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">Location</label>
                      <input 
                        type="text" 
                        value={uploadData.location || ''}
                        onChange={e => setUploadData({...uploadData, location: e.target.value})}
                        placeholder="Home, Living Room, etc."
                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">Mood</label>
                      <select 
                        value={uploadData.mood}
                        onChange={e => setUploadData({...uploadData, mood: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                      >
                        {allMoods.filter(m => m !== 'All').map(mood => (
                          <option key={mood} value={mood}>{mood}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-stone-50 border-t border-stone-200 flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setShowUploadModal(false);
                    setEditingId(null);
                    setUploadData({ photo: '', caption: '', story: '', tags: '', mood: 'All', location: '', date: '' });
                  }}
                  className="px-6 py-2 rounded-full font-medium text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveUpload}
                  className="px-6 py-2 rounded-full font-medium bg-orange-400 text-white hover:bg-orange-500 transition-colors shadow-sm"
                >
                  {editingId ? 'Save Changes' : 'Save Memory'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {memoryToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setMemoryToDelete(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-stone-800 mb-4">Delete Memory?</h3>
              <p className="text-stone-600 mb-8">Are you sure you want to permanently delete this memory? This cannot be undone.</p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setMemoryToDelete(null)}
                  className="px-5 py-2 rounded-full font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDeleteMemory}
                  className="px-5 py-2 rounded-full font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Mood Modal */}
      <AnimatePresence>
        {showAddMoodModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => {
              setShowAddMoodModal(false);
              setNewMoodInput('');
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-stone-800 mb-4">Add Custom Mood</h3>
              
              <input 
                type="text" 
                value={newMoodInput}
                onChange={e => setNewMoodInput(e.target.value)}
                placeholder="e.g., Grumpy, Cuddly..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') executeAddMood();
                }}
                className="w-full px-4 py-3 mb-8 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setShowAddMoodModal(false);
                    setNewMoodInput('');
                  }}
                  className="px-5 py-2 rounded-full font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeAddMood}
                  className="px-5 py-2 rounded-full font-medium bg-orange-400 text-white hover:bg-orange-500 transition-colors shadow-sm"
                >
                  Add Mood
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
