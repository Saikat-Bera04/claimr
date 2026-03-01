// src/app/bounties/[bountyId]/BountyDetailsClient.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import SubmitSolutionModal from "./SubmitSolutionModal";

export default function BountyDetailsClient({ 
  bountyId, 
  userEmail 
}: { 
  bountyId: string;
  userEmail?: string | null;
}){
  // Cast the string ID to the strict Convex Id type
  const bounty = useQuery(api.bountyFunctions.getBountyDetails, {
    bountyId: bountyId as Id<"bounty">,
  });

  // Loading state
  if (bounty === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-8 w-8 animate-spin border-2 border-[#1E1E2E] border-t-[#22C55E] rounded-full" />
        <p className="text-sm text-white/50 uppercase tracking-widest">// DECRYPTING DATA...</p>
      </div>
    );
  }

  // Not found state
  if (bounty === null) {
    return (
      <div className="border border-red-500/30 bg-red-500/10 p-8 text-center">
        <p className="text-red-500 uppercase tracking-widest font-bold">Error: Bounty Not Found</p>
        <p className="text-sm text-white/50 mt-2">The record you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  // Render the bounty details
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1E1E2E] pb-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs uppercase tracking-widest px-3 py-1 border ${
              bounty.bountyStatus === "OPEN" 
                ? "border-[#22C55E] text-[#22C55E] bg-[#22C55E]/10" 
                : "border-white/20 text-white/50 bg-white/5"
            }`}>
              {bounty.bountyStatus}
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wider">
              Target ID: {bounty._id.slice(-6)}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {bounty.title}
          </h1>
        </div>

        <div className="text-right">
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">// REWARD</p>
          <div className="flex items-baseline gap-2 justify-end">
            <span className="text-5xl font-bold text-[#22C55E] tabular-nums leading-none">
              {bounty.amount}
            </span>
            <span className="text-xl text-[#22C55E]/70 font-bold">
              {bounty.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Description & Details */}
      <div className="grid md:grid-cols-3 gap-8 pt-4">
        <div className="md:col-span-2 space-y-6">
          <div className="border border-[#1E1E2E] bg-[#0A0A0F] p-6">
            <h2 className="text-sm text-[#22C55E] uppercase tracking-widest mb-4">
              // Mission Briefing
            </h2>
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
              {bounty.description}
            </p>
          </div>
        </div>

        {/* Sidebar Data */}
        <div className="space-y-6">
          <div className="border border-[#1E1E2E] p-6">
            <h3 className="text-xs text-white/50 uppercase tracking-widest border-b border-[#1E1E2E] pb-3 mb-4">
              Metadata
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">End Date</p>
                <p className="text-sm">
                  {new Date(bounty.endDate).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Amount Status</p>
                <p className="text-sm text-white/80">{bounty.amountStatus}</p>
              </div>

              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Setter ID</p>
                <p className="text-xs text-white/60 truncate" title={bounty.bountySetter}>
                  {bounty.bountySetter}
                </p>
              </div>
            </div>
          </div>

         <SubmitSolutionModal 
    bountyId={bounty._id}
    bountyTitle={bounty.title}
    bountyDescription={bounty.description}
    userEmail={userEmail}
  />
        </div>
      </div>
    </div>
  );
}