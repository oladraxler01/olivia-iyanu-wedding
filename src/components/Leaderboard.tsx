"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Loader2, Trophy, Medal } from "lucide-react";

// ─── API LOGIC ──────────────────────────────────────────
export const saveScore = async (guest_name: string, game_type: string, score: number) => {
  const { error } = await supabase.from("leaderboards").insert([
    { guest_name, game_type, score },
  ]);
  if (error) throw new Error("Failed to save score: " + error.message);
};

// ─── DISPLAY COMPONENT ──────────────────────────────────
type GameTab = "trivia" | "memory" | "timeline" | "maze";
type ScoreEntry = { id: number; guest_name: string; score: number };

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<GameTab>("trivia");
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async (game_type: GameTab) => {
    setLoading(true);
    setError(null);
    try {
      const isAscending = game_type !== "trivia";

      const { data, error: dbError } = await supabase
        .from("leaderboards")
        .select("id, guest_name, score")
        .eq("game_type", game_type)
        .order("score", { ascending: isAscending })
        .limit(10);

      if (dbError) throw dbError;
      setScores(data || []);
    } catch (err: any) {
      console.error(err);
      setError("Unable to load leaderboard. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  return (
    <div className="max-w-3xl mx-auto mt-24">
      <div className="text-center mb-10">
        <Trophy className="w-10 h-10 text-[#B23A6B] mx-auto mb-4" />
        <h2
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          className="text-4xl sm:text-5xl font-light text-[#0E5C52] mb-3"
        >
          Hall of Fame
        </h2>
        <p className="text-sm sm:text-base text-[#6B5A63]">
          The top 10 players from our wedding games.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: "trivia", label: "Couple Trivia" },
          { id: "memory", label: "Memory Match" },
          { id: "timeline", label: "Our Timeline" },
          { id: "maze", label: "Find the Groom" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as GameTab)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-[#0E5C52] text-white"
                : "bg-white/50 text-[#6B5A63] hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl border border-[#E3D3DA] overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 bg-[#FDFBF7] p-4 text-xs font-bold uppercase tracking-wider text-[#6B5A63] border-b border-[#E3D3DA]">
          <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
          <div className="col-span-7 sm:col-span-8">Guest Name</div>
          <div className="col-span-3 text-right">Score</div>
        </div>

        <div className="min-h-[250px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[250px] text-[#6B5A63]">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0E5C52]" />
              <p className="text-sm">Loading scores...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[250px] text-[#B23A6B] px-6 text-center">
              <p className="text-sm font-semibold mb-1">Could not load leaderboard</p>
              <p className="text-xs opacity-80">{error}</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[250px] text-[#6B5A63]">
              <p className="text-sm">No scores yet.</p>
              <p className="text-xs mt-1">Be the first to get on the board!</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#F3E7EB]">
              {scores.map((entry, idx) => (
                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={entry.id || idx}
                  className="grid grid-cols-12 items-center p-4 hover:bg-[#FDFBF7] transition-colors"
                >
                  <div className="col-span-2 sm:col-span-1 flex justify-center">
                    {idx === 0 ? (
                      <Medal className="w-5 h-5 text-yellow-500" />
                    ) : idx === 1 ? (
                      <Medal className="w-5 h-5 text-gray-400" />
                    ) : idx === 2 ? (
                      <Medal className="w-5 h-5 text-amber-700" />
                    ) : (
                      <span className="text-sm font-bold text-[#6B5A63]">{idx + 1}</span>
                    )}
                  </div>
                  <div className="col-span-7 sm:col-span-8 font-medium text-[#241B22] truncate pr-4">
                    {entry.guest_name}
                  </div>
                  <div className="col-span-3 text-right font-bold text-[#0E5C52]">
                    {entry.score} {activeTab === "memory" || activeTab === "maze" ? <span className="text-[10px] font-normal text-[#6B5A63]">moves</span> : activeTab === "timeline" ? <span className="text-[10px] font-normal text-[#6B5A63]">pts</span> : ""}
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
