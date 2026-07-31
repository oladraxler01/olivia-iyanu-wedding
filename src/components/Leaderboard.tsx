"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Loader2, Trophy, Medal } from "lucide-react";

// ─── API LOGIC ──────────────────────────────────────────
export const saveScore = async (guest_name: string, game_type: string, score: number) => {
  // First check if the user already played this game
  const { data: existing, error: fetchError } = await supabase
    .from("leaderboards")
    .select("id")
    .eq("guest_name", guest_name)
    .eq("game_type", game_type)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw new Error("Failed to verify existing score: " + fetchError.message);
  }

  if (existing) {
    throw new Error("DUPLICATE");
  }

  const { error } = await supabase.from("leaderboards").insert([
    { guest_name, game_type, score },
  ]);

  if (error) {
    if (error.code === '23505') {
       throw new Error("DUPLICATE");
    }
    throw new Error("Failed to save score: " + error.message);
  }
};

// ─── DISPLAY COMPONENT ──────────────────────────────────
type GameTab = "all" | "trivia" | "memory" | "timeline" | "maze";
type ScoreEntry = { id: number; guest_name: string; score: number; game_type?: string; created_at?: string; gamesPlayed?: number };

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

      let query = supabase
        .from("leaderboards")
        .select("id, guest_name, score, game_type, created_at");

      if (game_type !== "all") {
        query = query.eq("game_type", game_type).limit(1000);
        const { data, error: dbError } = await query;
        if (dbError) throw dbError;

        const bestScores: Record<string, ScoreEntry> = {};
        (data || []).forEach(entry => {
          if (!bestScores[entry.guest_name]) {
            bestScores[entry.guest_name] = entry;
          } else {
            const currentBest = bestScores[entry.guest_name].score;
            if (isAscending) {
              if (entry.score < currentBest) bestScores[entry.guest_name] = entry;
            } else {
              if (entry.score > currentBest) bestScores[entry.guest_name] = entry;
            }
          }
        });

        const sorted = Object.values(bestScores).sort((a, b) => {
          if (isAscending) return a.score - b.score;
          return b.score - a.score;
        });
        setScores(sorted.slice(0, 10));
      } else {
        query = query.limit(1000);
        const { data, error: dbError } = await query;
        if (dbError) throw dbError;
        
        const playerStats: Record<string, { guest_name: string; totalScore: number; games: Set<string>; created_at: string; bestScores: Record<string, number> }> = {};
        
        (data || []).forEach(entry => {
          if (!playerStats[entry.guest_name]) {
            playerStats[entry.guest_name] = { guest_name: entry.guest_name, totalScore: 0, games: new Set(), created_at: entry.created_at, bestScores: {} };
          }
          const stats = playerStats[entry.guest_name];
          const gt = entry.game_type;
          
          if (!stats.bestScores[gt]) {
            stats.bestScores[gt] = entry.score;
            stats.games.add(gt);
          } else {
            const isAsc = gt !== "trivia";
            const currentBest = stats.bestScores[gt];
            if (isAsc) {
              if (entry.score < currentBest) stats.bestScores[gt] = entry.score;
            } else {
              if (entry.score > currentBest) stats.bestScores[gt] = entry.score;
            }
          }
        });
        
        Object.values(playerStats).forEach(stats => {
           Object.entries(stats.bestScores).forEach(([gt, best]) => {
              if (gt === 'trivia') stats.totalScore += Math.floor(best) * 10;
              else if (gt === 'timeline') stats.totalScore += 50;
              else if (gt === 'memory') stats.totalScore += Math.max(0, 100 - (Math.floor(best) * 2));
              else if (gt === 'maze') stats.totalScore += Math.max(0, 100 - (Math.floor(best) * 2));
           });
        });
        
        const aggregated = Object.values(playerStats)
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((stats, idx) => ({
            id: idx,
            guest_name: stats.guest_name,
            score: stats.totalScore,
            game_type: "all",
            gamesPlayed: stats.games.size
          }));
          
        setScores(aggregated.slice(0, 10));
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to load leaderboard. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
          { id: "all", label: "All Games" },
          { id: "trivia", label: "Couple Trivia" },
          { id: "memory", label: "Memory Match" },
          { id: "timeline", label: "Our Timeline" },
          { id: "maze", label: "Find the Bride" },
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

        <div className="min-h-[250px] max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#0E5C52]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#0E5C52]/40 transition-colors">
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
              {scores.map((entry, idx) => {
                const effectiveTab = activeTab === "all" ? entry.game_type : activeTab;
                const isTrivia = effectiveTab === "trivia";
                const isTimed = effectiveTab === "memory" || effectiveTab === "maze";
                const rawScore = isTimed || isTrivia ? Math.floor(entry.score) : entry.score;
                
                let timeStr = "";
                if (isTrivia) {
                  const timeFrac = entry.score - rawScore;
                  timeStr = timeFrac > 0 && timeFrac < 1 ? `(${(1 / timeFrac).toFixed(1)}s)` : "";
                } else if (isTimed) {
                  const timeFrac = entry.score - rawScore;
                  if (timeFrac > 0) {
                    const ms = timeFrac * 1000000;
                    timeStr = `(${(ms / 1000).toFixed(1)}s)`;
                  }
                }
                
                const gameNames: Record<string, string> = {
                  trivia: "Trivia",
                  memory: "Memory",
                  timeline: "Timeline",
                  maze: "Maze",
                };

                return (
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
                  <div className={`col-span-7 sm:col-span-8 font-medium text-[#241B22] truncate pr-4`}>
                    {entry.guest_name} 
                    {isTrivia && timeStr && <span className="text-[10px] text-[#6B5A63] ml-1">{timeStr}</span>}
                    {activeTab === "all" && <span className="text-[10px] text-[#6B5A63] ml-2">({entry.gamesPlayed} games)</span>}
                  </div>
                  <div className="col-span-3 text-right font-bold text-[#0E5C52]">
                    {rawScore} {activeTab === "all" ? <span className="text-[10px] font-normal text-[#6B5A63]">total pts</span> : effectiveTab === "memory" || effectiveTab === "maze" ? <span className="text-[10px] font-normal text-[#6B5A63]">moves</span> : effectiveTab === "timeline" || isTrivia ? <span className="text-[10px] font-normal text-[#6B5A63]">pts</span> : ""}
                  </div>
                </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
