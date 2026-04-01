import { motion } from "motion/react";
import { Search, MapPin } from "lucide-react";

interface HeroProps {
  onSearch: (destination: string) => void;
}

export function Hero({ onSearch }: HeroProps) {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-[#0a0a0a] z-10" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"
        />
      </div>

      <div className="relative z-20 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-400">
            Plan Your Dream Trip <br /> with AI
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Experience the future of travel planning. Personalized itineraries, 
            real-time maps, and budget insights—all powered by intelligence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col md:flex-row items-center gap-4 p-2 glass-card max-w-2xl mx-auto"
        >
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <MapPin className="text-blue-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 py-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch((e.target as HTMLInputElement).value);
              }}
            />
          </div>
          <button 
            onClick={() => {
              const input = document.querySelector('input') as HTMLInputElement;
              if (input.value) onSearch(input.value);
            }}
            className="glow-button w-full md:w-auto flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Generate Trip
          </button>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
