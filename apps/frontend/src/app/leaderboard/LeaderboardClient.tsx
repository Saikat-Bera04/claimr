"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function LeaderboardClient() {
  const rankings = useQuery(api.bountyFunctions.getRankings);

  if (rankings === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="h-12 w-12 animate-spin border-2 border-[#1E1E2E] border-t-[#22C55E] rounded-full" />
        <p className="text-sm uppercase tracking-widest text-white/50 animate-pulse">
          // DECRYPTING NETWORK RANKS...
        </p>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="border border-[#1E1E2E] border-dashed p-16 text-center text-white/50 text-sm uppercase tracking-widest">
        No operatives found on the network.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Info */}
      <div className="border-b border-[#1E1E2E] pb-8">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-4">
          Global <span className="text-[#22C55E]">Rankings</span>
        </h1>
        <p className="text-white/50 max-w-2xl leading-relaxed text-sm uppercase tracking-wider">
          // TOP 50 OPERATIVES BY ACCUMULATED WEALTH. BOUNTY REWARDS ARE DIRECTLY DEPOSITED INTO ESCROW BALANCES.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="border border-[#1E1E2E] bg-[#0A0A0F]">
        {/* Table Header */}
        <div className="hidden md:flex items-center px-6 py-4 border-b border-[#1E1E2E] text-xs uppercase tracking-widest text-white/40">
          <div className="w-16">Rank</div>
          <div className="flex-1">Operative</div>
          <div className="w-48 text-right">Wealth (Tokens)</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#1E1E2E]">
          {rankings.map((user, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            
            return (
              <div 
                key={user._id} 
                className={`flex items-center px-6 py-4 transition-colors hover:bg-[#1E1E2E]/30 ${
                  rank === 1 ? "bg-[#22C55E]/5 border-l-2 border-l-[#22C55E]" : "border-l-2 border-l-transparent"
                }`}
              >
                {/* Rank Number */}
                <div className={`w-12 md:w-16 text-lg font-bold tabular-nums ${
                  rank === 1 ? "text-[#22C55E]" : 
                  rank === 2 ? "text-white/90" : 
                  rank === 3 ? "text-white/70" : "text-white/40"
                }`}>
                  #{rank < 10 ? `0${rank}` : rank}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold uppercase tracking-wider ${isTop3 ? "text-white" : "text-white/80"}`}>
                      {user.name || "UNKNOWN_OPERATIVE"}
                    </span>
                    {rank === 1 && (
                      <span className="border border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 text-[10px] uppercase tracking-widest hidden md:inline-block">
                        APEX HUNTER
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                    ID: {user._id.slice(-8)} 
                    {user.githubUsername && ` // GITHUB: @${user.githubUsername}`}
                  </div>
                </div>

                {/* Tokens */}
                <div className="w-32 md:w-48 text-right">
                  <span className={`text-2xl font-bold tabular-nums ${
                    isTop3 ? "text-[#22C55E]" : "text-white/70"
                  }`}>
                    {user.TotalTokens || 0}
                  </span>
                  <span className="hidden md:inline-block text-[10px] text-[#22C55E]/50 uppercase tracking-widest ml-2">
                    TKN
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}