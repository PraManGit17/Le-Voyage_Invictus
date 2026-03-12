import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { X, Calendar, Map, Sparkles, NotebookText, Users } from 'lucide-react';

const getToday = () => new Date().toISOString().split('T')[0];

const CreateTripModal = ({ isOpen, onClose, onCreateTrip, isCreating }) => {
  const modalRef = useRef(null);
  const [formState, setFormState] = useState({
    title: '',
    startDate: getToday(),
    endDate: getToday(),
    notes: '',
    groupName: '',
    companions: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !modalRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.modal-field',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
      );
    }, modalRef);

    return () => ctx.revert();
  }, [isOpen]);

  const durationLabel = useMemo(() => {
    const start = new Date(formState.startDate);
    const end = new Date(formState.endDate);
    const diff = end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
    if (Number.isNaN(diff) || diff < 0) {
      return 'Invalid date range';
    }
    return `${Math.floor(diff / (24 * 60 * 60 * 1000)) + 1} day trip`;
  }, [formState.endDate, formState.startDate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const createdTrip = await onCreateTrip({
      ...formState,
      collaborators: formState.companions.split(',').map((c) => c.trim()).filter(Boolean),
    });
    if (!createdTrip) {
      setError('Unable to create workspace. Check your dates and try again.');
      return;
    }

    setFormState({
      title: '',
      startDate: getToday(),
      endDate: getToday(),
      notes: '',
      groupName: '',
      companions: '',
    });
    onClose(createdTrip.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose()}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-1">Create Trip Workspace</h2>
                <p className="text-slate-400 text-sm">Define the timeline first. You can add destinations and activities next.</p>
              </div>
              <button onClick={() => onClose()} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 blur-3xl rounded-full" />
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="modal-field space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Trip Title</label>
                <div className="relative">
                  <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="title"
                    value={formState.title}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g., Rajasthan Heritage Tour"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="modal-field space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="startDate"
                      value={formState.startDate}
                      onChange={handleChange}
                      type="date"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none font-medium text-sm"
                    />
                  </div>
                </div>
                <div className="modal-field space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="endDate"
                      value={formState.endDate}
                      onChange={handleChange}
                      type="date"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none font-medium text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-field space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Travel Notes</label>
                <div className="relative">
                  <NotebookText className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea
                    name="notes"
                    value={formState.notes}
                    onChange={handleChange}
                    placeholder="Preferences, constraints, accessibility notes, or must-visit places..."
                    rows={4}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none font-medium text-sm resize-none"
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium ml-1">{durationLabel}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="modal-field space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Group Name (optional)</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="groupName"
                      value={formState.groupName}
                      onChange={handleChange}
                      type="text"
                      placeholder="e.g., College Squad"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none font-medium text-sm"
                    />
                  </div>
                </div>
                <div className="modal-field space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Companions (comma sep.)</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="companions"
                      value={formState.companions}
                      onChange={handleChange}
                      type="text"
                      placeholder="e.g., Priya, Arjun"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none font-medium text-sm"
                    />
                  </div>
                </div>
              </div>

              {error ? <p className="text-sm text-red-500 font-semibold">{error}</p> : null}

              <button
                type="submit"
                disabled={isCreating}
                className="modal-field w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all disabled:opacity-60"
              >
                <Sparkles size={18} />
                {isCreating ? 'Generating Workspace...' : 'Generate Workspace'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateTripModal;
