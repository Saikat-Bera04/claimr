import { auth0 } from "@/lib/auth0";
import HeaderProfile from "@/components/HeaderProfile";
import Link from "next/link";
import BountyFilters from "./BountyFilters";

const recommendedBounties = [
  {
    id: "rec-1",
    title: "Implement Gas-Optimized Merkle Proof Verification",
    company: "zkSync",
    reward: "0.5 ETH",
    tags: ["Solidity", "Cryptography", "Yul"],
    difficulty: "Advanced",
    matchReason: "// Matches your high grades in Cryptography & Solidity skills",
    matchScore: "98%",
  },
  {
    id: "rec-2",
    title: "Build Zero-Knowledge Identity Verifier Component",
    company: "Polygon",
    reward: "0.35 ETH",
    tags: ["React", "zk-SNARKs", "TypeScript"],
    difficulty: "Intermediate",
    matchReason: "// Fits your React + Web3 curriculum focus",
    matchScore: "92%",
  }
];

const availableBounties = [
  // Blockhain / Web3
  {
    id: "avl-1",
    title: "DeFi Liquidity Dashboard Alerts",
    company: "Aurora Labs",
    category: "Web3",
    reward: "1,200 USDC",
    tags: ["Node.js", "PostgreSQL", "WebSockets"],
    difficulty: "Intermediate",
  },
  {
    id: "avl-2",
    title: "P2P Lending Smart Contract Security Audit",
    company: "Aave",
    category: "Web3",
    reward: "2.5 ETH",
    tags: ["Solidity", "Security", "Foundry"],
    difficulty: "Expert",
  },
  {
    id: "avl-4",
    title: "Rust-based MEV Bot Indexer",
    company: "Flashbots",
    category: "Web3",
    reward: "1.2 ETH",
    tags: ["Rust", "MEV", "Algorithms"],
    difficulty: "Advanced",
  },
  // Design
  {
    id: "avl-3",
    title: "Create Minimalist Dark Mode UI Kit",
    company: "Claimr Core",
    category: "Design",
    reward: "800 USDC",
    tags: ["Figma", "Tailwind", "Design"],
    difficulty: "Beginner",
  },
  {
    id: "avl-6",
    title: "Revamp Landing Page Animations",
    company: "Acme Corp",
    category: "Design",
    reward: "500 USDC",
    tags: ["Framer Motion", "CSS", "Creative"],
    difficulty: "Intermediate",
  },
  // Writing
  {
    id: "avl-5",
    title: "Write Technical Documentation for v2 Protocol",
    company: "Uniswap",
    category: "Writing",
    reward: "500 USDC",
    tags: ["Technical Writing", "DeFi"],
    difficulty: "Beginner",
  },
  {
    id: "avl-7",
    title: "Developer Onboarding Tutorial",
    company: "Vercel",
    category: "Writing",
    reward: "300 USDC",
    tags: ["Next.js", "Tutorial", "Markdown"],
    difficulty: "Beginner",
  },
  // Backend / System
  {
    id: "avl-8",
    title: "Migrate Message Queue to Kafka",
    company: "Discord",
    category: "Backend",
    reward: "2,000 USDC",
    tags: ["Kafka", "Go", "Distributed Systems"],
    difficulty: "Expert",
  },
  {
    id: "avl-9",
    title: "Optimize Postgres Queries for Analytics",
    company: "Hugging Face",
    category: "Backend",
    reward: "1,500 USDC",
    tags: ["SQL", "Performance", "Database"],
    difficulty: "Advanced",
  },
  // ML / AI
  {
    id: "avl-10",
    title: "Fine-tune local LLM for Support Ticket triage",
    company: "Supabase",
    category: "AI / ML",
    reward: "3,000 USDC",
    tags: ["Python", "PyTorch", "LLMs"],
    difficulty: "Advanced",
  },
];

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
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-[#1E1E2E] bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
          <Link href="/" className="text-lg font-bold uppercase tracking-widest cursor-pointer hover:text-[#22C55E] transition-colors">
            CLAIMR
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/bounties" className="text-sm uppercase tracking-wider cursor-pointer text-[#22C55E]">
              Bounties
            </Link>
            <Link href="/#projects" className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors">
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
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-4">
            Active <span className="text-[#22C55E]">Targets</span>
          </h1>
          <p className="text-white/60 max-w-2xl leading-relaxed">
            Browse open bounties, claim tasks, and submit your proof. Assignments are 
            scored and payouts are settled automatically on-chain. 
          </p>
        </header>

        {user && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-widest">Recommended For You</h2>
              <span className="px-3 py-1 border border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E] text-xs animate-pulse">
                [ AI_MATCHED ]
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {recommendedBounties.map((bounty) => (
                <div key={bounty.id} className="border border-[#22C55E]/50 bg-[#12121A] p-6 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] transition-shadow flex flex-col h-full relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#22C55E]/10 blur-2xl rounded-full group-hover:bg-[#22C55E]/20 transition-all" />
                  
                  <div className="flex items-start justify-between mb-4 z-10">
                    <p className="text-[#22C55E] text-xs uppercase tracking-widest">{bounty.company}</p>
                    <p className="font-bold text-[#22C55E]">{bounty.reward}</p>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 z-10">{bounty.title}</h3>
                  <p className="text-xs text-white/50 mb-6 font-mono z-10 h-10">{bounty.matchReason}</p>
                  
                  <div className="mt-auto z-10 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {bounty.tags.map(tag => (
                        <span key={tag} className="border border-[#1E1E2E] bg-black px-2 py-1 text-[10px] text-white/70 uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-[#1E1E2E] pt-4">
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-[#22C55E] rounded-full"></span>
                         <span className="text-xs text-white/70">{bounty.difficulty}</span>
                      </div>
                      <button className="border border-[#22C55E] bg-[#22C55E]/10 px-4 py-2 text-xs text-[#22C55E] uppercase tracking-widest hover:bg-[#22C55E] hover:text-black transition-colors">
                        [ claim_task ]
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <BountyFilters bounties={availableBounties} />
        </section>
      </main>
    </div>
  );
}
