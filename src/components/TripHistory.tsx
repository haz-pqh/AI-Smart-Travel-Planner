import { motion, AnimatePresence } from "motion/react";
import { History, Trash2, ChevronRight, MapPin } from "lucide-react";
import { TripPlan } from "../services/gemini";

interface TripHistoryProps {
  trips: TripPlan[];
  onSelect: (trip: TripPlan) => void;
  onDelete: (idx: number) => void;
  onClose: () => void;
}

export function TripHistory({ trips, onSelect, onDelete, onClose }: TripHistoryProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-2xl border-l border-white/10 z-[60] shadow-2xl p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="text-blue-400" />
          Trip History
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          Close
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No saved trips yet.</p>
          <p className="text-sm mt-2">Generate your first itinerary to see it here!</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-2">
          {trips.map((trip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 group relative hover:border-blue-500/30 transition-all cursor-pointer"
              onClick={() => onSelect(trip)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                    {trip.destination}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {trip.duration} Days</span>
                    <span className="capitalize">{trip.budget} Budget</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(idx);
                  }}
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
