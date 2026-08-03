"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  Lock,
  Users,
  ShoppingBag,
  Eye,
  Copy,
  Check,
  RefreshCcw,
  Search,
  Download,
  Phone,
  Mail,
  MapPin,
  FileText,
  ExternalLink,
  X,
  Package,
  Sparkles,
  MessageSquare,
  Scissors,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  Filter,
  Trophy,
  Gamepad2,
  Medal,
  Trash2,
  ChevronRight,
  Award,
  Zap,
  CheckCheck
} from "lucide-react";

// ─── TYPES ──────────────────────────────────────────────────────────
export type RSVP = {
  id: number;
  created_at: string;
  full_name: string;
  attending: boolean;
  guest_count: number;
  song_request: string;
};

export type AsoebiOrder = {
  id: number;
  created_at: string;
  full_name: string;
  phone: string;
  delivery_location: string;
  items: Record<string, any>;
  total_amount: number;
  proof_of_payment_url: string;
};

export type GuestMedia = {
  id: number;
  created_at: string;
  guest_name: string;
  media_url: string;
  media_type: string;
};

export type LeaderboardRow = {
  id: number;
  guest_name: string;
  game_type: string;
  score: number;
  created_at: string;
};

export type PlayerProfile = {
  guest_name: string;
  totalScore: number;
  gamesPlayed: number;
  games: Set<string>;
  bestScores: Record<string, number>;
  rawEntries: LeaderboardRow[];
  firstPlayed: string;
  latestPlayed: string;
  overallRank?: number;
};

// Item Catalog Definition with prices matching AsoebiPaymentForm
export const ASOEBI_CATALOG: Record<
  string,
  { id: string; name: string; shortName: string; price: number; category: "fabric" | "accessory" }
> = {
  ladies_3: {
    id: "ladies_3",
    name: "Aso-ebi fabric — Ladies (3 yards)",
    shortName: "Ladies (3 yds)",
    price: 24000,
    category: "fabric",
  },
  ladies_4: {
    id: "ladies_4",
    name: "Aso-ebi fabric — Ladies (4 yards)",
    shortName: "Ladies (4 yds)",
    price: 32000,
    category: "fabric",
  },
  ladies_5: {
    id: "ladies_5",
    name: "Aso-ebi fabric — Ladies (5 yards)",
    shortName: "Ladies (5 yds)",
    price: 40000,
    category: "fabric",
  },
  gele: {
    id: "gele",
    name: "Sego Gele (head wrap)",
    shortName: "Sego Gele",
    price: 9600,
    category: "accessory",
  },
  fila: {
    id: "fila",
    name: "Men's cap (fila)",
    shortName: "Men's Fila",
    price: 10000,
    category: "accessory",
  },
};

// Helper to parse RSVP contact & advice details
export function parseRSVPDetails(songRequest: string | null | undefined) {
  if (!songRequest) {
    return { email: "", phone: "", advice: "", notes: "", raw: "" };
  }

  const raw = songRequest.trim();
  let email = "";
  let phone = "";
  let advice = "";
  let notes = "";

  // Extract Email
  const emailMatch = raw.match(/Email:\s*([^|\n]+)/i);
  if (emailMatch && emailMatch[1] && emailMatch[1].trim() !== "N/A") {
    email = emailMatch[1].trim();
  }

  // Extract Phone
  const phoneMatch = raw.match(/Phone:\s*([^\n]+)/i);
  if (phoneMatch && phoneMatch[1] && phoneMatch[1].trim() !== "N/A") {
    phone = phoneMatch[1].trim();
  }

  // Extract Song / Advice
  const adviceMatch = raw.match(/Song:\s*([\s\S]*?)(?=\n\nNotes:|$)/i);
  if (adviceMatch && adviceMatch[1]) {
    advice = adviceMatch[1].trim();
  }

  // Extract Notes
  const notesMatch = raw.match(/Notes:\s*([\s\S]*)$/i);
  if (notesMatch && notesMatch[1]) {
    notes = notesMatch[1].trim();
  }

  // If none matched standard format, store raw content in advice/notes
  if (!email && !phone && !advice && !notes && raw) {
    advice = raw;
  }

  return { email, phone, advice, notes, raw };
}

// Helper to parse Asoebi itemized breakdown
export interface ItemizedLine {
  id: string;
  name: string;
  shortName: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  isCustom?: boolean;
}

export function parseAsoebiItems(rawItems: any): {
  lineItems: ItemizedLine[];
  filaMeasurement: string | null;
} {
  if (!rawItems) return { lineItems: [], filaMeasurement: null };

  let parsed: Record<string, any> = {};

  if (typeof rawItems === "object") {
    parsed = rawItems;
  } else if (typeof rawItems === "string") {
    try {
      parsed = JSON.parse(rawItems);
    } catch {
      return { lineItems: [], filaMeasurement: null };
    }
  }

  const lineItems: ItemizedLine[] = [];
  let filaMeasurement: string | null = null;

  Object.entries(parsed).forEach(([key, val]) => {
    if (key === "fila_measurement" || key === "filaMeasurement" || key === "cap_measurement") {
      if (val && typeof val === "string" && val.trim() !== "") {
        filaMeasurement = val.trim();
      }
      return;
    }

    if (key === "notes" || key === "comment") return;

    if (ASOEBI_CATALOG[key]) {
      const catalogItem = ASOEBI_CATALOG[key];
      const qty = typeof val === "number" ? val : parseInt(String(val || 0), 10);
      if (!isNaN(qty) && qty > 0) {
        lineItems.push({
          id: key,
          name: catalogItem.name,
          shortName: catalogItem.shortName,
          qty,
          unitPrice: catalogItem.price,
          subtotal: catalogItem.price * qty,
        });
      }
    } else {
      const qty = typeof val === "number" ? val : parseInt(String(val || 0), 10);
      if (!isNaN(qty) && qty > 0) {
        lineItems.push({
          id: key,
          name: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          shortName: key.replace(/_/g, " "),
          qty,
          unitPrice: 0,
          subtotal: 0,
          isCustom: true,
        });
      }
    }
  });

  return { lineItems, filaMeasurement };
}

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"asoebi" | "rsvps" | "games" | "media">("asoebi");

  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [asoebiOrders, setAsoebiOrders] = useState<AsoebiOrder[]>([]);
  const [guestMedia, setGuestMedia] = useState<GuestMedia[]>([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState<"all" | "yes" | "no">("all");
  const [asoebiItemFilter, setAsoebiItemFilter] = useState<string>("all");
  
  // Games Sub-Tab State
  const [gameSubTab, setGameSubTab] = useState<"overall" | "trivia" | "memory" | "timeline" | "maze" | "raw">("overall");
  const [gameFilter, setGameFilter] = useState<"all" | "completed_all" | "partial">("all");

  // Modals State
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AsoebiOrder | null>(null);
  const [selectedRSVP, setSelectedRSVP] = useState<RSVP | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Copy Feedback State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const triggerCopy = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "#LetsDoLifeTogether admin") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect passcode. Please try again.");
    }
  };

  // Data Fetching
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        { data: rsvpData, error: rsvpError },
        { data: asoebiData, error: asoebiError },
        { data: mediaData, error: mediaError },
        { data: gameData, error: gameError },
      ] = await Promise.all([
        supabase.from("rsvps").select("*").order("created_at", { ascending: false }),
        supabase.from("asoebi_orders").select("*").order("created_at", { ascending: false }),
        supabase.from("guest_media").select("*").order("created_at", { ascending: false }),
        supabase.from("leaderboards").select("*").order("created_at", { ascending: false }),
      ]);

      if (rsvpError) throw rsvpError;
      if (asoebiError) throw asoebiError;
      if (mediaError) throw mediaError;
      if (gameError) throw gameError;

      setRsvps(rsvpData || []);
      setAsoebiOrders(asoebiData || []);
      setGuestMedia(mediaData || []);
      setLeaderboardEntries(gameData || []);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to fetch data: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Derived Stats
  const totalAttending = useMemo(
    () => rsvps.filter((r) => r.attending === true).length,
    [rsvps]
  );
  const totalDeclining = useMemo(
    () => rsvps.filter((r) => r.attending === false).length,
    [rsvps]
  );
  const totalRevenue = useMemo(
    () => asoebiOrders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0),
    [asoebiOrders]
  );

  // Aggregate Inventory Counts
  const inventoryCounts = useMemo(() => {
    const counts = {
      ladies_3: 0,
      ladies_4: 0,
      ladies_5: 0,
      gele: 0,
      fila: 0,
      totalLadiesPieces: 0,
      totalFabricYards: 0,
      withFilaMeasurement: 0,
    };

    asoebiOrders.forEach((order) => {
      const { lineItems, filaMeasurement } = parseAsoebiItems(order.items);
      if (filaMeasurement) counts.withFilaMeasurement += 1;

      lineItems.forEach((item) => {
        if (item.id === "ladies_3") {
          counts.ladies_3 += item.qty;
          counts.totalLadiesPieces += item.qty;
          counts.totalFabricYards += item.qty * 3;
        } else if (item.id === "ladies_4") {
          counts.ladies_4 += item.qty;
          counts.totalLadiesPieces += item.qty;
          counts.totalFabricYards += item.qty * 4;
        } else if (item.id === "ladies_5") {
          counts.ladies_5 += item.qty;
          counts.totalLadiesPieces += item.qty;
          counts.totalFabricYards += item.qty * 5;
        } else if (item.id === "gele") {
          counts.gele += item.qty;
        } else if (item.id === "fila") {
          counts.fila += item.qty;
        }
      });
    });

    return counts;
  }, [asoebiOrders]);

  // ─── GAME AGGREGATIONS & RANKINGS ──────────────────────────────────
  const { playerProfiles, overallRankedList, gameRankings } = useMemo(() => {
    const map: Record<string, PlayerProfile> = {};

    leaderboardEntries.forEach((entry) => {
      const nameKey = entry.guest_name.trim().toLowerCase();
      if (!map[nameKey]) {
        map[nameKey] = {
          guest_name: entry.guest_name.trim(),
          totalScore: 0,
          gamesPlayed: 0,
          games: new Set(),
          bestScores: {},
          rawEntries: [],
          firstPlayed: entry.created_at,
          latestPlayed: entry.created_at,
        };
      }

      const prof = map[nameKey];
      prof.rawEntries.push(entry);
      if (new Date(entry.created_at) < new Date(prof.firstPlayed)) prof.firstPlayed = entry.created_at;
      if (new Date(entry.created_at) > new Date(prof.latestPlayed)) prof.latestPlayed = entry.created_at;

      const gt = entry.game_type;
      prof.games.add(gt);

      if (prof.bestScores[gt] === undefined) {
        prof.bestScores[gt] = entry.score;
      } else {
        const isAsc = gt === "memory" || gt === "maze";
        if (isAsc) {
          if (entry.score < prof.bestScores[gt]) prof.bestScores[gt] = entry.score;
        } else {
          if (entry.score > prof.bestScores[gt]) prof.bestScores[gt] = entry.score;
        }
      }
    });

    // Compute composite score for all players
    Object.values(map).forEach((prof) => {
      prof.gamesPlayed = prof.games.size;
      let sum = 0;
      Object.entries(prof.bestScores).forEach(([gt, best]) => {
        if (gt === "trivia") sum += Math.floor(best) * 10;
        else if (gt === "timeline") sum += 50;
        else if (gt === "memory") sum += Math.max(0, 100 - Math.floor(best) * 2);
        else if (gt === "maze") sum += Math.max(0, 100 - Math.floor(best) * 2);
      });
      prof.totalScore = sum;
    });

    // Sort Overall List
    const sortedOverall = Object.values(map)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((p, idx) => ({ ...p, overallRank: idx + 1 }));

    // Compute Individual Game Rankings (100% of participants for each game)
    const computeGameRank = (gameType: string, isAscending: boolean) => {
      const gameEntries = leaderboardEntries.filter((e) => e.game_type === gameType);
      const playerBest: Record<string, { guest_name: string; score: number; created_at: string; id: number }> = {};

      gameEntries.forEach((e) => {
        const key = e.guest_name.trim().toLowerCase();
        if (!playerBest[key]) {
          playerBest[key] = { guest_name: e.guest_name.trim(), score: e.score, created_at: e.created_at, id: e.id };
        } else {
          const curr = playerBest[key].score;
          if (isAscending ? e.score < curr : e.score > curr) {
            playerBest[key] = { guest_name: e.guest_name.trim(), score: e.score, created_at: e.created_at, id: e.id };
          }
        }
      });

      return Object.values(playerBest)
        .sort((a, b) => (isAscending ? a.score - b.score : b.score - a.score))
        .map((p, idx) => ({ ...p, rank: idx + 1 }));
    };

    return {
      playerProfiles: map,
      overallRankedList: sortedOverall,
      gameRankings: {
        trivia: computeGameRank("trivia", false),
        memory: computeGameRank("memory", true),
        timeline: computeGameRank("timeline", false),
        maze: computeGameRank("maze", true),
      },
    };
  }, [leaderboardEntries]);

  // Delete Score Record Handler
  const handleDeleteScore = async (id: number) => {
    setIsDeleting(true);
    try {
      const { error: delErr } = await supabase.from("leaderboards").delete().eq("id", id);
      if (delErr) throw delErr;
      setLeaderboardEntries((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert("Failed to delete score: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered RSVPs
  const filteredRSVPs = useMemo(() => {
    return rsvps.filter((rsvp) => {
      const matchesSearch =
        (rsvp.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rsvp.song_request || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        rsvpFilter === "all" ||
        (rsvpFilter === "yes" && rsvp.attending === true) ||
        (rsvpFilter === "no" && rsvp.attending === false);

      return matchesSearch && matchesStatus;
    });
  }, [rsvps, searchQuery, rsvpFilter]);

  // Filtered Aso-Ebi Orders
  const filteredAsoebiOrders = useMemo(() => {
    return asoebiOrders.filter((order) => {
      const matchesSearch =
        (order.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.delivery_location || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (asoebiItemFilter === "all") return matchesSearch;

      const { lineItems } = parseAsoebiItems(order.items);
      const hasItem = lineItems.some((item) => item.id === asoebiItemFilter);

      return matchesSearch && hasItem;
    });
  }, [asoebiOrders, searchQuery, asoebiItemFilter]);

  // Filtered Game Players (Overall)
  const filteredOverallPlayers = useMemo(() => {
    return overallRankedList.filter((p) => {
      const matchesSearch = p.guest_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCompletion =
        gameFilter === "all" ||
        (gameFilter === "completed_all" && p.gamesPlayed >= 4) ||
        (gameFilter === "partial" && p.gamesPlayed < 4);
      return matchesSearch && matchesCompletion;
    });
  }, [overallRankedList, searchQuery, gameFilter]);

  // CSV Export Generators
  const exportAsoebiCSV = () => {
    const headers = [
      "Order ID",
      "Date",
      "Full Name",
      "Phone",
      "Delivery Location",
      "Ladies 3yds Qty",
      "Ladies 4yds Qty",
      "Ladies 5yds Qty",
      "Sego Gele Qty",
      "Men's Fila Qty",
      "Cap Head Measurement",
      "Itemized Details",
      "Total Amount (NGN)",
      "Proof URL",
    ];

    const rows = filteredAsoebiOrders.map((order) => {
      const { lineItems, filaMeasurement } = parseAsoebiItems(order.items);
      const ladies3 = lineItems.find((i) => i.id === "ladies_3")?.qty || 0;
      const ladies4 = lineItems.find((i) => i.id === "ladies_4")?.qty || 0;
      const ladies5 = lineItems.find((i) => i.id === "ladies_5")?.qty || 0;
      const gele = lineItems.find((i) => i.id === "gele")?.qty || 0;
      const fila = lineItems.find((i) => i.id === "fila")?.qty || 0;
      const details = lineItems
        .map((i) => `${i.qty}x ${i.shortName} (@ N${i.unitPrice.toLocaleString()})`)
        .join("; ");

      return [
        order.id,
        new Date(order.created_at).toLocaleDateString(),
        `"${(order.full_name || "").replace(/"/g, '""')}"`,
        `"${(order.phone || "").replace(/"/g, '""')}"`,
        `"${(order.delivery_location || "").replace(/"/g, '""')}"`,
        ladies3,
        ladies4,
        ladies5,
        gele,
        fila,
        `"${(filaMeasurement || "").replace(/"/g, '""')}"`,
        `"${details.replace(/"/g, '""')}"`,
        order.total_amount,
        `"${order.proof_of_payment_url || ""}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `asoebi_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportRSVPCSV = () => {
    const headers = [
      "RSVP ID",
      "Date",
      "Full Name",
      "Attending",
      "Guest Count",
      "Email",
      "Phone",
      "Advice / Song Request",
      "Notes",
    ];

    const rows = filteredRSVPs.map((rsvp) => {
      const details = parseRSVPDetails(rsvp.song_request);
      return [
        rsvp.id,
        new Date(rsvp.created_at).toLocaleDateString(),
        `"${(rsvp.full_name || "").replace(/"/g, '""')}"`,
        rsvp.attending ? "Yes" : "No",
        rsvp.guest_count,
        `"${details.email.replace(/"/g, '""')}"`,
        `"${details.phone.replace(/"/g, '""')}"`,
        `"${details.advice.replace(/"/g, '""')}"`,
        `"${details.notes.replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wedding_rsvps_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportGamesCSV = () => {
    const headers = [
      "Overall Rank",
      "Player Name",
      "Total Composite Score",
      "Games Played Count",
      "Trivia Score",
      "Memory Moves",
      "Timeline Status",
      "Maze Moves",
      "First Active Date",
      "Latest Active Date",
    ];

    const rows = overallRankedList.map((p) => [
      p.overallRank,
      `"${p.guest_name.replace(/"/g, '""')}"`,
      p.totalScore,
      `${p.gamesPlayed}/4`,
      p.bestScores.trivia !== undefined ? Math.floor(p.bestScores.trivia) : "N/A",
      p.bestScores.memory !== undefined ? Math.floor(p.bestScores.memory) : "N/A",
      p.bestScores.timeline !== undefined ? "Completed" : "N/A",
      p.bestScores.maze !== undefined ? Math.floor(p.bestScores.maze) : "N/A",
      new Date(p.firstPlayed).toLocaleDateString(),
      new Date(p.latestPlayed).toLocaleDateString(),
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wedding_games_leaderboard_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportRawGamesCSV = () => {
    const headers = ["Score ID", "Date", "Player Name", "Game Type", "Raw Score"];
    const rows = leaderboardEntries.map((e) => [
      e.id,
      new Date(e.created_at).toLocaleString(),
      `"${e.guest_name.replace(/"/g, '""')}"`,
      e.game_type,
      e.score,
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `raw_game_scores_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── LOGIN SCREEN ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#E3D3DA] shadow-xl text-center">
          <div className="w-16 h-16 bg-[#0E5C52]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0E5C52]">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl text-[#241B22] mb-2">Admin Portal</h1>
          <p className="text-sm text-[#6B5A63] mb-6">
            Olivia & Iyanu Wedding Dashboard — Please enter the administrative passcode.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-4 py-3 border border-[#E3D3DA] rounded-xl text-center focus:outline-none focus:border-[#0E5C52] text-sm"
              />
            </div>
            {authError && <p className="text-xs text-red-500 font-medium">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-[#0E5C52] text-white rounded-xl text-sm font-semibold hover:bg-[#0E5C52]/90 transition-colors cursor-pointer"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD INTERFACE ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#241B22] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#E3D3DA] shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B23A6B]">
              Administrative Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#241B22]">
              Olivia & Iyanu — Operations Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#FDFBF7] border border-[#E3D3DA] rounded-xl text-xs font-semibold text-[#6B5A63] hover:text-[#0E5C52] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-[#EFE0E5] text-[#B23A6B] rounded-xl text-xs font-semibold hover:bg-[#B23A6B] hover:text-white transition-colors cursor-pointer"
            >
              Lock
            </button>
          </div>
        </div>

        {/* Global KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E3D3DA] shadow-sm">
            <div className="flex items-center justify-between text-[#6B5A63] mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Aso-Ebi Orders</span>
              <ShoppingBag className="w-4 h-4 text-[#0E5C52]" />
            </div>
            <p className="text-2xl font-bold text-[#0E5C52]">{asoebiOrders.length}</p>
            <p className="text-[11px] text-[#6B5A63] mt-1">
              ₦{totalRevenue.toLocaleString()} volume
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E3D3DA] shadow-sm">
            <div className="flex items-center justify-between text-[#6B5A63] mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">RSVP Guests</span>
              <Users className="w-4 h-4 text-[#B23A6B]" />
            </div>
            <p className="text-2xl font-bold text-[#241B22]">{rsvps.length}</p>
            <p className="text-[11px] text-[#6B5A63] mt-1">
              {totalAttending} Yes · {totalDeclining} No
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E3D3DA] shadow-sm">
            <div className="flex items-center justify-between text-[#6B5A63] mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Game Players</span>
              <Trophy className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{overallRankedList.length}</p>
            <p className="text-[11px] text-[#6B5A63] mt-1">
              {leaderboardEntries.length} total game plays
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E3D3DA] shadow-sm">
            <div className="flex items-center justify-between text-[#6B5A63] mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Ladies Fabric</span>
              <Scissors className="w-4 h-4 text-[#B23A6B]" />
            </div>
            <p className="text-2xl font-bold text-[#B23A6B]">
              {inventoryCounts.totalFabricYards}{" "}
              <span className="text-xs font-normal text-[#6B5A63]">yds</span>
            </p>
            <p className="text-[11px] text-[#6B5A63] mt-1">
              {inventoryCounts.totalLadiesPieces} total pieces
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E3D3DA] shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-[#6B5A63] mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Accessories</span>
              <Package className="w-4 h-4 text-[#0E5C52]" />
            </div>
            <div className="flex items-center gap-3">
              <div>
                <span className="text-lg font-bold text-[#0E5C52]">{inventoryCounts.gele}</span>
                <span className="text-[10px] text-[#6B5A63] ml-1">Gele</span>
              </div>
              <div className="w-[1px] h-6 bg-[#E3D3DA]" />
              <div>
                <span className="text-lg font-bold text-[#0E5C52]">{inventoryCounts.fila}</span>
                <span className="text-[10px] text-[#6B5A63] ml-1">Fila</span>
              </div>
            </div>
            <p className="text-[10px] text-[#6B5A63] mt-1">
              {inventoryCounts.withFilaMeasurement} head sizes provided
            </p>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3D3DA] pb-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => {
                setActiveTab("asoebi");
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "asoebi"
                  ? "bg-[#0E5C52] text-white shadow-sm"
                  : "bg-white text-[#6B5A63] hover:text-[#0E5C52] border border-[#E3D3DA]"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Aso-Ebi Orders ({asoebiOrders.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("rsvps");
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "rsvps"
                  ? "bg-[#0E5C52] text-white shadow-sm"
                  : "bg-white text-[#6B5A63] hover:text-[#0E5C52] border border-[#E3D3DA]"
              }`}
            >
              <Users className="w-4 h-4" />
              RSVPs ({rsvps.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("games");
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "games"
                  ? "bg-[#0E5C52] text-white shadow-sm"
                  : "bg-white text-[#6B5A63] hover:text-[#0E5C52] border border-[#E3D3DA]"
              }`}
            >
              <Trophy className="w-4 h-4 text-yellow-500" />
              Game Rankings ({overallRankedList.length} Players)
            </button>

            <button
              onClick={() => {
                setActiveTab("media");
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "media"
                  ? "bg-[#0E5C52] text-white shadow-sm"
                  : "bg-white text-[#6B5A63] hover:text-[#0E5C52] border border-[#E3D3DA]"
              }`}
            >
              <FileText className="w-4 h-4" />
              Guest Media ({guestMedia.length})
            </button>
          </div>

          {/* Tab Actions */}
          <div className="flex items-center gap-2">
            {activeTab === "asoebi" && (
              <button
                onClick={exportAsoebiCSV}
                className="flex items-center gap-2 px-4 py-2 bg-[#0E5C52] text-white rounded-xl text-xs font-semibold hover:bg-[#0E5C52]/90 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export Orders CSV
              </button>
            )}

            {activeTab === "rsvps" && (
              <button
                onClick={exportRSVPCSV}
                className="flex items-center gap-2 px-4 py-2 bg-[#0E5C52] text-white rounded-xl text-xs font-semibold hover:bg-[#0E5C52]/90 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export RSVPs CSV
              </button>
            )}

            {activeTab === "games" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={exportGamesCSV}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#0E5C52] text-white rounded-xl text-xs font-semibold hover:bg-[#0E5C52]/90 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Leaderboard CSV
                </button>
                <button
                  onClick={exportRawGamesCSV}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white text-[#6B5A63] border border-[#E3D3DA] rounded-xl text-xs font-semibold hover:text-[#0E5C52] shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Raw Logs CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E3D3DA] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#8C7A84]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "asoebi"
                  ? "Search by buyer name, phone, delivery address..."
                  : activeTab === "rsvps"
                  ? "Search by guest name, advice, notes..."
                  : activeTab === "games"
                  ? "Search player name across all game rankings..."
                  : "Search guest name..."
              }
              className="w-full text-xs sm:text-sm text-[#241B22] placeholder:text-[#8C7A84] focus:outline-none bg-transparent"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-[#B23A6B] hover:underline font-semibold cursor-pointer"
            >
              Clear Search
            </button>
          )}

          {/* Contextual Filters */}
          {activeTab === "asoebi" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B5A63] font-medium flex items-center gap-1">
                <Filter className="w-3 h-3" /> Item:
              </span>
              <select
                value={asoebiItemFilter}
                onChange={(e) => setAsoebiItemFilter(e.target.value)}
                className="text-xs bg-[#FDFBF7] border border-[#E3D3DA] rounded-lg px-2.5 py-1.5 text-[#241B22] focus:outline-none"
              >
                <option value="all">All Items</option>
                <option value="ladies_3">Ladies (3 yds)</option>
                <option value="ladies_4">Ladies (4 yds)</option>
                <option value="ladies_5">Ladies (5 yds)</option>
                <option value="gele">Sego Gele</option>
                <option value="fila">Men's Fila</option>
              </select>
            </div>
          )}

          {activeTab === "rsvps" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B5A63] font-medium flex items-center gap-1">
                <Filter className="w-3 h-3" /> Attendance:
              </span>
              <select
                value={rsvpFilter}
                onChange={(e) => setRsvpFilter(e.target.value as any)}
                className="text-xs bg-[#FDFBF7] border border-[#E3D3DA] rounded-lg px-2.5 py-1.5 text-[#241B22] focus:outline-none"
              >
                <option value="all">All ({rsvps.length})</option>
                <option value="yes">Attending ({totalAttending})</option>
                <option value="no">Declined ({totalDeclining})</option>
              </select>
            </div>
          )}

          {activeTab === "games" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B5A63] font-medium flex items-center gap-1">
                <Filter className="w-3 h-3" /> Completion:
              </span>
              <select
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value as any)}
                className="text-xs bg-[#FDFBF7] border border-[#E3D3DA] rounded-lg px-2.5 py-1.5 text-[#241B22] focus:outline-none"
              >
                <option value="all">All Players ({overallRankedList.length})</option>
                <option value="completed_all">Completed All 4 Games</option>
                <option value="partial">Played 1-3 Games</option>
              </select>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            TAB 1: ASO-EBI ORDERS (COMPLETE ITEMIZED BREAKDOWN)
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === "asoebi" && (
          <div className="space-y-4">
            {/* Inventory Aggregation Pills */}
            <div className="bg-[#EFE0E5]/50 border border-[#E3D3DA] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B5A63]">
              <div className="font-semibold text-[#241B22] flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-[#B23A6B]" />
                Inventory Breakdown:
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-white rounded-lg border border-[#E3D3DA]">
                  <strong>Ladies 3yd:</strong> {inventoryCounts.ladies_3} pcs (
                  {inventoryCounts.ladies_3 * 3} yds)
                </span>
                <span className="px-3 py-1 bg-white rounded-lg border border-[#E3D3DA]">
                  <strong>Ladies 4yd:</strong> {inventoryCounts.ladies_4} pcs (
                  {inventoryCounts.ladies_4 * 4} yds)
                </span>
                <span className="px-3 py-1 bg-white rounded-lg border border-[#E3D3DA]">
                  <strong>Ladies 5yd:</strong> {inventoryCounts.ladies_5} pcs (
                  {inventoryCounts.ladies_5 * 5} yds)
                </span>
                <span className="px-3 py-1 bg-white rounded-lg border border-[#E3D3DA]">
                  <strong>Sego Gele:</strong> {inventoryCounts.gele} pcs
                </span>
                <span className="px-3 py-1 bg-white rounded-lg border border-[#E3D3DA]">
                  <strong>Men's Fila:</strong> {inventoryCounts.fila} pcs
                </span>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-[#E3D3DA] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FDFBF7] text-[#6B5A63] uppercase text-[10px] sm:text-xs font-bold tracking-wider border-b border-[#E3D3DA]">
                    <tr>
                      <th className="py-4 px-4 sm:px-6">Customer & Phone</th>
                      <th className="py-4 px-4">Itemized Purchases & Prices</th>
                      <th className="py-4 px-4">Total Amount</th>
                      <th className="py-4 px-4">Delivery Location</th>
                      <th className="py-4 px-4 text-center">Payment Proof</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3E7EB]">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#6B5A63]">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0E5C52]" />
                          Loading orders...
                        </td>
                      </tr>
                    ) : filteredAsoebiOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#6B5A63]">
                          No Aso-Ebi orders found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredAsoebiOrders.map((order) => {
                        const { lineItems, filaMeasurement } = parseAsoebiItems(order.items);
                        const cleanPhone = (order.phone || "").replace(/\D/g, "");

                        return (
                          <tr
                            key={order.id}
                            className="hover:bg-[#FDFBF7]/80 transition-colors align-top"
                          >
                            {/* Buyer Name & Contact */}
                            <td className="py-4 px-4 sm:px-6">
                              <div className="font-bold text-[#241B22] text-sm sm:text-base">
                                {order.full_name || "Anonymous Buyer"}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <a
                                  href={`tel:${cleanPhone}`}
                                  className="text-xs text-[#0E5C52] hover:underline font-mono flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  {order.phone || "No phone"}
                                </a>
                                {order.phone && (
                                  <button
                                    onClick={() =>
                                      triggerCopy(order.phone, `phone-${order.id}`)
                                    }
                                    title="Copy phone number"
                                    className="text-[#8C7A84] hover:text-[#0E5C52] cursor-pointer"
                                  >
                                    {copiedId === `phone-${order.id}` ? (
                                      <Check className="w-3 h-3 text-green-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                )}
                              </div>
                              {order.phone && (
                                <a
                                  href={`https://wa.me/${cleanPhone.startsWith("0") ? "234" + cleanPhone.slice(1) : cleanPhone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 mt-1 text-[11px] text-green-700 hover:underline"
                                >
                                  <span>WhatsApp</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              <div className="text-[10px] text-[#8C7A84] mt-1.5 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(order.created_at).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>

                            {/* Itemized Breakdown Table */}
                            <td className="py-4 px-4 min-w-[280px]">
                              {lineItems.length === 0 ? (
                                <span className="text-xs text-[#8C7A84] italic">
                                  No items specified
                                </span>
                              ) : (
                                <div className="space-y-1.5">
                                  {lineItems.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-xs bg-[#FDFBF7] p-1.5 px-2.5 rounded-lg border border-[#E3D3DA]/60"
                                    >
                                      <span className="font-medium text-[#241B22]">
                                        <span className="font-bold text-[#0E5C52]">
                                          {item.qty}x
                                        </span>{" "}
                                        {item.name}
                                      </span>
                                      <span className="font-mono text-[#6B5A63] text-[11px]">
                                        {item.unitPrice > 0
                                          ? `₦${(item.unitPrice * item.qty).toLocaleString()} (₦${item.unitPrice.toLocaleString()}/ea)`
                                          : ""}
                                      </span>
                                    </div>
                                  ))}

                                  {/* Head measurement badge for fila */}
                                  {filaMeasurement && (
                                    <div className="inline-flex items-center gap-1 text-[11px] bg-[#0E5C52]/10 text-[#0E5C52] px-2 py-0.5 rounded-md font-medium mt-1">
                                      <span>Cap Head Size:</span>
                                      <strong>{filaMeasurement}</strong>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Sum Total */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="inline-block px-3 py-1 bg-[#0E5C52]/10 text-[#0E5C52] rounded-full font-bold text-sm sm:text-base">
                                ₦{Number(order.total_amount || 0).toLocaleString()}
                              </span>
                            </td>

                            {/* Full Delivery Location */}
                            <td className="py-4 px-4 max-w-[260px]">
                              <div className="flex items-start gap-1 text-xs text-[#241B22] leading-relaxed">
                                <MapPin className="w-3.5 h-3.5 text-[#B23A6B] flex-shrink-0 mt-0.5" />
                                <span className="break-words">
                                  {order.delivery_location || "Pickup / Not specified"}
                                </span>
                              </div>
                              {order.delivery_location && (
                                <button
                                  onClick={() =>
                                    triggerCopy(order.delivery_location, `addr-${order.id}`)
                                  }
                                  className="text-[11px] text-[#6B5A63] hover:text-[#0E5C52] inline-flex items-center gap-1 mt-1 font-medium cursor-pointer"
                                >
                                  {copiedId === `addr-${order.id}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-green-600" /> Copied Address
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" /> Copy Address
                                    </>
                                  )}
                                </button>
                              )}
                            </td>

                            {/* Payment Proof */}
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              {order.proof_of_payment_url ? (
                                <div className="flex flex-col items-center gap-1">
                                  <button
                                    onClick={() =>
                                      setSelectedProofUrl(order.proof_of_payment_url)
                                    }
                                    className="group relative w-12 h-12 rounded-xl overflow-hidden border border-[#E3D3DA] shadow-xs cursor-pointer"
                                  >
                                    <img
                                      src={order.proof_of_payment_url}
                                      alt="Proof"
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                      <Eye className="w-4 h-4" />
                                    </div>
                                  </button>
                                  <button
                                    onClick={() =>
                                      setSelectedProofUrl(order.proof_of_payment_url)
                                    }
                                    className="text-[11px] font-semibold text-[#0E5C52] hover:underline cursor-pointer"
                                  >
                                    Inspect Receipt
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-[#8C7A84] italic">
                                  No proof uploaded
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1.5 bg-[#FDFBF7] hover:bg-[#0E5C52] text-[#6B5A63] hover:text-white border border-[#E3D3DA] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                              >
                                View Invoice
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TAB 2: RSVPS (GUEST DETAILS, ADVICE & NOTES)
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === "rsvps" && (
          <div className="bg-white rounded-3xl border border-[#E3D3DA] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FDFBF7] text-[#6B5A63] uppercase text-[10px] sm:text-xs font-bold tracking-wider border-b border-[#E3D3DA]">
                  <tr>
                    <th className="py-4 px-4 sm:px-6">Guest Name & Count</th>
                    <th className="py-4 px-4">Attendance</th>
                    <th className="py-4 px-4">Contact Details</th>
                    <th className="py-4 px-4">Advice / Song Request</th>
                    <th className="py-4 px-4">Dietary & Notes</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3E7EB]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#6B5A63]">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0E5C52]" />
                        Loading RSVPs...
                      </td>
                    </tr>
                  ) : filteredRSVPs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#6B5A63]">
                        No RSVPs found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredRSVPs.map((rsvp) => {
                      const details = parseRSVPDetails(rsvp.song_request);

                      return (
                        <tr
                          key={rsvp.id}
                          className="hover:bg-[#FDFBF7]/80 transition-colors align-top"
                        >
                          {/* Name & Count */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="font-bold text-[#241B22] text-sm sm:text-base">
                              {rsvp.full_name || "Anonymous Guest"}
                            </div>
                            <div className="text-xs text-[#6B5A63] mt-0.5">
                              Party Size:{" "}
                              <strong className="text-[#0E5C52]">
                                {rsvp.guest_count} {rsvp.guest_count === 1 ? "guest" : "guests"}
                              </strong>
                            </div>
                            <div className="text-[10px] text-[#8C7A84] mt-1 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(rsvp.created_at).toLocaleDateString()}
                            </div>
                          </td>

                          {/* Attendance Badge */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {rsvp.attending ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Joyfully Accept
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                <XCircle className="w-3.5 h-3.5" /> Regretfully Decline
                              </span>
                            )}
                          </td>

                          {/* Contact Info */}
                          <td className="py-4 px-4 min-w-[200px]">
                            {details.email && (
                              <div className="flex items-center gap-1.5 text-xs text-[#241B22]">
                                <Mail className="w-3 h-3 text-[#0E5C52] flex-shrink-0" />
                                <a
                                  href={`mailto:${details.email}`}
                                  className="hover:underline truncate"
                                >
                                  {details.email}
                                </a>
                              </div>
                            )}
                            {details.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-[#0E5C52] font-mono mt-1">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                <a href={`tel:${details.phone}`} className="hover:underline">
                                  {details.phone}
                                </a>
                              </div>
                            )}
                            {!details.email && !details.phone && (
                              <span className="text-xs text-[#8C7A84] italic">Not provided</span>
                            )}
                          </td>

                          {/* Advice / Song */}
                          <td className="py-4 px-4 max-w-[250px]">
                            {details.advice ? (
                              <div className="text-xs text-[#241B22] bg-[#FDFBF7] p-2 rounded-xl border border-[#E3D3DA]/60 line-clamp-3">
                                {details.advice}
                              </div>
                            ) : (
                              <span className="text-xs text-[#8C7A84] italic">—</span>
                            )}
                          </td>

                          {/* Notes */}
                          <td className="py-4 px-4 max-w-[200px]">
                            {details.notes ? (
                              <div className="text-xs text-[#6B5A63] bg-[#EFE0E5]/30 p-2 rounded-xl border border-[#E3D3DA]/60 line-clamp-3">
                                {details.notes}
                              </div>
                            ) : (
                              <span className="text-xs text-[#8C7A84] italic">—</span>
                            )}
                          </td>

                          {/* Action */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedRSVP(rsvp)}
                              className="px-3 py-1.5 bg-[#FDFBF7] hover:bg-[#0E5C52] text-[#6B5A63] hover:text-white border border-[#E3D3DA] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                            >
                              View Full RSVP
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TAB 3: GAME RANKINGS (ALL PLAYERS, ALL GAMES & INDIVIDUAL)
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === "games" && (
          <div className="space-y-6">
            {/* Game Sub-View Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E3D3DA]">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: "overall", label: "🏆 Overall Composite Standings", count: overallRankedList.length },
                  { id: "trivia", label: "❓ Couple Trivia", count: gameRankings.trivia.length },
                  { id: "memory", label: "🃏 Memory Match", count: gameRankings.memory.length },
                  { id: "timeline", label: "⏳ Our Timeline", count: gameRankings.timeline.length },
                  { id: "maze", label: "🌀 Find the Bride (Maze)", count: gameRankings.maze.length },
                  { id: "raw", label: "📋 All Raw Logs", count: leaderboardEntries.length },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setGameSubTab(st.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      gameSubTab === st.id
                        ? "bg-[#0E5C52] text-white shadow-xs"
                        : "bg-[#FDFBF7] text-[#6B5A63] hover:bg-white hover:text-[#0E5C52] border border-[#E3D3DA]/60"
                    }`}
                  >
                    {st.label} ({st.count})
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-[#6B5A63] font-medium">
                Showing <strong>100%</strong> of participants (no 10-player cutoff)
              </div>
            </div>

            {/* SUB-VIEW 1: OVERALL COMPOSITE STANDINGS */}
            {gameSubTab === "overall" && (
              <div className="bg-white rounded-3xl border border-[#E3D3DA] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FDFBF7] text-[#6B5A63] uppercase text-[10px] sm:text-xs font-bold tracking-wider border-b border-[#E3D3DA]">
                      <tr>
                        <th className="py-4 px-4 sm:px-6 text-center w-16">Rank</th>
                        <th className="py-4 px-4">Player Name</th>
                        <th className="py-4 px-4 text-center">Total Points</th>
                        <th className="py-4 px-4 text-center">Games Completed</th>
                        <th className="py-4 px-4">Breakdown by Game</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3E7EB]">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[#6B5A63]">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0E5C52]" />
                            Loading game records...
                          </td>
                        </tr>
                      ) : filteredOverallPlayers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[#6B5A63]">
                            No players found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOverallPlayers.map((player) => (
                          <tr
                            key={player.guest_name}
                            className="hover:bg-[#FDFBF7]/80 transition-colors align-middle"
                          >
                            {/* Rank Badge */}
                            <td className="py-4 px-4 sm:px-6 text-center">
                              {player.overallRank === 1 ? (
                                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-100 text-yellow-700 font-bold">
                                  <Medal className="w-4 h-4" />
                                </div>
                              ) : player.overallRank === 2 ? (
                                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-700 font-bold">
                                  <Medal className="w-4 h-4" />
                                </div>
                              ) : player.overallRank === 3 ? (
                                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold">
                                  <Medal className="w-4 h-4" />
                                </div>
                              ) : (
                                <span className="font-bold text-xs text-[#6B5A63]">
                                  #{player.overallRank}
                                </span>
                              )}
                            </td>

                            {/* Player Name & First/Last Active */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-[#241B22] text-sm sm:text-base">
                                {player.guest_name}
                              </div>
                              <div className="text-[10px] text-[#8C7A84] mt-0.5">
                                Active: {new Date(player.latestPlayed).toLocaleDateString()}
                              </div>
                            </td>

                            {/* Total Points */}
                            <td className="py-4 px-4 text-center">
                              <span className="inline-block px-3 py-1 bg-[#0E5C52]/10 text-[#0E5C52] rounded-full font-bold text-sm sm:text-base">
                                {player.totalScore}{" "}
                                <span className="text-[10px] font-normal text-[#6B5A63]">pts</span>
                              </span>
                            </td>

                            {/* Games Played */}
                            <td className="py-4 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                  player.gamesPlayed >= 4
                                    ? "bg-green-100 text-green-800"
                                    : player.gamesPlayed >= 2
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {player.gamesPlayed >= 4 && <CheckCheck className="w-3 h-3" />}
                                {player.gamesPlayed} of 4 Played
                              </span>
                            </td>

                            {/* Game Breakdown Chips */}
                            <td className="py-4 px-4">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                    player.bestScores.trivia !== undefined
                                      ? "bg-[#0E5C52]/10 text-[#0E5C52]"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  Trivia:{" "}
                                  {player.bestScores.trivia !== undefined
                                    ? `${Math.floor(player.bestScores.trivia)}/5`
                                    : "—"}
                                </span>

                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                    player.bestScores.memory !== undefined
                                      ? "bg-[#0E5C52]/10 text-[#0E5C52]"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  Memory:{" "}
                                  {player.bestScores.memory !== undefined
                                    ? `${Math.floor(player.bestScores.memory)} mv`
                                    : "—"}
                                </span>

                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                    player.bestScores.timeline !== undefined
                                      ? "bg-[#0E5C52]/10 text-[#0E5C52]"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  Timeline:{" "}
                                  {player.bestScores.timeline !== undefined ? "Done" : "—"}
                                </span>

                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                    player.bestScores.maze !== undefined
                                      ? "bg-[#0E5C52]/10 text-[#0E5C52]"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  Maze:{" "}
                                  {player.bestScores.maze !== undefined
                                    ? `${Math.floor(player.bestScores.maze)} mv`
                                    : "—"}
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => setSelectedPlayer(player)}
                                className="px-3 py-1.5 bg-[#FDFBF7] hover:bg-[#0E5C52] text-[#6B5A63] hover:text-white border border-[#E3D3DA] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                              >
                                View Scorecard
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: INDIVIDUAL GAME RANKINGS (TRIVIA / MEMORY / TIMELINE / MAZE) */}
            {gameSubTab !== "overall" && gameSubTab !== "raw" && (
              <div className="bg-white rounded-3xl border border-[#E3D3DA] shadow-sm overflow-hidden">
                <div className="p-4 bg-[#FDFBF7] border-b border-[#E3D3DA] flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#241B22]">
                    {gameSubTab === "trivia" && "❓ Couple Trivia — Complete Player Rankings"}
                    {gameSubTab === "memory" && "🃏 Memory Match — Complete Player Rankings (Fewest Moves)"}
                    {gameSubTab === "timeline" && "⏳ Our Timeline — Complete Player Rankings"}
                    {gameSubTab === "maze" && "🌀 Find the Bride (Maze) — Complete Player Rankings (Fewest Moves)"}
                  </h3>
                  <span className="text-xs text-[#6B5A63]">
                    {gameRankings[gameSubTab].length} players participated
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FDFBF7] text-[#6B5A63] uppercase text-[10px] sm:text-xs font-bold tracking-wider border-b border-[#E3D3DA]">
                      <tr>
                        <th className="py-4 px-4 sm:px-6 text-center w-16">Rank</th>
                        <th className="py-4 px-4">Player Name</th>
                        <th className="py-4 px-4 text-right">
                          {gameSubTab === "trivia"
                            ? "Correct Answers / Score"
                            : gameSubTab === "memory" || gameSubTab === "maze"
                            ? "Moves Taken"
                            : "Status"}
                        </th>
                        <th className="py-4 px-4 text-center">Time / Speed</th>
                        <th className="py-4 px-4 text-right">Date Played</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3E7EB]">
                      {gameRankings[gameSubTab].length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[#6B5A63]">
                            No players have submitted scores for this game yet.
                          </td>
                        </tr>
                      ) : (
                        gameRankings[gameSubTab].map((p) => {
                          const isTimed = gameSubTab === "memory" || gameSubTab === "maze";
                          const isTrivia = gameSubTab === "trivia";
                          const rawScore = isTimed || isTrivia ? Math.floor(p.score) : p.score;

                          let timeStr = "—";
                          if (isTrivia) {
                            const timeFrac = p.score - rawScore;
                            if (timeFrac > 0 && timeFrac < 1) {
                              timeStr = `${(1 / timeFrac).toFixed(1)}s`;
                            }
                          } else if (isTimed) {
                            const timeFrac = p.score - rawScore;
                            if (timeFrac > 0) {
                              const ms = timeFrac * 1000000;
                              timeStr = `${(ms / 1000).toFixed(1)}s`;
                            }
                          }

                          const playerProf = playerProfiles[p.guest_name.toLowerCase()];

                          return (
                            <tr
                              key={p.guest_name}
                              className="hover:bg-[#FDFBF7]/80 transition-colors"
                            >
                              <td className="py-4 px-4 sm:px-6 text-center">
                                {p.rank === 1 ? (
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-100 text-yellow-700 font-bold">
                                    🥇
                                  </span>
                                ) : p.rank === 2 ? (
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-700 font-bold">
                                    🥈
                                  </span>
                                ) : p.rank === 3 ? (
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold">
                                    🥉
                                  </span>
                                ) : (
                                  <span className="font-bold text-xs text-[#6B5A63]">
                                    #{p.rank}
                                  </span>
                                )}
                              </td>

                              <td className="py-4 px-4">
                                <span className="font-bold text-[#241B22] text-sm">
                                  {p.guest_name}
                                </span>
                              </td>

                              <td className="py-4 px-4 text-right">
                                <span className="font-bold text-[#0E5C52] text-sm sm:text-base">
                                  {rawScore}{" "}
                                  <span className="text-[10px] font-normal text-[#6B5A63]">
                                    {gameSubTab === "trivia"
                                      ? "/ 5 correct"
                                      : gameSubTab === "memory" || gameSubTab === "maze"
                                      ? "moves"
                                      : "pts"}
                                  </span>
                                </span>
                              </td>

                              <td className="py-4 px-4 text-center font-mono text-xs text-[#6B5A63]">
                                {timeStr}
                              </td>

                              <td className="py-4 px-4 text-right text-xs text-[#8C7A84]">
                                {new Date(p.created_at).toLocaleDateString()}
                              </td>

                              <td className="py-4 px-4 text-right">
                                {playerProf && (
                                  <button
                                    onClick={() => setSelectedPlayer(playerProf)}
                                    className="px-3 py-1 bg-[#FDFBF7] hover:bg-[#0E5C52] text-[#6B5A63] hover:text-white border border-[#E3D3DA] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                  >
                                    Profile
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: RAW DATABASE LOGS */}
            {gameSubTab === "raw" && (
              <div className="bg-white rounded-3xl border border-[#E3D3DA] shadow-sm overflow-hidden">
                <div className="p-4 bg-[#FDFBF7] border-b border-[#E3D3DA] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#241B22]">
                      Database Submissions Log (`leaderboards`)
                    </h3>
                    <p className="text-xs text-[#6B5A63]">
                      Every score row stored in Supabase with exact ID and timestamp.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#0E5C52]">
                    {leaderboardEntries.length} Total Submissions
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FDFBF7] text-[#6B5A63] uppercase text-[10px] sm:text-xs font-bold tracking-wider border-b border-[#E3D3DA]">
                      <tr>
                        <th className="py-4 px-4 sm:px-6">Entry ID</th>
                        <th className="py-4 px-4">Player Name</th>
                        <th className="py-4 px-4">Game</th>
                        <th className="py-4 px-4">Score Value</th>
                        <th className="py-4 px-4">Timestamp</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3E7EB]">
                      {leaderboardEntries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[#6B5A63]">
                            No raw score logs found.
                          </td>
                        </tr>
                      ) : (
                        leaderboardEntries.map((e) => (
                          <tr key={e.id} className="hover:bg-[#FDFBF7]/80 transition-colors">
                            <td className="py-4 px-4 sm:px-6 font-mono text-xs text-[#8C7A84]">
                              #{e.id}
                            </td>
                            <td className="py-4 px-4 font-bold text-[#241B22]">
                              {e.guest_name}
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EFE0E5] text-[#B23A6B]">
                                {e.game_type}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-mono font-bold text-[#0E5C52]">
                              {e.score}
                            </td>
                            <td className="py-4 px-4 text-xs text-[#8C7A84]">
                              {new Date(e.created_at).toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => setDeleteConfirmId(e.id)}
                                title="Delete entry"
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TAB 4: GUEST MEDIA
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === "media" && (
          <div className="bg-white rounded-3xl border border-[#E3D3DA] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#241B22] mb-4">
              Guest Uploads ({guestMedia.length})
            </h2>
            {guestMedia.length === 0 ? (
              <p className="text-sm text-[#6B5A63] text-center py-12">
                No guest photos or videos uploaded yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {guestMedia.map((m) => (
                  <div
                    key={m.id}
                    className="relative group rounded-2xl overflow-hidden border border-[#E3D3DA] aspect-square bg-black/5"
                  >
                    <img
                      src={m.media_url}
                      alt={m.guest_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-white text-[10px]">
                      <span className="font-bold truncate">{m.guest_name}</span>
                      <span className="text-white/80">
                        {new Date(m.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: PROOF OF PAYMENT LIGHTBOX
      ───────────────────────────────────────────────────────────── */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3D3DA]">
              <h3 className="font-serif text-lg font-bold text-[#241B22]">
                Proof of Payment Receipt
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={selectedProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-[#0E5C52] hover:bg-[#0E5C52]/10 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setSelectedProofUrl(null)}
                  className="p-1.5 text-[#6B5A63] hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="max-h-[75vh] overflow-y-auto flex items-center justify-center p-2 mt-2 bg-[#FDFBF7] rounded-2xl">
              <img
                src={selectedProofUrl}
                alt="Full Payment Proof"
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: ASO-EBI ORDER INVOICE DETAILS
      ───────────────────────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden border border-[#E3D3DA] shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3D3DA] mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B23A6B]">
                  Official Order Receipt
                </span>
                <h3 className="font-serif text-xl font-bold text-[#241B22]">
                  Order #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-[#6B5A63] hover:text-red-500 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Buyer Info */}
              <div className="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#E3D3DA] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#6B5A63]">Customer:</span>
                  <span className="font-bold text-[#241B22]">{selectedOrder.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5A63]">Phone:</span>
                  <span className="font-mono text-[#0E5C52] font-semibold">
                    {selectedOrder.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5A63]">Delivery:</span>
                  <span className="font-medium text-[#241B22] text-right max-w-[200px]">
                    {selectedOrder.delivery_location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5A63]">Date:</span>
                  <span>{new Date(selectedOrder.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#6B5A63] mb-2">
                  Purchased Items
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const { lineItems, filaMeasurement } = parseAsoebiItems(selectedOrder.items);
                    return (
                      <>
                        {lineItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E3D3DA]"
                          >
                            <div>
                              <span className="font-bold text-[#0E5C52]">{item.qty}x</span>{" "}
                              <span className="font-medium text-[#241B22]">{item.name}</span>
                              {item.unitPrice > 0 && (
                                <span className="block text-[10px] text-[#8C7A84]">
                                  ₦{item.unitPrice.toLocaleString()} each
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-[#241B22]">
                              ₦{(item.unitPrice * item.qty).toLocaleString()}
                            </span>
                          </div>
                        ))}

                        {filaMeasurement && (
                          <div className="p-2.5 bg-[#0E5C52]/10 rounded-xl text-[#0E5C52] font-medium text-xs">
                            Cap Head Measurement: <strong>{filaMeasurement}</strong>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-3.5 bg-[#0E5C52] text-white rounded-2xl font-bold">
                <span>Sum Total Amount</span>
                <span className="text-base">
                  ₦{Number(selectedOrder.total_amount || 0).toLocaleString()}
                </span>
              </div>

              {/* Proof Image in modal */}
              {selectedOrder.proof_of_payment_url && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#6B5A63] mb-2">
                    Payment Receipt
                  </h4>
                  <img
                    src={selectedOrder.proof_of_payment_url}
                    alt="Receipt"
                    className="w-full max-h-48 object-contain rounded-xl border border-[#E3D3DA] bg-[#FDFBF7]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 3: RSVP FULL INSPECTION
      ───────────────────────────────────────────────────────────── */}
      {selectedRSVP && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden border border-[#E3D3DA] shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3D3DA] mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B23A6B]">
                  Guest Response
                </span>
                <h3 className="font-serif text-xl font-bold text-[#241B22]">
                  {selectedRSVP.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRSVP(null)}
                className="p-1.5 text-[#6B5A63] hover:text-red-500 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#E3D3DA]">
                <span className="text-[#6B5A63]">Attendance:</span>
                {selectedRSVP.attending ? (
                  <span className="font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    ✓ Joyfully Attending ({selectedRSVP.guest_count}{" "}
                    {selectedRSVP.guest_count === 1 ? "Guest" : "Guests"})
                  </span>
                ) : (
                  <span className="font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                    ✕ Regretfully Declining
                  </span>
                )}
              </div>

              {(() => {
                const details = parseRSVPDetails(selectedRSVP.song_request);
                return (
                  <div className="space-y-3">
                    <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E3D3DA] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#6B5A63]">Email:</span>
                        <span className="font-semibold text-[#241B22]">
                          {details.email || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B5A63]">Phone:</span>
                        <span className="font-mono font-semibold text-[#0E5C52]">
                          {details.phone || "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#6B5A63] mb-1">
                        Advice & Song Request:
                      </h4>
                      <p className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E3D3DA] text-[#241B22] leading-relaxed">
                        {details.advice || "No advice/song provided"}
                      </p>
                    </div>

                    {details.notes && (
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#6B5A63] mb-1">
                          Dietary / Special Notes:
                        </h4>
                        <p className="p-3 bg-[#EFE0E5]/40 rounded-xl border border-[#E3D3DA] text-[#241B22] leading-relaxed">
                          {details.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 4: PLAYER SCORECARD PROFILE
      ───────────────────────────────────────────────────────────── */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden border border-[#E3D3DA] shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3D3DA] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-lg">
                  #{selectedPlayer.overallRank}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B23A6B]">
                    Player Scorecard
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#241B22]">
                    {selectedPlayer.guest_name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="p-1.5 text-[#6B5A63] hover:text-red-500 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0E5C52]/10 p-3.5 rounded-2xl border border-[#0E5C52]/20 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E5C52]">
                    Total Score
                  </span>
                  <p className="text-2xl font-bold text-[#0E5C52] mt-0.5">
                    {selectedPlayer.totalScore} pts
                  </p>
                </div>

                <div className="bg-[#EFE0E5]/50 p-3.5 rounded-2xl border border-[#E3D3DA] text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B23A6B]">
                    Games Completed
                  </span>
                  <p className="text-2xl font-bold text-[#B23A6B] mt-0.5">
                    {selectedPlayer.gamesPlayed} / 4
                  </p>
                </div>
              </div>

              {/* Game Breakdown */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#6B5A63]">
                  Performance Across All 4 Games
                </h4>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-[#FDFBF7] rounded-xl border border-[#E3D3DA]">
                    <span className="font-medium text-[#241B22]">❓ Couple Trivia</span>
                    <span className="font-bold text-[#0E5C52]">
                      {selectedPlayer.bestScores.trivia !== undefined
                        ? `${Math.floor(selectedPlayer.bestScores.trivia)}/5 correct (${Math.floor(selectedPlayer.bestScores.trivia) * 10} pts)`
                        : "Not played"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-[#FDFBF7] rounded-xl border border-[#E3D3DA]">
                    <span className="font-medium text-[#241B22]">🃏 Memory Match</span>
                    <span className="font-bold text-[#0E5C52]">
                      {selectedPlayer.bestScores.memory !== undefined
                        ? `${Math.floor(selectedPlayer.bestScores.memory)} moves (${Math.max(0, 100 - Math.floor(selectedPlayer.bestScores.memory) * 2)} pts)`
                        : "Not played"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-[#FDFBF7] rounded-xl border border-[#E3D3DA]">
                    <span className="font-medium text-[#241B22]">⏳ Our Timeline</span>
                    <span className="font-bold text-[#0E5C52]">
                      {selectedPlayer.bestScores.timeline !== undefined
                        ? "Completed (50 pts)"
                        : "Not played"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-[#FDFBF7] rounded-xl border border-[#E3D3DA]">
                    <span className="font-medium text-[#241B22]">🌀 Find the Bride (Maze)</span>
                    <span className="font-bold text-[#0E5C52]">
                      {selectedPlayer.bestScores.maze !== undefined
                        ? `${Math.floor(selectedPlayer.bestScores.maze)} moves (${Math.max(0, 100 - Math.floor(selectedPlayer.bestScores.maze) * 2)} pts)`
                        : "Not played"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#8C7A84] flex justify-between pt-2 border-t border-[#E3D3DA]">
                <span>First active: {new Date(selectedPlayer.firstPlayed).toLocaleDateString()}</span>
                <span>Latest: {new Date(selectedPlayer.latestPlayed).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 5: DELETE SCORE CONFIRMATION
      ───────────────────────────────────────────────────────────── */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#E3D3DA] shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#241B22] mb-1">Delete Score Record?</h3>
            <p className="text-xs text-[#6B5A63] mb-5">
              Are you sure you want to permanently remove score entry #{deleteConfirmId}? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-[#FDFBF7] border border-[#E3D3DA] rounded-xl text-xs font-semibold text-[#6B5A63] hover:bg-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteScore(deleteConfirmId)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
