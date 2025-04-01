import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import DoctorSignIn from './DoctorSignIn'; 
import Index from './Index';

const Ui = () => {
  const sparkleVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-blue-500 text-black">
      {/* Dynamic Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-animation"></div>

      {/* Content Section */}
      <div className="relative z-3 flex flex-col items-center justify-center text-center py-5">
        <Navbar />

        <motion.h1
          className="text-4xl font-bold uppercase my-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Tooth Tone Analyzer
        </motion.h1>

        <motion.p
          className="text-lg mb-4 px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Discover the perfect tooth shade with our advanced AI-powered solution. Simply upload your image, and we'll accurately predict the matching tone for a confident smile.
        </motion.p>

        

        <motion.div
          className="flex justify-around w-full mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <motion.div className="text-yellow-400 text-4xl" variants={sparkleVariants} animate="animate">✨</motion.div>
          <motion.div className="text-yellow-400 text-4xl" variants={sparkleVariants} animate="animate">✨</motion.div>
          <motion.div className="text-yellow-400 text-4xl" variants={sparkleVariants} animate="animate">✨</motion.div>
        </motion.div>
      </div>

      {/* Dynamic CSS for Background Animation */}
      <style>
        {`
          .bg-gradient-animation {
            background: linear-gradient(-45deg, #1f3c88, #4b79a1, #1f3c88);
            background-size: 400% 400%;
            animation: gradientBG 10s ease infinite;
          }

          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default Ui;
