"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import HeaderProfile from "@/components/HeaderProfile";
import Typewriter from "@/components/Typewriter";
import CreateUserClient from "./CreateUserClient";


const navLinks = ["About", "Projects", "Contact"];

export default function DashboardClient({ sessionUser }: { sessionUser: any }) {
  // Fetch real-time on-chain data using your exact Convex query
  const dashboardData = useQuery(api.userFunctions.getUserDetails, {
    email: sessionUser?.email ?? "",
  });

  // Loading state matching your minimal theme
  if (dashboardData === undefined) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-sm uppercase tracking-widest text-white/60">
          // fetching on-chain data...
        </p>
      </div>
    );
  }

  // 404 state if the user isn't fully registered in the DB yet
  if (dashboardData === null) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <p className="text-sm uppercase tracking-widest text-white/60">
          // 404_user_not_found
        </p>
        <a
          href="/auth/login"
          className="border border-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
        >
          [ Return to Login ]
        </a>
      </div>
    );
  }

  const { name, bountiesGiven, bountiesSolved } = dashboardData;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── ORIGINAL NAVBAR PRESERVED ── */}
      <nav className="sticky top-0 z-50 border-b border-[#1E1E2E] bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
          <a href="#" className="text-lg font-bold uppercase tracking-widest cursor-pointer hover:text-[#22C55E] transition-colors">
            CLAIMR
          </a>
          <div className="flex items-center gap-6">
            <a href="/bounties" className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors">
              Bounties
            </a>
            <a href="/projects" className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors">
              Projects
            </a>
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors"
              >
                {link}
              </a>
            ))}
            {sessionUser ? (
              <HeaderProfile user={sessionUser} />
            ) : (
              <a
                href="/auth/login"
                className="border border-[#1E1E2E] px-4 py-2 text-sm uppercase tracking-wider cursor-pointer hover:border-[#22C55E] hover:text-[#22C55E] transition-colors"
              >
                [ login ]
              </a>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        {/* Ensures user exists in Convex DB on load */}
        <CreateUserClient user={sessionUser} />

        {/* ── HEADER / STATS ── */}
        <section className="py-16 md:py-20">
          <p className="mb-4 text-sm uppercase tracking-widest text-white/60">
            // welcome back
          </p>
          <h1 className="text-4xl font-bold uppercase leading-tight md:text-5xl mb-12">
            <Typewriter text={name || "OPERATIVE"} speed={100} />
          </h1>

          {/* Minimalist Stats Grid */}
          <div className="grid gap-px border border-white md:grid-cols-3 bg-white">
            <div className="bg-black p-6 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-white/50">Bounties Posted</span>
              <span className="text-4xl font-bold">{bountiesGiven.length}</span>
            </div>
            <div className="bg-black p-6 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-white/50">Bounties Solved</span>
              <span className="text-4xl font-bold">{bountiesSolved.length}</span>
            </div>
            <div className="bg-black p-6 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-white/50">Protocol Status</span>
              <span className="text-4xl font-bold text-[#22C55E]">ACTIVE</span>
            </div>
          </div>
        </section>

        <hr className="border-white" />

        {/* ── BOUNTIES SOLVED (HUNTER) ── */}
        <section className="py-16 md:py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="mb-4 text-sm uppercase tracking-widest text-white/60">
                // your claims
              </p>
              <h2 className="text-3xl font-bold uppercase md:text-4xl">
                ACTIVE PURSUITS
              </h2>
            </div>
          </div>

          {bountiesSolved.length === 0 ? (
            <div className="border border-white border-dashed p-12 text-center text-white/50 text-sm uppercase tracking-widest">
              No active bounties claimed. Go hunt.
            </div>
          ) : (
            <div className="grid gap-px border border-white md:grid-cols-2">
              {bountiesSolved.map((bounty: any) => (
                <BountyCard key={bounty._id} bounty={bounty} />
              ))}
            </div>
          )}
        </section>

        <hr className="border-white" />

        {/* ── BOUNTIES GIVEN (SETTER) ── */}
        <section className="py-16 md:py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="mb-4 text-sm uppercase tracking-widest text-white/60">
                // your escrow
              </p>
              <h2 className="text-3xl font-bold uppercase md:text-4xl">
                POSTED BOUNTIES
              </h2>
            </div>
          </div>

          {bountiesGiven.length === 0 ? (
            <div className="border border-white border-dashed p-12 text-center text-white/50 text-sm uppercase tracking-widest">
              No bounties posted yet. Fund a task.
            </div>
          ) : (
            <div className="grid gap-px border border-white md:grid-cols-2">
              {bountiesGiven.map((bounty: any) => (
                <BountyCard key={bounty._id} bounty={bounty} />
              ))}
            </div>
          )}
        </section>

        <hr className="border-white" />

        {/* ── FOOTER ── */}
        <footer className="py-10 text-sm text-white/50 flex flex-col md:flex-row justify-between uppercase tracking-widest gap-4">
          <p>&copy; {new Date().getFullYear()} CLAIMR PROTOCOL.</p>
          <p>SYSTEM ONLINE</p>
        </footer>
      </div>
    </div>
  );
}

// ── REUSABLE BOUNTY CARD COMPONENT ──
function BountyCard({ bounty }: { bounty: any }) {
  return (
    <article className="group flex flex-col gap-4 border border-white bg-black p-6 cursor-pointer transition-colors hover:bg-white hover:text-black">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold uppercase tracking-wide pr-4">
          {bounty.title}
        </h3>
        <span className="border border-white px-2 py-1 text-xs uppercase tracking-wider whitespace-nowrap group-hover:border-black">
          {bounty.amount} {bounty.unit}
        </span>
      </div>
      
      <p className="text-sm leading-relaxed text-white/70 group-hover:text-black/70 line-clamp-2">
        {bounty.description}
      </p>
      
      <div className="mt-auto pt-6 flex justify-between items-center text-xs tracking-widest text-white/50 group-hover:text-black/50 border-t border-[#1E1E2E] group-hover:border-black/20 mt-4">
        <span>STATUS: {bounty.bountyStatus}</span>
        {/* Simple check to format date, handle if it's a timestamp */}
        <span>DUE: {new Date(bounty.endDate).toLocaleDateString()}</span>
      </div>
    </article>
  );
}