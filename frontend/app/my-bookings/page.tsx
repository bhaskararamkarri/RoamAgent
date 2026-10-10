"use client";

import { useEffect, useState } from "react";
import { getMyBookings } from "@/lib/api";
import { format } from "date-fns";
import { Plane, Train, Bus, Info, Clock, CheckCircle, XCircle } from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (e) {
        console.error("Failed to load bookings", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-orange-50/30 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-orange-100 shadow-sm">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't made any journey bookings yet. When you plan and book a trip, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl p-6 md:p-8 border border-orange-100 shadow-sm flex flex-col md:flex-row gap-6 md:items-center">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                      b.status === 'CONFIRMED' ? 'bg-green-50 text-green-700' :
                      b.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                      'bg-orange-50 text-orange-700'
                    }`}>
                      {b.status === 'CONFIRMED' && <CheckCircle className="w-3.5 h-3.5" />}
                      {b.status === 'CANCELLED' && <XCircle className="w-3.5 h-3.5" />}
                      {b.status}
                    </span>
                    <span className="text-sm font-mono text-gray-500">Ref: {b.id}</span>
                    <span className="text-sm text-gray-400 ml-auto md:hidden">
                      {format(new Date(b.created_at), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {b.origin} <span className="text-gray-400">→</span> {b.destination}
                    </h3>
                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Travel Date: {b.travel_date}
                    </p>
                  </div>
                  
                  {b.itinerary && (
                    <div className="bg-orange-50/50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-800 mb-2">Journey Breakdown:</p>
                      <div className="space-y-2">
                        {b.itinerary.legs.map((leg: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                            {leg.mode === "flight" ? <Plane className="w-4 h-4 text-orange-500" /> :
                             leg.mode === "train" || leg.mode === "metro" ? <Train className="w-4 h-4 text-orange-500" /> :
                             <Bus className="w-4 h-4 text-orange-500" />}
                            <span>{leg.from_node}</span>
                            <span className="text-gray-400">→</span>
                            <span>{leg.to_node}</span>
                            <span className="ml-auto font-mono text-xs text-gray-500">
                              {format(new Date(leg.dep), "HH:mm")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:border-l md:border-gray-100 md:pl-6 md:w-48 flex flex-col justify-center shrink-0 border-t border-gray-100 pt-6 md:pt-0">
                  <span className="text-sm text-gray-500 mb-1 hidden md:block">
                    Booked {format(new Date(b.created_at), "MMM d")}
                  </span>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ₹{b.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                    <Info className="w-3.5 h-3.5" />
                    {b.payment_status}
                  </div>
                  <button className="w-full bg-white border border-gray-200 hover:border-orange-200 hover:bg-orange-50 text-gray-700 font-medium py-2 px-4 rounded-xl text-sm transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
