import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
    const navigate = useNavigate();
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch((prev) => !prev);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center h-screen bg-black text-white overflow-hidden">
            {/* Camera PNG Animation */}
            <motion.img 
                src="https://static.vecteezy.com/system/resources/previews/009/345/859/large_2x/camera-lens-broken-photo.jpg" 
                alt="Broken Camera" 
                className="w-48 h-48 mb-6"
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            />
            
            {/* 404 Error Text */}
            <motion.h1 
                className="text-6xl font-bold"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                404 ERROR
            </motion.h1>
            
            {/* Error Message */}
            <motion.p 
                className="text-lg mt-2 text-center max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                Oops! Looks like the **camera lost focus** and the **drone crashed**! 📸🚁
            </motion.p>
            
            {/* Glitched Video Effect */}
            <div className={`relative mt-6 w-80 h-40 bg-gray-900 overflow-hidden ${glitch ? 'glitch' : ''}`}>
                <video className="w-full h-full object-cover opacity-50" autoPlay loop muted>
                    <source src="/videos/broken_video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black opacity-30" />
            </div>
            
            {/* Go to Home Page Button */}
            <motion.button 
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/')}
            >
                Go to Home Page
            </motion.button>
        </div>
    );
}
