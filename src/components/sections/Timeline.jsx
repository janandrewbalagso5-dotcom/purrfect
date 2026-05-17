import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { timelineEvents as defaultEvents } from '../../data';
import * as Icons from 'lucide-react';

const AVAILABLE_ICONS = ['Home', 'Heart', 'Award', 'Camera', 'Star', 'Gift', 'MapPin', 'Music', 'Smile', 'Calendar', 'Cat'];

export const Timeline = () => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('purrfect-timeline');
    return saved ? JSON.parse(saved) : defaultEvents;
  });

  const [editingEvent, setEditingEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem('purrfect-timeline', JSON.stringify(events));
  }, [events]);

  const handleAdd = () => {
    setEditingEvent({
      id: `event-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      title: '',
      description: '',
      icon: 'Star',
      photo: ''
    });
    setShowModal(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleSave = () => {
    const isNew = !events.find(e => e.id === editingEvent.id);
    if (isNew) {
      setEvents([editingEvent, ...events]);
    } else {
      setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
    }
    setShowModal(false);
    setEditingEvent(null);
  };

  const confirmDelete = (id) => {
    setEventToDelete(id);
  };

  const executeDelete = () => {
    setEvents(events.filter(e => e.id !== eventToDelete));
    setEventToDelete(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingEvent({ ...editingEvent, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  return (
    <section className="py-24 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-16 relative">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h2>
        <p className="text-stone-500 text-lg mb-8">A timeline of unforgettable moments.</p>
        <button 
          onClick={handleAdd}
          className="mx-auto flex items-center gap-2 bg-orange-400 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-500 transition-colors shadow-sm"
        >
          <Icons.Plus size={20} /> Add Milestone
        </button>
      </div>

      <div className="relative border-l-2 border-orange-200 ml-4 md:ml-1/2 md:-translate-x-[1px]">
        {events.map((event, i) => {
          const Icon = Icons[event.icon] || Icons.Star;
          const isEven = i % 2 === 0;

          return (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className={`relative pl-8 md:pl-0 md:w-1/2 mb-12 ${isEven ? 'md:ml-auto md:pl-12' : 'md:pr-12 md:text-right'}`}
            >
              {/* Timeline dot */}
              <div className={`absolute top-0 left-[-9px] md:left-auto md:top-6 w-4 h-4 rounded-full bg-orange-400 border-4 border-white shadow-sm ${isEven ? 'md:left-[-9px]' : 'md:right-[-9px]'}`} />
              
              <div className={`bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative group hover:shadow-md transition-shadow`}>
                
                {/* Actions */}
                <div className={`absolute top-4 ${isEven ? 'right-4' : 'left-4'} flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                  <button onClick={() => handleEdit(event)} className="p-2 bg-stone-100 text-stone-500 rounded-full hover:bg-stone-200 transition-all">
                    <Icons.Edit2 size={16} />
                  </button>
                  <button onClick={() => confirmDelete(event.id)} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-all">
                    <Icons.Trash2 size={16} />
                  </button>
                </div>

                {/* Connecting Line on Desktop */}
                <div className={`hidden md:block absolute top-8 w-12 border-t-2 border-dashed border-orange-200 ${isEven ? 'right-full' : 'left-full'}`} />
                
                <div className={`flex items-center gap-4 mb-3 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                  <div className="p-3 bg-pink-50 text-pink-500 rounded-xl relative z-0">
                    <Icon size={24} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">{event.date}</span>
                    <h3 className="text-xl font-bold text-stone-800">{event.title}</h3>
                  </div>
                </div>
                <p className="text-stone-600 mb-4">{event.description}</p>
                {event.photo && (
                  <div className="rounded-xl overflow-hidden mt-4 shadow-sm border border-stone-100">
                    <img src={event.photo} alt={event.title} className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {showModal && editingEvent && (
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
              className="bg-cream-50 rounded-2xl overflow-hidden max-w-xl w-full flex flex-col shadow-2xl my-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
                <h3 className="text-xl font-bold text-stone-800">
                  {events.find(e => e.id === editingEvent.id) ? 'Edit Milestone' : 'Add Milestone'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-stone-400 hover:text-stone-800 transition-colors"
                >
                  <Icons.X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh] bg-white space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={editingEvent.title}
                    onChange={e => setEditingEvent({...editingEvent, title: e.target.value})}
                    placeholder="e.g., The Day We Met"
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Date</label>
                  <input 
                    type="text" 
                    value={editingEvent.date}
                    onChange={e => setEditingEvent({...editingEvent, date: e.target.value})}
                    placeholder="e.g., Oct 2023"
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Description</label>
                  <textarea 
                    value={editingEvent.description}
                    onChange={e => setEditingEvent({...editingEvent, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  ></textarea>
                </div>
                
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Attached Photo (Optional)</label>
                  {editingEvent.photo ? (
                    <div className="relative rounded-xl overflow-hidden mb-2 group">
                      <img src={editingEvent.photo} alt="Preview" className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <label className="cursor-pointer bg-white text-stone-800 px-4 py-2 rounded-full font-medium text-sm hover:bg-stone-100 flex items-center gap-2">
                          <Icons.Upload size={16} /> Change
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                        <button 
                          onClick={() => setEditingEvent({...editingEvent, photo: ''})}
                          className="bg-red-500 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-red-600 flex items-center gap-2"
                        >
                          <Icons.Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                      <Icons.Upload className="text-stone-400 mb-2" size={24} />
                      <span className="text-sm font-medium text-stone-500">Click to upload a photo</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Icon</label>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_ICONS.map(iconName => {
                      const IconComp = Icons[iconName] || Icons.Star;
                      return (
                        <button
                          key={iconName}
                          onClick={() => setEditingEvent({...editingEvent, icon: iconName})}
                          className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                            editingEvent.icon === iconName 
                              ? 'bg-orange-400 text-white shadow-md' 
                              : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                          }`}
                          title={iconName}
                        >
                          <IconComp size={24} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-stone-50 border-t border-stone-200 flex justify-end gap-3">
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
                  Save Milestone
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {eventToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setEventToDelete(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-stone-800 mb-4">Delete Milestone?</h3>
              <p className="text-stone-600 mb-8">Are you sure you want to permanently delete this milestone? This cannot be undone.</p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setEventToDelete(null)}
                  className="px-5 py-2 rounded-full font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  className="px-5 py-2 rounded-full font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
