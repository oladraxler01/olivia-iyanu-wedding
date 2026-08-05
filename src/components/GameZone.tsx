"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp, ChevronDown, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Heart, Loader2 } from "lucide-react";
import Leaderboard, { saveScore } from "./Leaderboard";

// ─── CUSTOM SVG ICONS ─────────────────────────────
const QuestionIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="12" stroke="#F3E7EB" strokeWidth="2.5" />
    <path d="M12 12.5C12 10.5 13.8 9 16 9C18.2 9 20 10.5 20 12.5C20 14.5 18.5 15 16 16V18" stroke="#F3E7EB" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="16" cy="22" r="1.5" fill="#F3E7EB" />
  </svg>
);

const CardsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="6" y="6" width="10" height="14" rx="2" stroke="#F3E7EB" strokeWidth="2.2" />
    <rect x="16" y="12" width="10" height="14" rx="2" stroke="#F3E7EB" strokeWidth="2.2" />
    <line x1="9" y1="10" x2="13" y2="10" stroke="#F3E7EB" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="19" y1="16" x2="23" y2="16" stroke="#F3E7EB" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TimelineIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <line x1="8" y1="10" x2="24" y2="10" stroke="#F3E7EB" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="8" y1="16" x2="20" y2="16" stroke="#F3E7EB" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="8" y1="22" x2="16" y2="22" stroke="#F3E7EB" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="26" cy="16" r="2" fill="#F3E7EB" />
  </svg>
);

const HeartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 27S4 20 4 12.5C4 8.9 7 6 10.5 6C12.8 6 14.8 7.2 16 9 C17.2 7.2 19.2 6 21.5 6C25 6 28 8.9 28 12.5C28 20 16 27 16 27Z" stroke="#F3E7EB" strokeWidth="2.2" strokeLinejoin="round" />
  </svg>
);

// ─── TYPES ────────────────────────────────────────
type GameId = "trivia" | "memory" | "timeline" | "maze" | null;

// ─── TRIVIA DATA ──────────────────────────────────
const triviaQuestions = [
  { q: "Where did Olivia and Iyanu meet?", options: ["A friend’s Birthday Party", "At work", "At the Tennis club", "In church"], answer: 1 },
  { q: "Who said 'I love you' first?", options: ["Olivia", "Iyanu", "Both at the same time", "Neither remembers"], answer: 1 },
  { q: "What is Iyanu's favourite meal Olivia cooks?", options: ["Beans and Plantain", "Efo and Poundo", "Jollof rice and Turkey with Plantains", "Afang and swallow"], answer: 3 },
  { q: "What is Olivia's love language?", options: ["Words of affirmation", "Quality time", "Acts of service", "Physical touch"], answer: 0 },
  { q: "What pet do they love to have?", options: ["A cat", "A Dog", "A parrot", "They are not lovers of pet"], answer: 1 },
  { q: "What's their preferred go-to date night activity?", options: ["Wings Night out", "Cooking together", "Mortal Kombat", "Laughter Cave"], answer: 0 },
  { q: "What city are they getting married in?", options: ["Abuja", "London", "Lagos", "Accra"], answer: 2 },
  { q: "Who is more likely to plan a spontaneous trip?", options: ["Obim", "Adesewa", "Both equally spontaneous", "Neither — they always plan ahead"], answer: 1 },
  { q: "What's their dream honeymoon destination?", options: ["Singapore", "Barbedos", "Santorini", "Bali"], answer: 0 },
  { q: "Who is the better dancer?", options: ["Obim", "Adesewa", "They're evenly matched", "Neither dances to save a life"], answer: 3 },
];

// ─── MEMORY MATCH DATA ────────────────────────────
const memoryIcons = [
  "/images/matching_game/IMG_3593.png",
  "/images/matching_game/IMG_3993.jpg",
  "/images/matching_game/SAVE_20260704_202817.jpg",
  "/images/matching_game/IMG_9412.jpg",
  "/images/matching_game/IMG_9510.jpg",
  "/images/matching_game/Copy of 68bc23f5-d6af-474c-a3f1-a594c66997e9.jpg",
  "/images/matching_game/Copy of IMG-20260722-WA0013.jpg",
  "/images/matching_game/Copy of IMG_5835.jpg",
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── TIMELINE DATA ────────────────────────────────
const correctTimelineOrder = [
  "First met at work",
  "First outing — terrible location, great conversation",
  "Attended church together",
  "Said I love you",
  "Official outing to meet friends",
  "Official outing to meet Family",
  "Wedding day — Friday, October 30th, 2026",
];

// ─── MAZE DATA ────────────────────────────────────
const mazeGrid = [
  [0,0,1,0,0,0],
  [1,0,1,0,1,0],
  [0,0,0,0,1,0],
  [0,1,1,0,0,0],
  [0,1,0,0,1,0],
  [0,0,1,1,0,0],
  [0,0,0,0,0,0],
]; // 0=open, 1=wall
const mazeStart = { r: 0, c: 0 };
const mazeEnd = { r: 6, c: 5 };

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════
export default function GameZone() {
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("olivia_iyanu_player_name");
      if (savedName) setPlayerName(savedName);
    }
  }, []);

  const handleSetPlayerName = (name: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      setPlayerName(trimmed);
      if (typeof window !== "undefined") {
        localStorage.setItem("olivia_iyanu_player_name", trimmed);
      }
    }
  };

  const games: { id: GameId; icon: React.ReactNode; title: string; sub: string }[] = [
    { id: "trivia", icon: <QuestionIcon />, title: "Couple Trivia", sub: "how well do you know us?" },
    { id: "memory", icon: <CardsIcon />, title: "Memory Match", sub: "flip the wedding icons" },
    { id: "timeline", icon: <TimelineIcon />, title: "Our Timeline", sub: "put our story in order" },
    { id: "maze", icon: <HeartIcon />, title: "Find the Bride", sub: "guide Iyanu to find Olivia" },
  ];

  return (
    <section id="games" className="py-24 px-4 bg-[#EFE0E5]">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B23A6B] mb-3">
            Before You RSVP
          </p>
          <h2
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            className="text-4xl sm:text-5xl font-light text-[#241B22] mb-3"
          >
            Get to know us – a little bit more.
          </h2>
          <p
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic" }}
            className="text-base sm:text-lg text-[#6B5A63]"
          >
            Four small games, one very real love story. Pick one below — you can play them all.
          </p>
        </motion.div>

        {/* Game Selector Icons */}
        <div className="flex justify-center items-start gap-8 sm:gap-14 mb-10">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGame(activeGame === g.id ? null : g.id)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  activeGame === g.id
                    ? "bg-[#0E5C52] ring-4 ring-[#0E5C52]/30 scale-110"
                    : "bg-[#1A3C3A] hover:bg-[#0E5C52] hover:scale-105"
                }`}
              >
                {g.icon}
              </div>
              <p
                className={`text-sm font-bold transition-colors ${
                  activeGame === g.id ? "text-[#0E5C52]" : "text-[#241B22]"
                }`}
              >
                {g.title}
              </p>
              <p className="text-[10px] text-[#6B5A63] text-center leading-tight max-w-[120px]">
                {g.sub}
              </p>
            </button>
          ))}
        </div>

        {/* Game Panel */}
        <AnimatePresence mode="wait">
          {activeGame && !playerName && (
            <motion.div
              key="name-entry"
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-[#FFFDFB] rounded-3xl border border-[#E3D3DA] shadow-lg p-6 sm:p-10 overflow-hidden"
            >
              <div className="max-w-sm mx-auto text-center py-8">
                <h3 className="font-serif text-2xl font-bold text-[#241B22] mb-3">Who's playing?</h3>
                <p className="text-sm text-[#6B5A63] mb-6">Enter your name to start playing and save your scores to the leaderboard.</p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const name = fd.get("player_name") as string;
                  if (name.trim()) handleSetPlayerName(name);
                }}>
                  <input type="text" name="player_name" placeholder="Your Name" required className="w-full px-4 py-3 border border-[#E3D3DA] rounded-xl text-center focus:outline-none focus:border-[#0E5C52] mb-4" />
                  <button type="submit" className="w-full py-3 bg-[#0E5C52] text-white text-sm font-bold rounded-xl hover:bg-[#0A4A42] transition-colors cursor-pointer">Start Game</button>
                </form>
                <button onClick={() => setActiveGame(null)} className="mt-4 text-xs font-bold text-[#6B5A63] hover:text-[#B23A6B] uppercase tracking-wider cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          )}
          {activeGame && playerName && (
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-[#FFFDFB] rounded-3xl border border-[#E3D3DA] shadow-lg p-6 sm:p-10 overflow-hidden"
            >
              {activeGame === "trivia" && <TriviaGame playerName={playerName} onClose={() => setActiveGame(null)} onNext={() => setActiveGame("memory")} nextTitle="Memory Match" />}
              {activeGame === "memory" && <MemoryGame playerName={playerName} onClose={() => setActiveGame(null)} onNext={() => setActiveGame("timeline")} nextTitle="Our Timeline" />}
              {activeGame === "timeline" && <TimelineGame playerName={playerName} onClose={() => setActiveGame(null)} onNext={() => setActiveGame("maze")} nextTitle="Find the Bride" />}
              {activeGame === "maze" && <MazeGame playerName={playerName} onClose={() => setActiveGame(null)} onNext={() => setActiveGame("trivia")} nextTitle="Couple Trivia" />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard embedded inside GameZone */}
        <Leaderboard currentPlayerName={playerName} />
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════
// GAME 1: COUPLE TRIVIA
// ═══════════════════════════════════════════════════
function TriviaGame({ playerName, onClose, onNext, nextTitle }: { playerName: string, onClose: () => void, onNext: () => void, nextTitle: string }) {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartTime(Date.now());
  }, []);

  const current = triviaQuestions[qIdx];

  const handleSelect = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    if (optIdx === current.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx < triviaQuestions.length - 1) {
        setQIdx((q) => q + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 800);
  };

  if (finished) {
    const rawScore = Math.floor(score);
    return (
      <div>
        <GameHeader title="Couple Trivia" onClose={onClose} />
        <div className="text-center py-10">
          <p className="text-6xl mb-4">{rawScore >= 7 ? "🎉" : rawScore >= 4 ? "😊" : "😅"}</p>
          <h3 className="font-serif text-3xl font-bold text-[#241B22] mb-2">
            Well done, {playerName}! You scored {rawScore} / {triviaQuestions.length}
          </h3>
          <p className="text-sm text-[#6B5A63] mb-6">
            {rawScore >= 7 ? "You really know us!" : rawScore >= 4 ? "Not bad at all!" : "We clearly need to hang out more."}
          </p>
          <AutoSaveScore gameType="trivia" score={score} playerName={playerName} />
          <button
            onClick={onNext}
            className="mt-6 px-6 py-2.5 rounded-full bg-[#0E5C52] text-white text-sm font-bold hover:bg-[#0A4A42] transition-colors cursor-pointer"
          >
            Next Game: {nextTitle}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <GameHeader title="Couple Trivia" onClose={onClose} />
      <p
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic" }}
        className="text-sm text-[#6B5A63] mb-6"
      >
        Ten questions. No pressure. (Okay, a little pressure.)
      </p>
      
      <div className="flex justify-between items-end mb-2">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B23A6B]">
          Question {qIdx + 1} of {triviaQuestions.length}
        </p>
        <p className="text-sm font-bold text-[#0E5C52]">
          Score: {Math.floor(score)}
        </p>
      </div>
      <h3
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        className="text-xl sm:text-2xl text-[#241B22] mb-6"
      >
        {current.q}
      </h3>
      <div className="space-y-3">
        {current.options.map((opt, i) => {
          let bg = "bg-white hover:bg-[#F3E7EB]/50";
          let border = "border-[#E3D3DA]";
          if (selected !== null) {
            if (i === current.answer) { bg = "bg-[#0E5C52]/10"; border = "border-[#0E5C52]"; }
            else if (i === selected) { bg = "bg-red-50"; border = "border-red-300"; }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-5 py-4 rounded-xl border ${border} ${bg} text-sm text-[#241B22] transition-all cursor-pointer`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// GAME 2: MEMORY MATCH
// ═══════════════════════════════════════════════════
function MemoryGame({ playerName, onClose, onNext, nextTitle }: { playerName: string, onClose: () => void, onNext: () => void, nextTitle: string }) {
  const [cards, setCards] = useState<{ icon: string; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const initGame = useCallback(() => {
    const pairs = shuffleArray([...memoryIcons, ...memoryIcons]);
    setCards(pairs.map((icon) => ({ icon, matched: false })));
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setStartTime(Date.now());
    setFinalScore(null);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { initGame(); }, [initGame]);

  const handleFlip = (idx: number) => {
    if (locked || flipped.includes(idx) || cards[idx].matched) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = newFlipped;
      if (cards[a].icon === cards[b].icon) {
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
          setFlipped([]);
          setLocked(false);
        }, 500);
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 800);
      }
    }
  };

  const allMatched = cards.length > 0 && cards.every((c) => c.matched);

  useEffect(() => {
    if (allMatched && !finalScore && startTime) {
      const timeMs = Date.now() - startTime;
      // Encode time as a fraction so lower time breaks ties (e.g., 15.042500)
      // Limit to 999,999 ms (~16 minutes) to fit cleanly in fraction
      const cappedMs = Math.min(timeMs, 999999);
      const scoreWithTime = moves + (cappedMs / 1000000);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFinalScore(scoreWithTime);
    }
  }, [allMatched, finalScore, startTime, moves]);

  return (
    <div>
      <GameHeader title="Memory Match" onClose={onClose} />
      <p
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic" }}
        className="text-sm text-[#6B5A63] mb-4"
      >
        Find every pair before you run out of patience.
      </p>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#241B22] font-medium">Moves: {moves}</p>
        <button
          onClick={initGame}
          className="text-sm font-bold text-[#0E5C52] underline underline-offset-2 hover:text-[#B23A6B] transition-colors cursor-pointer"
        >
          Restart
        </button>
      </div>

      {allMatched ? (
        <div className="text-center py-8">
          <p className="text-5xl mb-3">🎊</p>
          <h3 className="font-serif text-2xl font-bold text-[#241B22] mb-1">Well done, {playerName}!</h3>
          <p className="text-sm text-[#6B5A63]">You matched all pairs in {moves} moves.</p>
          {finalScore !== null && <AutoSaveScore gameType="memory" score={finalScore} playerName={playerName} />}
          <button onClick={onNext} className="mt-6 px-6 py-2 rounded-full border border-[#E3D3DA] text-sm text-[#0E5C52] hover:bg-[#F5EFEF] transition-colors">Next Game: {nextTitle}</button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || card.matched;
            return (
              <button
                key={idx}
                onClick={() => handleFlip(idx)}
                className={`relative aspect-square rounded-xl text-2xl sm:text-3xl flex items-center justify-center transition-all cursor-pointer border overflow-hidden ${
                  isFlipped
                    ? "bg-white border-[#E3D3DA] scale-100 p-0"
                    : "bg-[#1A3C3A] border-[#1A3C3A] hover:bg-[#0E5C52] p-2"
                }`}
              >
                {card.icon.startsWith("/") ? (
                  <Image 
                    src={card.icon} 
                    alt="memory card" 
                    fill 
                    sizes="150px" 
                    className={`object-cover transition-opacity duration-300 ${isFlipped ? "opacity-100" : "opacity-0"}`}
                    priority
                  />
                ) : (
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isFlipped ? "opacity-100" : "opacity-0"}`}>
                    {card.icon}
                  </div>
                )}
                
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isFlipped ? "opacity-0" : "opacity-100"}`}>
                  <Heart className="w-4 h-4 text-[#0E5C52]/40" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// GAME 3: OUR TIMELINE (SORT)
// ═══════════════════════════════════════════════════
function TimelineGame({ playerName, onClose, onNext, nextTitle }: { playerName: string, onClose: () => void, onNext: () => void, nextTitle: string }) {
  const [items, setItems] = useState<string[]>(() => shuffleArray([...correctTimelineOrder]));
  const [checked, setChecked] = useState(false);

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    setItems(copy);
    setChecked(false);
  };

  const isCorrect = items.every((item, i) => item === correctTimelineOrder[i]);

  return (
    <div>
      <GameHeader title="Our Timeline" onClose={onClose} />
      <p
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic" }}
        className="text-sm text-[#6B5A63] mb-6"
      >
        Use the arrows to put our story back in order.
      </p>

      <div className="space-y-3 mb-6">
        {items.map((item, idx) => (
          <div
            key={item}
            className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${
              checked
                ? item === correctTimelineOrder[idx]
                  ? "border-[#0E5C52] bg-[#0E5C52]/5"
                  : "border-red-300 bg-red-50"
                : "border-[#E3D3DA] bg-white"
            }`}
          >
            <span className="text-lg font-serif text-[#B23A6B]/50 font-light w-6">{idx + 1}</span>
            <p className="flex-1 text-sm text-[#241B22]">{item}</p>
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveItem(idx, -1)} className="p-0.5 text-[#6B5A63] hover:text-[#241B22] cursor-pointer">
                <ChevronUp className="w-4 h-4" />
              </button>
              <button onClick={() => moveItem(idx, 1)} className="p-0.5 text-[#6B5A63] hover:text-[#241B22] cursor-pointer">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isCorrect && checked ? (
        <div className="text-center py-4">
          <p className="text-4xl mb-2">🎉</p>
          <p className="font-serif text-xl font-bold text-[#0E5C52]">Well done, {playerName}! Perfect order!</p>
          <AutoSaveScore gameType="timeline" score={1} playerName={playerName} />
          <button onClick={onNext} className="mt-6 px-6 py-2 rounded-full border border-[#E3D3DA] text-sm text-[#0E5C52] hover:bg-[#F5EFEF] transition-colors">Next Game: {nextTitle}</button>
        </div>
      ) : (
        <button
          onClick={() => setChecked(true)}
          className="w-full py-3 rounded-full bg-[#0E5C52] text-white text-sm font-bold hover:bg-[#0A4A42] transition-colors cursor-pointer"
        >
          Check My Order
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// GAME 4: FIND THE GROOM (MAZE)
// ═══════════════════════════════════════════════════
function MazeGame({ playerName, onClose, onNext, nextTitle }: { playerName: string, onClose: () => void, onNext: () => void, nextTitle: string }) {
  const [pos, setPos] = useState(mazeStart);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!startTime) setStartTime(Date.now());
  }, [startTime]);

  const move = useCallback(
    (dr: number, dc: number) => {
      if (won) return;
      const nr = pos.r + dr;
      const nc = pos.c + dc;
      if (nr < 0 || nr >= mazeGrid.length || nc < 0 || nc >= mazeGrid[0].length) return;
      if (mazeGrid[nr][nc] === 1) return;
      setPos({ r: nr, c: nc });
      setMoves((prev) => prev + 1);
      if (nr === mazeEnd.r && nc === mazeEnd.c) {
        setWon(true);
        if (startTime) {
          const timeMs = Date.now() - startTime;
          const cappedMs = Math.min(timeMs, 999999);
          const scoreWithTime = (moves + 1) + (cappedMs / 1000000);
          setFinalScore(scoreWithTime);
        } else {
          setFinalScore(moves + 1);
        }
      }
    },
    [pos, won, startTime, moves]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") move(-1, 0);
      else if (e.key === "ArrowDown") move(1, 0);
      else if (e.key === "ArrowLeft") move(0, -1);
      else if (e.key === "ArrowRight") move(0, 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move]);

  const restart = () => { setPos(mazeStart); setMoves(0); setWon(false); setStartTime(Date.now()); setFinalScore(null); };

  return (
    <div>
      <GameHeader title="Help Iyanu Find His Bride" onClose={onClose} />
      <p
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic" }}
        className="text-sm text-[#6B5A63] mb-4"
      >
        Guide Iyanu through the maze to reach Olivia — use the arrows below or your keyboard.
      </p>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#241B22] font-medium">Moves: {moves}</p>
        <button onClick={restart} className="text-sm font-bold text-[#0E5C52] underline underline-offset-2 hover:text-[#B23A6B] transition-colors cursor-pointer">
          Restart
        </button>
      </div>

      {won ? (
        <div className="text-center py-8">
          <p className="text-5xl mb-3">💒</p>
          <h3 className="font-serif text-2xl font-bold text-[#241B22] mb-1">Well done, {playerName}!</h3>
          <p className="text-sm text-[#6B5A63]">You found Olivia in {moves} moves.</p>
          {finalScore !== null && <AutoSaveScore gameType="maze" score={finalScore} playerName={playerName} />}
          <button onClick={onNext} className="mt-6 px-6 py-2 rounded-full border border-[#E3D3DA] text-sm text-[#0E5C52] hover:bg-[#F5EFEF] transition-colors cursor-pointer">Next Game: {nextTitle}</button>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${mazeGrid[0].length}, 1fr)` }}>
              {mazeGrid.map((row, r) =>
                row.map((cell, c) => {
                  const isPlayer = pos.r === r && pos.c === c;
                  const isEnd = mazeEnd.r === r && mazeEnd.c === c;
                  const isWall = cell === 1;
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-md flex items-center justify-center text-lg transition-colors ${
                        isPlayer ? "bg-[#F3E7EB] border-2 border-[#B23A6B]" :
                        isEnd ? "bg-[#F3E7EB] border-2 border-[#0E5C52]" :
                        isWall ? "bg-[#1A3C3A]" : "bg-[#F3E7EB]/40"
                      }`}
                    >
                      {isPlayer ? "🤵" : isEnd ? "👰" : ""}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Arrow Controls */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-1 w-fit">
              <div />
              <button onClick={() => move(-1, 0)} className="w-10 h-10 rounded-lg bg-[#F3E7EB] border border-[#E3D3DA] flex items-center justify-center hover:bg-[#E3D3DA] cursor-pointer">
                <ArrowUp className="w-4 h-4 text-[#241B22]" />
              </button>
              <div />
              <button onClick={() => move(0, -1)} className="w-10 h-10 rounded-lg bg-[#F3E7EB] border border-[#E3D3DA] flex items-center justify-center hover:bg-[#E3D3DA] cursor-pointer">
                <ArrowLeft className="w-4 h-4 text-[#241B22]" />
              </button>
              <button onClick={() => move(1, 0)} className="w-10 h-10 rounded-lg bg-[#F3E7EB] border border-[#E3D3DA] flex items-center justify-center hover:bg-[#E3D3DA] cursor-pointer">
                <ArrowDown className="w-4 h-4 text-[#241B22]" />
              </button>
              <button onClick={() => move(0, 1)} className="w-10 h-10 rounded-lg bg-[#F3E7EB] border border-[#E3D3DA] flex items-center justify-center hover:bg-[#E3D3DA] cursor-pointer">
                <ArrowRight className="w-4 h-4 text-[#241B22]" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SHARED: GAME HEADER
// ═══════════════════════════════════════════════════
function GameHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <h3
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        className="text-2xl sm:text-3xl text-[#241B22]"
      >
        {title}
      </h3>
      <button
        onClick={onClose}
        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#6B5A63] hover:text-[#B23A6B] transition-colors cursor-pointer"
      >
        Close <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SHARED: SCORE FORM HELPER
// ═══════════════════════════════════════════════════
function AutoSaveScore({ gameType, score, playerName }: { gameType: string, score: number, playerName: string }) {
  const [status, setStatus] = useState<"saving" | "saved" | "error" | "duplicate">("saving");

  useEffect(() => {
    let isMounted = true;
    saveScore(playerName, gameType, score)
      .then(() => {
        if (isMounted) {
          setStatus("saved");
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("wedding_score_saved", { detail: { guest_name: playerName, game_type: gameType, score } }));
          }
        }
      })
      .catch((err) => { 
        if (isMounted) {
          if (err.message === "DUPLICATE") setStatus("duplicate");
          else setStatus("error");
        }
        console.error(err); 
      });
    return () => { isMounted = false; };
  }, [gameType, score, playerName]);

  if (status === "saving") return <p className="text-xs text-[#6B5A63] flex items-center justify-center gap-2 mt-4"><Loader2 className="w-3 h-3 animate-spin" /> Saving score to leaderboard...</p>;
  if (status === "duplicate") return <p className="text-xs text-[#B23A6B] mt-4 font-medium">You have already played this game. Your first score is recorded on the leaderboard.</p>;
  if (status === "error") return <p className="text-xs text-red-500 mt-4">Failed to save score.</p>;
  return (
    <div className="mt-4 text-center">
      <p className="text-xs font-bold text-[#0E5C52]">✨ Score safely saved to Leaderboard!</p>
      <p className="text-[11px] text-[#6B5A63] mt-0.5">Scroll down to the Hall of Fame below to check your exact standing.</p>
    </div>
  );
}
