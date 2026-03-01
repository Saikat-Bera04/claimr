import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import HeaderProfile from "@/components/HeaderProfile";
import LeaderboardClient from "./LeaderboardClient";

export default async function LeaderboardPage() {
  let session = null;

  try {
    session = await auth0.getSession();
  } catch (error) {
    session = null;
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-[#1E1E2E] bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
          <Link href="/" className="text-lg font-bold uppercase tracking-widest hover:text-[#22C55E] transition-colors">
            CLAIMR
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/bounties" className="text-sm uppercase tracking-wider hover:text-white/70 transition-colors">
              Bounties
            </Link>
            <Link href="/leaderboard" className="text-sm uppercase tracking-wider text-[#22C55E]">
              Rankings
            </Link>
            {user ? (
              <HeaderProfile user={user} />
            ) : (
              <a
                href="/auth/login"
                className="border border-[#1E1E2E] px-4 py-2 text-sm uppercase tracking-wider hover:border-[#22C55E] hover:text-[#22C55E] transition-colors"
              >
                [ login ]
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="mx-auto max-w-5xl px-6 py-12 md:px-12">
        <LeaderboardClient />
      </main>
    </div>
  );
}