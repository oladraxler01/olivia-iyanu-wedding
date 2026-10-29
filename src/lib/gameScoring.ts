// ═════════════════════════════════════════════════════════════════════════
// UNIFIED WEDDING GAME SCORING ENGINE
// Single Source of Truth for both Public Frontend and Admin Dashboard
// ═════════════════════════════════════════════════════════════════════════

export type RawLeaderboardRow = {
  id: string | number;
  guest_name: string;
  game_type: string;
  score: number;
  created_at: string;
};

export type ParsedGameScore = {
  points: number;
  maxPoints: number;
  compositePoints: number;
  displayScore: string;
  unit: string;
  tieBreakerStr?: string;
  sortValue: number; // HIGHER IS ALWAYS BETTER
};

/**
 * Universal parser for any game score from the database
 */
export function parseScore(gameType: string, rawScore: number): ParsedGameScore {
  const scoreNum = Number(rawScore) || 0;

  if (gameType === "trivia") {
    // Trivia: rawScore is number of correct answers (0 - 10)
    const correct = Math.floor(scoreNum);
    return {
      points: correct,
      maxPoints: 10,
      compositePoints: correct * 10, // 10 pts per question, max 100
      displayScore: `${correct}/10`,
      unit: "correct",
      sortValue: scoreNum,
    };
  }

  if (gameType === "timeline") {
    // Timeline: 1 = completed, awards 50 points
    const completed = scoreNum > 0;
    return {
      points: completed ? 50 : 0,
      maxPoints: 50,
      compositePoints: completed ? 50 : 0,
      displayScore: completed ? "Completed" : "Not Finished",
      unit: "pts",
      sortValue: scoreNum,
    };
  }

  if (gameType === "memory" || gameType === "maze") {
    // Memory & Maze:
    // Game saves (basePoints * 1000) + tieBreaker (0-999 ms inverted)
    // basePoints is out of 100 based on moves and completion time.
    let points = 0;
    let tieBreakerMs = 0;

    if (scoreNum >= 1000) {
      points = Math.floor(scoreNum / 1000);
      tieBreakerMs = scoreNum % 1000;
    } else {
      // If score is under 1000, player had 0 base points and only tie-breaker remaining
      points = 0;
      tieBreakerMs = scoreNum;
    }

    const tieBreakerStr = tieBreakerMs > 0 ? `(tie-break: ${(tieBreakerMs / 1000).toFixed(3)})` : undefined;

    return {
      points,
      maxPoints: 100,
      compositePoints: points, // 0 - 100 pts
      displayScore: `${points}`,
      unit: "pts",
      tieBreakerStr,
      sortValue: scoreNum, // Higher is always better
    };
  }

  // Fallback for custom or unknown game types
  return {
    points: Math.floor(scoreNum),
    maxPoints: 100,
    compositePoints: Math.floor(scoreNum),
    displayScore: `${Math.floor(scoreNum)}`,
    unit: "pts",
    sortValue: scoreNum,
  };
}

export type PlayerRankingEntry = {
  id: string | number;
  guest_name: string;
  score: number; // raw DB score
  parsedScore: ParsedGameScore;
  game_type: string;
  created_at: string;
  rank: number;
};

export type PlayerProfile = {
  guest_name: string;
  displayName: string;
  totalScore: number;
  gamesPlayed: number;
  games: Set<string>;
  bestScores: Record<string, number>; // raw score matching DB
  bestScoreDetails: Record<
    string,
    {
      rawScore: number;
      parsed: ParsedGameScore;
      created_at: string;
      id: string | number;
    }
  >;
  rawEntries: RawLeaderboardRow[];
  firstPlayed: string;
  latestPlayed: string;
  overallRank: number;
};

/**
 * Computes exact unified rankings for all players & each individual game
 */
export function computeLeaderboards(entries: RawLeaderboardRow[]) {
  const playerMap: Record<string, PlayerProfile> = {};

  (entries || []).forEach((entry) => {
    if (!entry.guest_name) return;
    const key = entry.guest_name.trim().toLowerCase();
    if (!key) return;

    if (!playerMap[key]) {
      playerMap[key] = {
        guest_name: key,
        displayName: entry.guest_name.trim(),
        totalScore: 0,
        gamesPlayed: 0,
        games: new Set(),
        bestScores: {},
        bestScoreDetails: {},
        rawEntries: [],
        firstPlayed: entry.created_at,
        latestPlayed: entry.created_at,
        overallRank: 0,
      };
    }

    const prof = playerMap[key];
    prof.rawEntries.push(entry);

    if (entry.created_at) {
      if (!prof.firstPlayed || new Date(entry.created_at) < new Date(prof.firstPlayed)) {
        prof.firstPlayed = entry.created_at;
      }
      if (!prof.latestPlayed || new Date(entry.created_at) > new Date(prof.latestPlayed)) {
        prof.latestPlayed = entry.created_at;
      }
    }

    const gt = (entry.game_type || "").toLowerCase().trim();
    prof.games.add(gt);

    const parsed = parseScore(gt, entry.score);

    // Keep highest sortValue for each player per game
    if (!prof.bestScoreDetails[gt] || parsed.sortValue > prof.bestScoreDetails[gt].parsed.sortValue) {
      prof.bestScores[gt] = entry.score;
      prof.bestScoreDetails[gt] = {
        rawScore: entry.score,
        parsed,
        created_at: entry.created_at,
        id: entry.id,
      };
    }
  });

  // Calculate composite total scores
  Object.values(playerMap).forEach((prof) => {
    prof.gamesPlayed = prof.games.size;
    let sum = 0;
    Object.values(prof.bestScoreDetails).forEach((item) => {
      sum += item.parsed.compositePoints;
    });
    prof.totalScore = sum;
  });

  // Sort overall standings (Descending: highest composite total points first)
  const overallRankedList = Object.values(playerMap)
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      // Tie-breaker: games played, then earliest play
      if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
      return new Date(a.firstPlayed).getTime() - new Date(b.firstPlayed).getTime();
    })
    .map((p, idx) => ({
      ...p,
      overallRank: idx + 1,
    }));

  // Compute individual game rankings (Descending: highest sortValue = Rank 1)
  const computeGameRank = (gameType: string): PlayerRankingEntry[] => {
    const list: PlayerRankingEntry[] = [];

    Object.values(playerMap).forEach((prof) => {
      const best = prof.bestScoreDetails[gameType];
      if (best) {
        list.push({
          id: best.id,
          guest_name: prof.displayName,
          score: best.rawScore,
          parsedScore: best.parsed,
          game_type: gameType,
          created_at: best.created_at,
          rank: 0,
        });
      }
    });

    return list
      .sort((a, b) => {
        if (b.parsedScore.sortValue !== a.parsedScore.sortValue) {
          return b.parsedScore.sortValue - a.parsedScore.sortValue;
        }
        // Tie-breaker: earliest submission wins
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      })
      .map((item, idx) => ({
        ...item,
        rank: idx + 1,
      }));
  };

  return {
    playerProfiles: playerMap,
    overallRankedList,
    gameRankings: {
      trivia: computeGameRank("trivia"),
      memory: computeGameRank("memory"),
      timeline: computeGameRank("timeline"),
      maze: computeGameRank("maze"),
    },
  };
}
