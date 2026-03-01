import { auth0 } from "@/lib/auth0";
import HeaderProfile from "@/components/HeaderProfile";
import Link from "next/link";
import UpliftBountyModal from "./UpliftBountyModal";
import BountyListClient from "./BountyListClient";

export default async function BountiesPage() {
  let session = null;

  try {
    session = await auth0.getSession();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Invalid Compact JWE")) {
      session = null;
    } else {
      throw error;
    }
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* ── NAVBAR LIVES HERE ── */}
      <nav className="sticky top-0 z-50 border-b border-[#1E1E2E] bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
          <Link href="/" className="text-lg font-bold uppercase tracking-widest cursor-pointer hover:text-[#22C55E] transition-colors">
            CLAIMR
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/bounties" className="text-sm uppercase tracking-wider cursor-pointer text-[#22C55E]">
              Bounties
            </Link>
            <Link href="/projects" className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors">
              Projects
            </Link>
            {user ? (
              <HeaderProfile user={user} />
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

      <main className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        <header className="mb-16 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-4">
              Active <span className="text-[#22C55E]">Targets</span>
            </h1>
            <p className="text-white/60 max-w-2xl leading-relaxed">
              Browse open bounties, claim tasks, and submit your proof. Assignments are 
              scored and payouts are settled automatically on-chain. 
            </p>
          </div>
          <div>
            <UpliftBountyModal email={user?.email || ""} />
          </div>
        </header>

        {/* ── ALL BOUNTIES LIST INJECTED HERE ── */}
        <section>
          <div className="mb-8 border-b border-[#1E1E2E] pb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-widest text-white/80">
              // Open Network Bounties
            </h2>
          </div>
          
          <BountyListClient />
        </section>

      </main>
    </div>
  );
}