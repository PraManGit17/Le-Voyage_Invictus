import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  MapPin, 
  Heart,
  Wallet,
  Users,
  Settings,
  Check
} from 'lucide-react';
import { useTrips } from '../../../context/TripContext';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { createTrip, isCreating } = useTrips();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  const totalSteps = 6;

  // Smooth step transitions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError('');
    }
  };

  const updateAnswer = (stepKey, questionKey, value) => {
    setAnswers(prev => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [questionKey]: value
      }
    }));
  };

  const handleComplete = async () => {
    console.log('Onboarding completed with answers:', answers);
    navigate('/dashboard');
  };

  // Onboarding Steps Data - 6 questions total
  const onboardingSteps = [
    {
      key: 'profile',
      title: 'Personal Information',
      subtitle: 'Tell us about yourself',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      question: {
        key: 'travelExperience',
        title: 'How would you describe your travel experience?',
        type: 'single',
        required: true,
        options: [
          { value: 'beginner', label: 'First-time Traveler', desc: 'New to travel, prefer guided experiences' },
          { value: 'occasional', label: 'Occasional Traveler', desc: 'Travel 1-2 times per year' },
          { value: 'frequent', label: 'Frequent Traveler', desc: 'Travel 3-5 times per year' },
          { value: 'expert', label: 'Travel Expert', desc: 'Travel more than 6 times per year' },
          { value: 'business', label: 'Business Traveler', desc: 'Primarily travel for work' },
          { value: 'digital', label: 'Digital Nomad', desc: 'Work remotely while traveling' }
        ]
      }
    },
    {
      key: 'destination',
      title: 'Destination Preferences',
      subtitle: 'Where do you love to go?',
      icon: MapPin,
      color: 'from-purple-500 to-purple-600',
      question: {
        key: 'destinationType',
        title: 'Which type of destinations appeal to you most?',
        type: 'multiple',
        required: true,
        options: [
          { value: 'cities', label: 'Urban Cities', desc: 'Museums, galleries, nightlife, shopping' },
          { value: 'nature', label: 'Natural Landscapes', desc: 'Mountains, forests, national parks' },
          { value: 'beaches', label: 'Coastal Destinations', desc: 'Beaches, water sports, seaside relaxation' },
          { value: 'historic', label: 'Historical Sites', desc: 'Ancient ruins, heritage locations' },
          { value: 'cultural', label: 'Cultural Immersion', desc: 'Local communities, traditions, festivals' },
          { value: 'adventure', label: 'Adventure Destinations', desc: 'Extreme sports, challenging activities' }
        ]
      }
    },
    {
      key: 'activities',
      title: 'Activity Preferences',
      subtitle: 'What do you enjoy doing?',
      icon: Heart,
      color: 'from-green-500 to-green-600',
      question: {
        key: 'interests',
        title: 'Which activities interest you most?',
        type: 'multiple',
        required: true,
        options: [
          { value: 'museums', label: 'Museums & Galleries', desc: 'Art, history, science exhibitions' },
          { value: 'outdoors', label: 'Outdoor Adventures', desc: 'Hiking, camping, nature exploration' },
          { value: 'food', label: 'Food & Culinary', desc: 'Local cuisine, cooking classes, food tours' },
          { value: 'nightlife', label: 'Nightlife & Entertainment', desc: 'Bars, clubs, live music venues' },
          { value: 'shopping', label: 'Shopping & Markets', desc: 'Markets, boutiques, local crafts' },
          { value: 'wellness', label: 'Wellness & Spa', desc: 'Relaxation, meditation, spa treatments' }
        ]
      }
    },
    {
      key: 'budget',
      title: 'Budget Planning',
      subtitle: 'Plan your travel expenses',
      icon: Wallet,
      color: 'from-amber-500 to-amber-600',
      question: {
        key: 'budgetRange',
        title: 'What is your typical budget range for a week-long trip?',
        type: 'single',
        required: true,
        options: [
          { value: 'budget1', label: 'Under ₹25,000', desc: 'Budget-conscious travel' },
          { value: 'budget2', label: '₹25,000 - ₹50,000', desc: 'Mid-range comfort' },
          { value: 'budget3', label: '₹50,000 - ₹1,00,000', desc: 'Premium experience' },
          { value: 'budget4', label: '₹1,00,000 - ₹2,00,000', desc: 'Luxury travel' },
          { value: 'budget5', label: '₹2,00,000 - ₹5,00,000', desc: 'Ultra-luxury experience' },
          { value: 'budget6', label: 'Above ₹5,00,000', desc: 'No budget constraints' }
        ]
      }
    },
    {
      key: 'social',
      title: 'Social Preferences',
      subtitle: 'How do you like to travel?',
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      question: {
        key: 'groupSize',
        title: 'What is your preferred travel group size?',
        type: 'single',
        required: true,
        options: [
          { value: 'solo', label: 'Solo Travel', desc: 'Independent exploration and freedom' },
          { value: 'couple', label: 'Couple Travel', desc: 'Romantic getaways and partner travel' },
          { value: 'small', label: 'Small Group (3-5)', desc: 'Close friends or family members' },
          { value: 'medium', label: 'Medium Group (6-10)', desc: 'Extended group of friends or family' },
          { value: 'large', label: 'Large Group (10+)', desc: 'Big family reunions or group events' },
          { value: 'guided', label: 'Guided Tours', desc: 'Organized group tours with guide' }
        ]
      }
    },
    {
      key: 'preferences',
      title: 'Final Preferences',
      subtitle: 'Complete your profile',
      icon: Settings,
      color: 'from-indigo-500 to-indigo-600',
      question: {
        key: 'travelStyle',
        title: 'Which travel style best describes you?',
        type: 'single',
        required: true,
        options: [
          { value: 'planner', label: 'Detailed Planner', desc: 'Research extensively, plan every detail' },
          { value: 'flexible', label: 'Flexible Planner', desc: 'Basic planning with room for spontaneity' },
          { value: 'spontaneous', label: 'Spontaneous Explorer', desc: 'Minimal planning, go with the flow' },
          { value: 'luxury', label: 'Luxury Traveler', desc: 'Premium experiences and accommodations' },
          { value: 'backpacker', label: 'Budget Backpacker', desc: 'Cost-effective, authentic experiences' },
          { value: 'business', label: 'Business Efficient', desc: 'Quick, efficient, professional travel' }
        ]
      }
    }
  ];

  const isStepComplete = (step) => {
    const stepData = onboardingSteps[step - 1];
    if (!stepData) return false;

    const question = stepData.question;
    const answer = answers[stepData.key]?.[question.key];
    
    if (question.required) {
      if (question.type === 'multiple') {
        return answer && answer.length > 0;
      }
      return answer && answer.trim() !== '';
    }
    return true;
  };

  const currentStepData = onboardingSteps[currentStep - 1];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
    }
  };

  const progressVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
    }
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f5efe6' }}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors font-medium"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
          <div className="text-sm font-medium text-slate-600">
            Step {currentStep} of {totalSteps}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex gap-2 mb-3">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-3 flex-1 rounded-full transition-all duration-200 ${
                  currentStep > i + 1 
                    ? 'bg-green-500' 
                    : currentStep === i + 1 
                      ? 'bg-amber-500' 
                      : 'bg-amber-200'
                }`}
              >
                {currentStep === i + 1 && (
                  <motion.div
                    className="h-full bg-amber-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-slate-600 font-medium">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            {/* Step Header */}
            <motion.div variants={itemVariants} className="text-center">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center shadow-lg`}>
                <currentStepData.icon className="text-white" size={36} />
              </div>
              <h1 className="text-4xl font-display font-bold text-slate-800 mb-3">
                {currentStepData.title}
              </h1>
              <p className="text-xl text-slate-600 font-body">
                {currentStepData.subtitle}
              </p>
            </motion.div>

            {/* Question */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl p-8 shadow-lg border border-amber-100"
            >
              <h3 className="text-2xl font-display font-bold text-slate-800 mb-6">
                {currentStepData.question.title}
                {currentStepData.question.required && <span className="text-amber-600 ml-1">*</span>}
              </h3>

              {currentStepData.question.type === 'single' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentStepData.question.options?.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => updateAnswer(currentStepData.key, currentStepData.question.key, option.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 text-left rounded-2xl border-2 transition-all duration-200 ${
                        answers[currentStepData.key]?.[currentStepData.question.key] === option.value
                          ? 'border-amber-500 bg-amber-50 shadow-lg'
                          : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                      }`}
                    >
                      <h4 className="font-display font-bold text-slate-800 mb-2 text-lg">
                        {option.label}
                      </h4>
                      <p className="text-slate-600 font-body text-sm">{option.desc}</p>
                      {answers[currentStepData.key]?.[currentStepData.question.key] === option.value && (
                        <div className="mt-3">
                          <Check className="text-amber-600" size={20} />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {currentStepData.question.type === 'multiple' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentStepData.question.options?.map((option) => {
                    const isSelected = answers[currentStepData.key]?.[currentStepData.question.key]?.includes(option.value);
                    
                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => {
                          const current = answers[currentStepData.key]?.[currentStepData.question.key] || [];
                          const updated = isSelected
                            ? current.filter(v => v !== option.value)
                            : [...current, option.value];
                          updateAnswer(currentStepData.key, currentStepData.question.key, updated);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-6 text-left rounded-2xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 shadow-lg'
                            : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                        }`}
                      >
                        <h4 className="font-display font-bold text-slate-800 mb-2 text-lg">
                          {option.label}
                        </h4>
                        <p className="text-slate-600 font-body text-sm">{option.desc}</p>
                        {isSelected && (
                          <div className="mt-3">
                            <Check className="text-amber-600" size={20} />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between mt-12 pt-8"
        >
          <button
            onClick={prevStep}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
              currentStep === 1
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
            }`}
            disabled={currentStep === 1}
          >
            <ArrowLeft size={18} /> Previous
          </button>

          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <motion.button
                onClick={nextStep}
                disabled={!isStepComplete(currentStep)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-display font-bold text-lg transition-all ${
                  isStepComplete(currentStep)
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg hover:shadow-amber-500/30'
                    : 'bg-amber-200 text-amber-400 cursor-not-allowed'
                }`}
              >
                Next Step <ArrowRight size={20} />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-display font-bold text-lg shadow-lg hover:shadow-green-500/30 transition-all"
                disabled={isCreating}
              >
                {isCreating ? 'Saving...' : 'Complete Setup'} <Check size={20} />
              </motion.button>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-center font-medium"
          >
            {error}
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default OnboardingPage;
