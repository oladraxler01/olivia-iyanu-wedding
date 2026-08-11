"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Loader2, Trophy, Medal, Search, UserCheck, Sparkles, AlertCircle } from "lucide-react";

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
export type GameTab = "all" | "trivia" | "memory" | "timeline" | "maze";
export type ScoreEntry = {
  id: number;
  guest_name: string;
  score: number;
  game_type?: string;
  created_at?: string;
  gamesPlayed?: number;
  rank?: number;
};

export default function Leaderboard({ currentPlayerName = "" }: { currentPlayerName?: string }) {
  const [activeTab, setActiveTab] = useState<GameTab>("all");
  const [allScores, setAllScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Local Player Search / Lookup
  const [storedPlayerName, setStoredPlayerName] = useState<string>("");
  const [searchPlayerQuery, setSearchPlayerQuery] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("olivia_iyanu_player_name") || "";
      setStoredPlayerName(saved);
    }
  }, [currentPlayerName]);

  const effectivePlayerName = useMemo(() => {
    return (searchPlayerQuery.trim() || currentPlayerName.trim() || storedPlayerName.trim()).toLowerCase();
  }, [searchPlayerQuery, currentPlayerName, storedPlayerName]);

  const fetchLeaderboard = async (game_type: GameTab) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("leaderboards")
        .select("id, guest_name, score, game_type, created_at");

      if (game_type !== "all") {
        query = query.eq("game_type", game_type).limit(2000);
        const { data, error: dbError } = await query;
        if (dbError) throw dbError;

        const bestScores: Record<string, ScoreEntry> = {};
        (data || []).forEach(entry => {
          const key = entry.guest_name.trim().toLowerCase();
          if (!bestScores[key]) {
            bestScores[key] = entry;
          } else {
            const currentBest = bestScores[key].score;
            if (entry.score > currentBest) bestScores[key] = entry;
          }
        });

        const sorted = Object.values(bestScores).sort((a, b) => b.score - a.score);

        // Assign exact rank numbers
        const ranked = sorted.map((item, idx) => ({
          ...item,
          rank: idx + 1,
        }));

        setAllScores(ranked);
      } else {
        query = query.limit(3000);
        const { data, error: dbError } = await query;
        if (dbError) throw dbError;
        
        const playerStats: Record<string, { guest_name: string; totalScore: number; games: Set<string>; created_at: string; bestScores: Record<string, number> }> = {};
        
        (data || []).forEach(entry => {
          const key = entry.guest_name.trim().toLowerCase();
          if (!playerStats[key]) {
            playerStats[key] = { guest_name: entry.guest_name.trim(), totalScore: 0, games: new Set(), created_at: entry.created_at, bestScores: {} };
          }
          const stats = playerStats[key];
          const gt = entry.game_type;
          
          if (!stats.bestScores[gt]) {
            stats.bestScores[gt] = entry.score;
            stats.games.add(gt);
          } else {
            const currentBest = stats.bestScores[gt];
            if (entry.score > currentBest) stats.bestScores[gt] = entry.score;
          }
        });
        
        Object.values(playerStats).forEach(stats => {
           Object.entries(stats.bestScores).forEach(([gt, best]) => {
              if (gt === 'trivia') stats.totalScore += Math.floor(best) * 1000;
              else if (gt === 'timeline') stats.totalScore += 10000;
              else if (gt === 'memory') stats.totalScore += Math.floor(best);
              else if (gt === 'maze') stats.totalScore += Math.floor(best);
           });
        });
        
        const aggregated: ScoreEntry[] = Object.values(playerStats)
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((stats, idx) => ({
            id: idx + 1,
            guest_name: stats.guest_name,
            score: stats.totalScore,
            game_type: "all",
            gamesPlayed: stats.games.size,
            rank: idx + 1,
          }));
          
        setAllScores(aggregated);
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to load leaderboard. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(activeTab);

    // Listen for score saved events from anywhere in the window
    const handleScoreSaved = () => {
      fetchLeaderboard(activeTab);
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("olivia_iyanu_player_name") || "";
        setStoredPlayerName(saved);
      }
    };

    window.addEventListener("wedding_score_saved", handleScoreSaved);
    return () => {
      window.removeEventListener("wedding_score_saved", handleScoreSaved);
    };
  }, [activeTab]);

  // Top 10 cutoff for public hall of fame
  const top10Scores = useMemo(() => allScores.slice(0, 10), [allScores]);

  // Find user standing in full list
  const userEntry = useMemo(() => {
    if (!effectivePlayerName) return null;
    return allScores.find(
      (s) => s.guest_name.trim().toLowerCase() === effectivePlayerName
    );
  }, [allScores, effectivePlayerName]);

  const isUserInTop10 = useMemo(() => {
    if (!userEntry || !userEntry.rank) return false;
    return userEntry.rank <= 10;
  }, [userEntry]);

  // Helper to format score & time label
  const renderScoreDetails = (entry: ScoreEntry, tab: GameTab) => {
    const effectiveTab = tab === "all" ? entry.game_type || "all" : tab;
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
        // since we used (1000 - timeMs % 1000) / 1000 to add fractions to score for tie breaking
        const msFrac = 1 - timeFrac; 
        timeStr = `(tie-break: ${msFrac.toFixed(3)})`;
      }
    }

    let unit = "";
    if (tab === "all") unit = "total pts";
    else if (effectiveTab === "memory" || effectiveTab === "maze") unit = "pts";
    else if (effectiveTab === "timeline" || isTrivia) unit = "pts";

    return (
      <div className="text-right">
        <span className="font-bold text-[#0E5C52] text-sm sm:text-base">{rawScore}</span>{" "}
        <span className="text-[10px] sm:text-xs font-normal text-[#6B5A63]">{unit}</span>
        {timeStr && <span className="text-[10px] text-[#8C7A84] block font-mono">{timeStr}</span>}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto mt-24">
      <div className="text-center mb-8">
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
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {[
          { id: "all", label: "🏆 All Games" },
          { id: "trivia", label: "❓ Couple Trivia" },
          { id: "memory", label: "🃏 Memory Match" },
          { id: "timeline", label: "⏳ Our Timeline" },
          { id: "maze", label: "🌀 Find the Bride" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as GameTab)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#0E5C52] text-white shadow-md scale-105"
                : "bg-white/70 text-[#6B5A63] hover:bg-white hover:text-[#0E5C52]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Player Search Lookup */}
      <div className="mb-4 flex items-center justify-between gap-3 bg-white/60 backdrop-blur-sm p-2.5 px-4 rounded-xl border border-[#E3D3DA]">
        <div className="flex items-center gap-2 text-xs text-[#6B5A63] flex-1">
          <Search className="w-4 h-4 text-[#8C7A84] flex-shrink-0" />
          <input
            type="text"
            value={searchPlayerQuery}
            onChange={(e) => setSearchPlayerQuery(e.target.value)}
            placeholder={
              effectivePlayerName
                ? `Lookup another player (Showing: ${effectivePlayerName})...`
                : "Type your name to check your standing..."
            }
            className="bg-transparent text-xs sm:text-sm text-[#241B22] placeholder:text-[#8C7A84] w-full focus:outline-none"
          />
        </div>
        {searchPlayerQuery && (
          <button
            onClick={() => setSearchPlayerQuery("")}
            className="text-[11px] text-[#B23A6B] hover:underline font-semibold cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Leaderboard Table (Top 10) */}
      <div className="bg-white rounded-2xl border border-[#E3D3DA] overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 bg-[#FDFBF7] p-4 text-xs font-bold uppercase tracking-wider text-[#6B5A63] border-b border-[#E3D3DA]">
          <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
          <div className="col-span-7 sm:col-span-8">Guest Name</div>
          <div className="col-span-3 text-right">Score</div>
        </div>

        <div className="min-h-[220px] max-h-[380px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#0E5C52]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#0E5C52]/40 transition-colors">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[220px] text-[#6B5A63]">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0E5C52]" />
              <p className="text-sm">Loading scores...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[220px] text-[#B23A6B] px-6 text-center">
              <p className="text-sm font-semibold mb-1">Could not load leaderboard</p>
              <p className="text-xs opacity-80">{error}</p>
            </div>
          ) : top10Scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[220px] text-[#6B5A63]">
              <p className="text-sm font-medium">No scores yet.</p>
              <p className="text-xs mt-1 text-[#8C7A84]">Be the first to play and top the board!</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#F3E7EB]">
              {top10Scores.map((entry, idx) => {
                const isCurrent =
                  effectivePlayerName &&
                  entry.guest_name.trim().toLowerCase() === effectivePlayerName;

                return (
                  <motion.li
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    key={entry.id || idx}
                    className={`grid grid-cols-12 items-center p-3.5 sm:p-4 transition-colors ${
                      isCurrent
                        ? "bg-[#0E5C52]/10 ring-2 ring-inset ring-[#0E5C52]/40"
                        : "hover:bg-[#FDFBF7]"
                    }`}
                  >
                    <div className="col-span-2 sm:col-span-1 flex justify-center">
                      {idx === 0 ? (
                        <Medal className="w-5 h-5 text-yellow-500" />
                      ) : idx === 1 ? (
                        <Medal className="w-5 h-5 text-gray-400" />
                      ) : idx === 2 ? (
                        <Medal className="w-5 h-5 text-amber-700" />
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-[#6B5A63]">
                          #{idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="col-span-7 sm:col-span-8 font-medium text-[#241B22] truncate pr-3 flex items-center flex-wrap gap-1.5">
                      <span className="truncate">{entry.guest_name}</span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0E5C52] text-white">
                          <Sparkles className="w-2.5 h-2.5" /> You
                        </span>
                      )}
                      {activeTab === "all" && entry.gamesPlayed && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#EFE0E5] text-[#6B5A63] rounded-md">
                          {entry.gamesPlayed} {entry.gamesPlayed === 1 ? "game" : "games"}
                        </span>
                      )}
                    </div>
                    <div className="col-span-3">
                      {renderScoreDetails(entry, activeTab)}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PERSONALISED STANDING CARD FOR PLAYERS OUTSIDE TOP 10
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {effectivePlayerName && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="mt-5"
          >
            {userEntry ? (
              userEntry.rank && userEntry.rank > 10 ? (
                /* Player played and ranked > 10: Clear indication & reassurance */
                <div className="bg-[#FFFDFB] rounded-2xl border-2 border-[#B23A6B]/30 shadow-sm p-4 sm:p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#B23A6B]/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#B23A6B]/15 text-[#B23A6B] flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      #{userEntry.rank}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-[#241B22]">
                            {userEntry.guest_name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B23A6B]/15 text-[#B23A6B]">
                            Your Current Standing
                          </span>
                        </div>

                        <div className="text-right">
                          {renderScoreDetails(userEntry, activeTab)}
                        </div>
                      </div>

                      <p className="text-xs text-[#6B5A63] leading-relaxed mt-2 bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E3D3DA]">
                        <span className="font-semibold text-[#0E5C52]">
                          ✨ Score safely recorded (Rank #{userEntry.rank} of {allScores.length} players)!
                        </span>{" "}
                        The Hall of Fame table above features the <strong>Top 10</strong> spots.
                        Play other wedding games or try again to boost your score and break into the Top 10!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Player is in the Top 10 */
                <div className="bg-[#0E5C52]/5 rounded-2xl border border-[#0E5C52]/20 p-3.5 px-4 flex items-center justify-between text-xs text-[#0E5C52]">
                  <div className="flex items-center gap-2 font-medium">
                    <UserCheck className="w-4 h-4 text-[#0E5C52]" />
                    <span>
                      <strong>{userEntry.guest_name}</strong>, you are featured at <strong>Rank #{userEntry.rank}</strong> in the Top 10!
                    </span>
                  </div>
                </div>
              )
            ) : (
              /* Player name entered but no score recorded for this game tab */
              <div className="bg-white/80 rounded-2xl border border-[#E3D3DA] p-3.5 px-4 flex items-center justify-between text-xs text-[#6B5A63]">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#B23A6B] flex-shrink-0" />
                  <span>
                    No recorded score for <strong>{effectivePlayerName}</strong> in <em>{activeTab === "all" ? "any game" : activeTab}</em> yet.
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#0E5C52]">Play above to get ranked!</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
