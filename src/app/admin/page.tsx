"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Lock, Users, ShoppingBag, Eye, Copy, RefreshCcw } from "lucide-react";

type RSVP = {
  id: number;
  created_at: string;
  full_name: string;
  attending: boolean;
  guest_count: number;
  song_request: string;
};

type AsoebiOrder = {
  id: number;
  created_at: string;
  full_name: string;
  phone: string;
  delivery_location: string;
  items: { [key: string]: number | string };
  total_amount: number;
  proof_of_payment_url: string;
};

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"rsvps" | "asoebi">("rsvps");
  
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [asoebiOrders, setAsoebiOrders] = useState<AsoebiOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "OliviaIyanu2026") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect passcode");
    }
  };

  // Data Fetching
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: rsvpData, error: rsvpError } = await supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });

      if (rsvpError) throw rsvpError;

      const { data: asoebiData, error: asoebiError } = await supabase
        .from("asoebi_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (asoebiError) throw asoebiError;

      setRsvps(rsvpData || []);
      setAsoebiOrders(asoebiData || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch data: " + err.message);
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
  const totalAttending = rsvps
    .filter(r => r.attending === true)
    .reduce((sum, r) => sum + (r.guest_count || 1), 0);
    
  const totalRevenue = asoebiOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  // Format Date
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl max-w-sm w-full text-center border border-[#E3D3DA]">
          <Lock className="w-12 h-12 text-[#0E5C52] mx-auto mb-4" />
          <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }} className="text-3xl text-[#241B22] mb-2">Admin Access</h2>
          <p className="text-xs text-[#6B5A63] mb-8">Enter the secret passcode to view your RSVPs and Orders.</p>
          
          <input 
            type="password" 
            placeholder="Passcode" 
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full px-4 py-3 border border-[#E3D3DA] rounded-lg text-sm text-center focus:outline-none focus:border-[#0E5C52] mb-2"
          />
          {authError && <p className="text-xs text-red-500 mb-4">{authError}</p>}
          
          <button type="submit" className="w-full mt-4 px-6 py-3 bg-[#0E5C52] text-white text-sm font-bold rounded-lg hover:bg-[#0A4A42] transition-colors">
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFEF] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }} className="text-4xl sm:text-5xl text-[#0E5C52] mb-2">
              Wedding Dashboard
            </h1>
            <p className="text-sm text-[#6B5A63]">Manage your guests and aso-ebi orders securely.</p>
          </div>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E3D3DA] rounded-lg text-sm font-semibold text-[#0E5C52] hover:bg-[#FDFBF7] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            Refresh Data
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-[#E3D3DA] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0E5C52]/10 flex items-center justify-center text-[#0E5C52]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B5A63]">Total Guests</p>
              <p className="text-2xl font-bold text-[#241B22]">{totalAttending}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#E3D3DA] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B23A6B]/10 flex items-center justify-center text-[#B23A6B]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B5A63]">Aso-ebi Orders</p>
              <p className="text-2xl font-bold text-[#241B22]">{asoebiOrders.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#E3D3DA] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-700">
              <span className="font-serif text-2xl">₦</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B5A63]">Total Revenue</p>
              <p className="text-2xl font-bold text-[#241B22]">₦{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#E3D3DA] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-700">
              <span className="font-bold text-xl">!</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B5A63]">Total RSVPs</p>
              <p className="text-2xl font-bold text-[#241B22]">{rsvps.length}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8 text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("rsvps")}
            className={`px-6 py-3 rounded-t-xl text-sm font-bold transition-colors ${
              activeTab === "rsvps" ? "bg-white text-[#0E5C52] border-t border-l border-r border-[#E3D3DA]" : "bg-transparent text-[#6B5A63] hover:text-[#241B22]"
            }`}
          >
            Guest RSVPs
          </button>
          <button
            onClick={() => setActiveTab("asoebi")}
            className={`px-6 py-3 rounded-t-xl text-sm font-bold transition-colors ${
              activeTab === "asoebi" ? "bg-white text-[#0E5C52] border-t border-l border-r border-[#E3D3DA]" : "bg-transparent text-[#6B5A63] hover:text-[#241B22]"
            }`}
          >
            Aso-ebi Orders
          </button>
        </div>

        {/* Data Tables */}
        <div className="bg-white border border-[#E3D3DA] rounded-b-xl rounded-tr-xl overflow-hidden shadow-sm">
          
          {/* RSVPS TAB */}
          {activeTab === "rsvps" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#241B22]">
                <thead className="bg-[#FDFBF7] text-[#6B5A63] text-xs uppercase tracking-wider font-semibold border-b border-[#E3D3DA]">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Guest Name</th>
                    <th className="px-6 py-4">Attending</th>
                    <th className="px-6 py-4">Count</th>
                    <th className="px-6 py-4">Song Request</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3E7EB]">
                  {rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-[#6B5A63] text-xs">{formatDate(rsvp.created_at)}</td>
                      <td className="px-6 py-4 font-medium">{rsvp.full_name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                          rsvp.attending ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {rsvp.attending ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">{rsvp.guest_count}</td>
                      <td className="px-6 py-4 text-[#6B5A63] italic max-w-xs truncate" title={rsvp.song_request}>{rsvp.song_request || "—"}</td>
                    </tr>
                  ))}
                  {rsvps.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#6B5A63]">No RSVPs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ASOEBI TAB */}
          {activeTab === "asoebi" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#241B22]">
                <thead className="bg-[#FDFBF7] text-[#6B5A63] text-xs uppercase tracking-wider font-semibold border-b border-[#E3D3DA]">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Name & Contact</th>
                    <th className="px-6 py-4">Delivery</th>
                    <th className="px-6 py-4">Items Ordered</th>
                    <th className="px-6 py-4">Total Paid</th>
                    <th className="px-6 py-4 text-right">Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3E7EB]">
                  {asoebiOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-[#6B5A63] text-xs align-top">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4 align-top">
                        <p className="font-bold">{order.full_name}</p>
                        <p className="text-xs text-[#6B5A63] mt-1">{order.phone}</p>
                      </td>
                      <td className="px-6 py-4 align-top max-w-xs">
                        <p className="text-xs text-[#6B5A63] truncate" title={order.delivery_location}>{order.delivery_location}</p>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <ul className="text-xs space-y-1">
                          {Object.entries(order.items || {}).map(([key, val]) => (
                            Number(val) > 0 ? <li key={key}><span className="font-bold text-[#0E5C52]">{val}x</span> {key}</li> : null
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 align-top font-bold text-[#B23A6B]">
                        ₦{order.total_amount?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                        {order.proof_of_payment_url ? (
                          <a href={order.proof_of_payment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0E5C52]/10 text-[#0E5C52] rounded-md text-xs font-bold hover:bg-[#0E5C52]/20 transition-colors">
                            <Eye className="w-3.5 h-3.5" /> View
                          </a>
                        ) : (
                          <span className="text-xs text-[#6B5A63]">No proof</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {asoebiOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#6B5A63]">No Aso-ebi orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
