import { motion } from "motion/react";
import { DollarSign, Clock, Compass, X } from "lucide-react";
import { useState } from "react";

interface TripFormProps {
  destination: string;
  onClose: () => void;
  onGenerate: (data: { duration: number; budget: string; style: string }) => void;
}

export function TripForm({ destination, onClose, onGenerate }: TripFormProps) {
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("medium");
  const [style, setStyle] = useState("adventure");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="glass-card w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Compass className="text-blue-400" />
          Customize Your Trip to {destination}
        </h2>

        <div className="space-y-6">
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Duration (Days)
            </label>
            <input
              type="range"
              min="1"
              max="14"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 Day</span>
              <span className="text-blue-400 font-bold">{duration} Days</span>
              <span>14 Days</span>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Budget Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["low", "medium", "high"].map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`py-2 rounded-lg border transition-all capitalize ${
                    budget === b
                      ? "border-blue-500 bg-blue-500/20 text-white"
                      : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4" /> Travel Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["adventure", "relaxing", "luxury", "foodie", "culture", "nature"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`py-2 rounded-lg border transition-all capitalize ${
                    style === s
                      ? "border-blue-500 bg-blue-500/20 text-white"
                      : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onGenerate({ duration, budget, style })}
            className="glow-button w-full mt-4"
          >
            Generate Itinerary
          </button>
        </div>
      </div>
    </motion.div>
  );
}
