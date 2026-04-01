/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hero } from "./components/Hero";
import { TripForm } from "./components/TripForm";
import { TripDashboard } from "./components/TripDashboard";
import { MapDisplay } from "./components/MapDisplay";
import { BudgetAnalysis } from "./components/BudgetAnalysis";
import { TripHistory } from "./components/TripHistory";
import { generateTripPlan, TripPlan } from "./services/gemini";
import { History, Sparkles, Loader2, RefreshCw, Moon, Sun } from "lucide-react";

export default function App() {
  const [destination, setDestination] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [history, setHistory] = useState<TripPlan[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("trip_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (newPlan: TripPlan) => {
    const updated = [newPlan, ...history.filter(h => h.destination !== newPlan.destination)].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("trip_history", JSON.stringify(updated));
  };

  const handleSearch = (dest: string) => {
    setDestination(dest);
    setShowForm(true);
  };

  const handleGenerate = async (data: { duration: number; budget: string; style: string }) => {
    if (!destination) return;
    setLoading(true);
    setShowForm(false);
    setError(null);
    try {
      const result = await generateTripPlan(destination, data.duration, data.budget, data.style);
      setPlan(result);
      saveToHistory(result);
      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError("Failed to generate itinerary. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSurpriseMe = () => {
    const destinations = ["Tokyo", "Paris", "Bali", "New York", "Reykjavik", "Cape Town", "Kyoto", "Santorini"];
    const randomDest = destinations[Math.floor(Math.random() * destinations.length)];
    handleSearch(randomDest);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter">AI TRAVEL</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSurpriseMe}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Surprise Me
          </button>
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all relative"
          >
            <History className="w-5 h-5" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-[10px] flex items-center justify-center font-bold">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero onSearch={handleSearch} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <h2 className="mt-8 text-2xl font-bold tracking-widest uppercase text-blue-400">AI is planning your journey...</h2>
              <p className="mt-2 text-gray-500">Curating the best experiences just for you.</p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center"
            >
              {error}
            </motion.div>
          )}

          {plan && (
            <div id="results" className="mt-24 space-y-24">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <MapDisplay plan={plan} />
                    <TripDashboard plan={plan} />
                  </div>
                  <div className="space-y-8">
                    <BudgetAnalysis plan={plan} />
                    <div className="glass-card p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        AI Travel Tip
                      </h3>
                      <p className="text-gray-300 leading-relaxed italic">
                        "Based on your {plan.style} style, we recommend visiting {plan.itinerary[0].items[0].location} early in the morning to avoid crowds and get the best lighting for photos!"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {showForm && destination && (
          <TripForm 
            destination={destination} 
            onClose={() => setShowForm(false)} 
            onGenerate={handleGenerate}
          />
        )}
        {showHistory && (
          <TripHistory 
            trips={history} 
            onSelect={(t) => { setPlan(t); setShowHistory(false); }} 
            onDelete={(idx) => {
              const updated = history.filter((_, i) => i !== idx);
              setHistory(updated);
              localStorage.setItem("trip_history", JSON.stringify(updated));
            }}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>&copy; 2026 AI Smart Travel Planner. Built for the future of exploration.</p>
      </footer>
    </div>
  );
}

