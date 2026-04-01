import { motion } from "motion/react";
import { Clock, MapPin, DollarSign, CloudSun, Share2, Check } from "lucide-react";
import { TripPlan } from "../services/gemini";
import { useState } from "react";

interface TripDashboardProps {
  plan: TripPlan;
}

export function TripDashboard({ plan }: TripDashboardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `My Trip to ${plan.destination}\nDuration: ${plan.duration} days\nTotal Cost: $${plan.totalEstimatedCost}\n\nItinerary:\n${plan.itinerary.map(d => `Day ${d.day}: ${d.title}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 py-12">
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-3xl font-bold text-white">{plan.destination}</h2>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-blue-400"
              title="Share Itinerary"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {plan.duration} Days</span>
            <span className="flex items-center gap-1 capitalize"><DollarSign className="w-4 h-4" /> {plan.budget} Budget</span>
            <span className="flex items-center gap-1 capitalize"><MapPin className="w-4 h-4" /> {plan.style} Style</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
          <CloudSun className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Weather Preview</p>
            <p className="text-sm text-white">{plan.weatherPreview}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-16">
        {plan.itinerary.map((day, dayIdx) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: dayIdx * 0.1 }}
            className="relative"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                {day.day}
              </div>
              <h3 className="text-2xl font-bold text-white">{day.title}</h3>
            </div>

            <div className="ml-6 pl-10 border-l border-white/10 space-y-8">
              {day.items.map((item, itemIdx) => (
                <motion.div
                  key={itemIdx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 relative group hover:border-blue-500/30 transition-all"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[53px] top-8 w-6 h-6 rounded-full bg-[#0a0a0a] border-4 border-blue-500/50 group-hover:border-blue-500 transition-all" />
                  
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-blue-400 text-sm font-bold mb-2">
                        <Clock className="w-4 h-4" /> {item.time}
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-white">{item.activity}</h4>
                      <p className="text-gray-400 mb-4 leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {item.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> Est. ${item.estimatedCost}</span>
                      </div>
                    </div>
                    <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                      <img 
                        src={`https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=400&h=300&sig=${dayIdx}${itemIdx}`}
                        alt={item.location}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
