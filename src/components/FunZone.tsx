"use client";

import { useState } from "react";
import { Sparkles, Music, HelpCircle, Heart, Send, CheckCircle2, Award } from "lucide-react";

export default function FunZone() {
  const [activeTab, setActiveTab] = useState<"trivia" | "jukebox" | "wishes">("trivia");

  // Trivia State
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const triviaQuestions = [
    {
      question: "Where did Tobi & Amanda meet for the very first time?",
      options: [
        "At a friend's birthday dinner in Ikoyi",
        "At Craft Cafe in Victoria Island over coffee",
        "At an airport lounge in London",
        "On a sunset boat cruise",
      ],
      answer: 1,
    },
    {
      question: "Who said 'I Love You' first?",
      options: [
        "Tobi, after 3 months of dating",
        "Amanda, during a rainy stroll",
        "Both simultaneously on Valentine's Day",
        "Tobi's best man accidentally blurted it out first!",
      ],
      answer: 0,
    },
    {
      question: "What is Amanda's absolute favorite dessert?",
      options: [
        "Red Velvet Cake",
        "Matcha Tiramisu",
        "Warm Chocolate Lava Cake with Vanilla Gelato",
        "French Macarons",
      ],
      answer: 2,
    },
    {
      question: "Where is the couple heading for their honeymoon?",
      options: [
        "Bora Bora & Tahiti",
        "Swiss Alps & Amalfi Coast",
        "Tokyo & Kyoto, Japan",
        "Maldives & Seychelles",
      ],
      answer: 0,
    },
  ];

  const handleAnswerSelect = (optionIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const submitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === triviaQuestions[currentQuestion].answer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizScore(0);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizCompleted(false);
  };

  // Jukebox State
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [songList, setSongList] = useState([
    { title: "Essence", artist: "Wizkid ft. Tems", requestedBy: "Sarah M." },
    { title: "Love Nwantiti", artist: "CKay", requestedBy: "David O." },
    { title: "Perfect", artist: "Ed Sheeran", requestedBy: "Auntie Mary" },
  ]);
  const [songAddedNotice, setSongAddedNotice] = useState(false);

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle || !artist) return;
    setSongList([
      { title: songTitle, artist: artist, requestedBy: "You" },
      ...songList,
    ]);
    setSongTitle("");
    setArtist("");
    setSongAddedNotice(true);
    setTimeout(() => setSongAddedNotice(false), 3000);
  };

  // Wishes Wall State
  const [newWish, setNewWish] = useState("");
  const [wishAuthor, setWishAuthor] = useState("");
  const [wishes, setWishes] = useState([
    {
      name: "Uncle Femi & Family",
      text: "Wishing Tobi and Amanda a lifetime of overflowing joy, love, and divine blessings!",
      time: "2 hours ago",
    },
    {
      name: "Jessica & Kemi",
      text: "Can't wait to dance the night away in our Asoebi! So thrilled for you two lovers!",
      time: "5 hours ago",
    },
    {
      name: "Daniel (Groomsman)",
      text: "Tobi, you got the best partner for life. Cheers to forever my brother!",
      time: "1 day ago",
    },
  ]);

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish || !wishAuthor) return;
    setWishes([
      { name: wishAuthor, text: newWish, time: "Just now" },
      ...wishes,
    ]);
    setNewWish("");
    setWishAuthor("");
  };

  return (
    <section id="funzone" className="py-24 px-4 bg-[#FFFDF9] relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4A5A5]/20 text-[#241B22] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Interactive Hub
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#241B22] font-light">
            Wedding Fun Zone
          </h2>
          <p className="text-base text-[#241B22]/70 font-light mt-3">
            Play couple's trivia, request reception party jams, and leave heartfelt wishes.
          </p>

          {/* Tab Switcher */}
          <div className="flex justify-center gap-2 sm:gap-4 mt-8">
            {[
              { id: "trivia", label: "Couple Trivia", icon: HelpCircle },
              { id: "jukebox", label: "DJ Jukebox", icon: Music },
              { id: "wishes", label: "Wishes Wall", icon: Heart },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#D4AF37] text-white shadow-lg scale-105"
                      : "bg-[#FDFBF7] border border-[#D4A5A5]/30 text-[#241B22]/75 hover:bg-[#D4A5A5]/20"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENT: TRIVIA */}
        {activeTab === "trivia" && (
          <div className="glass-card-gold p-6 sm:p-10 rounded-3xl border border-[#D4AF37]/30 max-w-2xl mx-auto shadow-xl">
            {!quizCompleted ? (
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-6">
                  <span>Question {currentQuestion + 1} of {triviaQuestions.length}</span>
                  <span>Score: {quizScore}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#241B22] mb-6">
                  {triviaQuestions[currentQuestion].question}
                </h3>

                <div className="space-y-3 mb-8">
                  {triviaQuestions[currentQuestion].options.map((opt, idx) => {
                    let btnStyle = "bg-white border-[#D4A5A5]/30 text-[#241B22] hover:border-[#D4AF37]";
                    if (selectedOption === idx) {
                      btnStyle = "bg-[#D4A5A5]/20 border-[#D4A5A5] text-[#241B22] font-semibold";
                    }
                    if (isAnswerSubmitted) {
                      if (idx === triviaQuestions[currentQuestion].answer) {
                        btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-900 font-bold";
                      } else if (selectedOption === idx) {
                        btnStyle = "bg-rose-100 border-rose-400 text-rose-800";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-4 rounded-2xl border text-sm transition-all duration-200 cursor-pointer ${btnStyle}`}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={submitAnswer}
                      disabled={selectedOption === null}
                      className="w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#B89326] transition-colors"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#241B22] text-white hover:bg-[#3D303A] transition-colors"
                    >
                      {currentQuestion < triviaQuestions.length - 1 ? "Next Question" : "See Final Score"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <Award className="w-16 h-16 text-[#D4AF37] mx-auto animate-bounce" />
                <h3 className="font-serif text-4xl font-bold text-[#241B22]">
                  Trivia Finished!
                </h3>
                <p className="text-lg text-[#241B22]/80">
                  You scored <strong className="text-[#D4AF37] font-bold text-2xl">{quizScore}</strong> out of {triviaQuestions.length}!
                </p>
                <p className="text-xs text-[#241B22]/60 italic max-w-md mx-auto">
                  {quizScore === triviaQuestions.length
                    ? "Wow! You are a certified Tobi & Amanda super-fan!"
                    : "Great effort! You know the couple quite well!"}
                </p>
                <button
                  onClick={resetQuiz}
                  className="mt-6 px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#D4AF37] text-white hover:bg-[#B89326] transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: JUKEBOX */}
        {activeTab === "jukebox" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-4xl mx-auto">
            <div className="md:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border border-[#D4A5A5]/40 shadow-lg">
              <h3 className="font-serif text-2xl font-semibold text-[#241B22] mb-2">
                Request a Song
              </h3>
              <p className="text-xs text-[#241B22]/70 mb-6">
                Tell our reception DJ what gets you on the dancefloor!
              </p>

              <form onSubmit={handleAddSong} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#241B22] uppercase tracking-wider mb-1">
                    Song Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="e.g. Calm Down"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4A5A5]/40 bg-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#241B22] uppercase tracking-wider mb-1">
                    Artist Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="e.g. Rema"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4A5A5]/40 bg-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-white hover:bg-[#B89326] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Music className="w-4 h-4" /> Submit Song
                </button>

                {songAddedNotice && (
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-medium text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Song added to DJ playlist!
                  </div>
                )}
              </form>
            </div>

            <div className="md:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-lg">
              <h3 className="font-serif text-2xl font-semibold text-[#241B22] mb-4">
                Requested Playlist ({songList.length})
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {songList.map((song, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#D4A5A5]/25 flex items-center justify-between shadow-xs hover:border-[#D4AF37] transition-colors"
                  >
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#241B22]">
                        {song.title}
                      </h4>
                      <p className="text-xs text-[#D4AF37] font-medium">{song.artist}</p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#241B22]/50 bg-[#D4A5A5]/15 px-2.5 py-1 rounded-full">
                      By {song.requestedBy}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: WISHES */}
        {activeTab === "wishes" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-4xl mx-auto">
            <div className="md:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border border-[#D4A5A5]/40 shadow-lg">
              <h3 className="font-serif text-2xl font-semibold text-[#241B22] mb-2">
                Leave a Blessing
              </h3>
              <p className="text-xs text-[#241B22]/70 mb-6">
                Share a note of advice, love, or prayer for Tobi & Amanda.
              </p>

              <form onSubmit={handleAddWish} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#241B22] uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={wishAuthor}
                    onChange={(e) => setWishAuthor(e.target.value)}
                    placeholder="e.g. Cousin Bolaji"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4A5A5]/40 bg-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#241B22] uppercase tracking-wider mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newWish}
                    onChange={(e) => setNewWish(e.target.value)}
                    placeholder="Write your wishes for the couple..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4A5A5]/40 bg-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-white hover:bg-[#B89326] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Post Wish
                </button>
              </form>
            </div>

            <div className="md:col-span-7 space-y-4 max-h-96 overflow-y-auto pr-1">
              {wishes.map((w, i) => (
                <div
                  key={i}
                  className="glass-card-gold p-5 rounded-2xl border border-[#D4AF37]/30 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-serif text-lg font-bold text-[#241B22] flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#D4A5A5] fill-[#D4A5A5]" />
                      {w.name}
                    </h4>
                    <span className="text-[10px] text-[#241B22]/50 uppercase font-semibold">
                      {w.time}
                    </span>
                  </div>
                  <p className="text-sm text-[#241B22]/85 font-light leading-relaxed">
                    "{w.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
