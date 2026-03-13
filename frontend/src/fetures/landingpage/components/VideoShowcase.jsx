import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Heart, Share, Eye } from 'lucide-react';

const VideoShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRef = useRef(null);

  const videoContent = [
    {
      id: 1,
      title: "AI Trip Planning in Action",
      description: "Watch how our AI creates personalized itineraries in seconds",
      thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: "2:15",
      views: "12K",
      category: "AI Planning"
    },
    {
      id: 2,
      title: "Collaborative Trip Planning",
      description: "Plan amazing trips together with friends in real-time",
      thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
      duration: "1:45",
      views: "8.5K",
      category: "Collaboration"
    },
    {
      id: 3,
      title: "Memory Book Creation",
      description: "Transform your travel photos into beautiful memory books",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", 
      duration: "3:20",
      views: "15K",
      category: "Memories"
    }
  ];

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoChange = (index) => {
    setActiveVideo(index);
    setIsPlaying(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleEnded = () => setIsPlaying(false);
      video.addEventListener('ended', handleEnded);
      return () => video.removeEventListener('ended', handleEnded);
    }
  }, [activeVideo]);

  return (
    <section className="py-24 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            See Le Voyage in <span className="text-amber-400 italic">Action</span>
          </h2>
          <p className="text-xl font-body text-slate-300 max-w-3xl mx-auto">
            Experience the power of AI-driven travel planning through these interactive demos and real user stories.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-2"
          >
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
              {/* Video Container */}
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster={videoContent[activeVideo].thumbnail}
                  muted={isMuted}
                  onLoadedData={() => setIsPlaying(false)}
                >
                  <source src={videoContent[activeVideo].videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Overlay */}
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Play/Pause Overlay */}
                {!isPlaying && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePlayPause}
                      className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <Play size={32} className="text-slate-900 ml-1" />
                    </motion.button>
                  </motion.div>
                )}
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handlePlayPause}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <div className="text-sm font-medium">
                        {videoContent[activeVideo].duration}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Eye size={16} />
                        <span>{videoContent[activeVideo].views} views</span>
                      </div>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                        <Heart size={16} />
                      </button>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                        <Share size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-6 bg-slate-800/50 border-t border-slate-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white mb-2">
                      {videoContent[activeVideo].title}
                    </h3>
                    <p className="font-body text-slate-300 text-sm leading-relaxed">
                      {videoContent[activeVideo].description}
                    </p>
                  </div>
                  <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {videoContent[activeVideo].category}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Video Playlist */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-display font-bold text-white mb-6">
              Featured Videos
            </h3>
            
            {videoContent.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleVideoChange(index)}
                className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:border-amber-400 ${
                  activeVideo === index ? 'border-amber-400 shadow-lg shadow-amber-400/25' : 'border-slate-600'
                }`}
              >
                <div className="flex gap-4 p-4 bg-slate-800/50 backdrop-blur-sm">
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg" />
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                    {activeVideo === index && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <Play size={12} className="text-slate-900 ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-semibold text-white text-sm mb-1 line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="font-body text-slate-400 text-xs line-clamp-2 mb-2">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{video.views} views</span>
                      <span>•</span>
                      <span>{video.category}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-3 bg-linear-to-r from-amber-600 to-amber-500 text-white rounded-xl font-display font-semibold hover:from-amber-700 hover:to-amber-600 transition-all shadow-lg"
            >
              View All Videos
            </motion.button>
          </motion.div>
        </div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="font-body text-slate-300 mb-6 text-lg">
            Ready to experience the future of travel planning?
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-linear-to-r from-amber-600 to-amber-500 text-white font-display font-bold text-lg rounded-full shadow-2xl shadow-amber-500/30 hover:from-amber-700 hover:to-amber-600 transition-all"
          >
            Start Planning Your Journey
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;