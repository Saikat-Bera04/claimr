import { auth0 } from "@/lib/auth0";

const bounties = [
  {
    title: "DeFi liquidity dashboard alerts",
    category: "Code",
    color: "text-sky-300 border-sky-500/50 bg-sky-500/5",
    company: "Aurora Labs",
    reward: "0.42 ETH",
    desc: "Add on-chain monitors for liquidity shifts and ship a minimal alert rule builder.",
  },
  {
    title: "Brand system audit for Claimr",
    category: "Design",
    color: "text-pink-300 border-pink-500/50 bg-pink-500/5",
    company: "Claimr Core",
    reward: "0.28 ETH",
    desc: "Evaluate our design tokens, propose improvements, and deliver a crisp component sheet.",
  },
  {
    title: "Write bounty ops playbook",
    category: "Writing",
    color: "text-amber-200 border-amber-400/60 bg-amber-400/5",
    company: "Ops Guild",
    reward: "450 USDC",
    desc: "Document contributor onboarding, submission QA, and dispute resolution in plain English.",
  },
  {
    title: "LLM-based bounty matcher",
    category: "ML/AI",
    color: "text-purple-200 border-purple-400/60 bg-purple-400/5",
    company: "SignalMesh",
    reward: "0.73 ETH",
    desc: "Prototype a scoring model to recommend bounties to solvers using embeddings + recency.",
  },
];

const leaderboard = [
  { name: "Nova.dev", wins: 42, earned: "6.4 ETH" },
  { name: "0xAtlas", wins: 33, earned: "5.1 ETH" },
  { name: "Pixelbyte", wins: 28, earned: "4.8 ETH" },
];

const activities = [
  { label: "Submission merged", meta: "Brand system audit • Claimr", time: "4m ago" },
  { label: "New bounty posted", meta: "DeFi liquidity dashboard alerts", time: "18m ago" },
  { label: "Rank up", meta: "You moved to #47 global", time: "32m ago" },
  { label: "Payout executed", meta: "0.18 ETH to your wallet", time: "1h ago" },
];

export default async function Home() {
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
    <div className="min-h-screen bg-[#0A0A0F] text-white" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.04) 1px, transparent 0), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "120px 120px, 120px 120px" }}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-3 border-r border-[#1E1E2E] bg-[#0C0C12] px-6 py-8">
          <div className="flex items-center gap-3 pb-6 text-base font-bold text-white uppercase tracking-[0.2em] border-b border-[#1E1E2E] mb-4">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#7C3AED] filter drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]"><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>
            ProofOf<span className="text-[#7C3AED]">Work</span>
          </div>
          {[
            { label: "Home / Feed", icon: "🏠", active: true },
            { label: "My Submissions", icon: "🎯" },
            { label: "Leaderboard", icon: "🏆" },
            { label: "My Earnings", icon: "🪙" },
            { label: "My NFT Badges", icon: "🎖️" },
            { label: "Post a Bounty", icon: "📋" },
            { label: "Settings", icon: "⚙️" },
          ].map((item) => (
            <button
              key={item.label}
              className={`group flex w-full items-center justify-between border border-transparent px-4 py-3.5 text-sm font-medium transition-all ${item.active ? "border-[#1E1E2E] bg-[#12121A] text-white shadow-[inset_0_0_15px_rgba(124,58,237,0.05)]" : "text-white/60 hover:border-[#1E1E2E] hover:bg-[#12121A] hover:text-white"}`}
            >
              <span className="flex items-center gap-4">
                <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-sm">{item.icon}</span>
                <span className="tracking-wide">{item.label}</span>
              </span>
              {item.active && <span className="h-2 w-2 rounded-full bg-[#7C3AED] animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.6)]"></span>}
            </button>
          ))}
          
          <div className="mt-auto pt-6 border-t border-[#1E1E2E] flex flex-col gap-4">
            <div className="bg-[#12121A] border border-[#1E1E2E] p-4 text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/50 uppercase tracking-widest">Network</span>
                <span className="text-[#22C55E] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full inline-block"></span>
                  Mainnet
                </span>
              </div>
              <div className="flex justify-between items-center text-white/40 font-mono">
                <span>Block:</span>
                <span>18294021</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          {/* Navbar */}
          <header className="sticky top-0 z-30 border-b border-[#1E1E2E] bg-[#0A0A0F]/90 backdrop-blur-md">
            <div className="mx-auto flex w-full items-center gap-6 px-8 py-5">
              <div className="flex lg:hidden items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#7C3AED]"><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>
                ProofOf<span className="text-[#7C3AED]">Work</span>
              </div>

              <div className="flex flex-1 items-center justify-center">
                <div className="flex w-full max-w-2xl items-center gap-4 border border-[#1E1E2E] bg-[#12121A] px-5 py-3 text-sm text-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.2)] focus-within:border-[#7C3AED]/40 transition-colors">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white/40"><path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 14 15.5l.27.28v.79l5 5L20.49 19l-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" /></svg>
                  <input
                    className="w-full bg-transparent text-[15px] font-mono tracking-wide text-white placeholder:text-white/30 focus:outline-none"
                    placeholder="Search smart contracts, bounties, developers..."
                    aria-label="Search bounties"
                  />
                  <div className="hidden sm:flex border border-[#1E1E2E] bg-[#0A0A0F] px-2 py-0.5 text-[10px] text-white/40 font-mono rounded-sm">⌘K</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm font-mono">
                <div className="hidden md:flex items-center border border-[#1E1E2E] bg-[#12121A]">
                  <span className="px-4 py-2 text-white/60 border-r border-[#1E1E2E]">0x3f...9a2</span>
                  <span className="px-4 py-2 text-[#22C55E] flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/></svg>
                    2.847 ETH
                  </span>
                </div>
                
                {/* <button className="relative border border-[#1E1E2E] bg-[#12121A] p-2.5 text-white/70 hover:text-white hover:border-[#7C3AED]/50 transition-colors cursor-pointer">
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#7C3AED] border border-[#0A0A0F]"></span>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 22a1.5 1.5 0 0 0 1.5-1.5h-3A1.5 1.5 0 0 0 12 22Zm6-6v-5a6 6 0 1 0-12 0v5l-1.5 1.5v.5h15v-.5Z" /></svg>
                </button> */}
                <div className="h-10 w-10 border-2 border-[#1E1E2E] bg-[#12121A] overflow-hidden hover:border-[#7C3AED] transition-colors cursor-pointer">
                   <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=admin" alt="PFP" className="w-full h-full object-cover" />
                   <p className="text-xs text-white/60">{user?.email}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-8 pb-16 pt-8">
            {/* Hero stats */}
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[{
                label: "Total Earned",
                value: "2.847 ETH",
                delta: "+12% this week",
                accent: "text-[#22C55E]",
                icon: <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#22C55E]"><path d="M5 12l4 4 10-10-1.4-1.4L9 13.2 6.4 10.6z" /></svg>,
              }, {
                label: "Bounties Won",
                value: "14",
                delta: "+3 this month",
                accent: "text-white",
                icon: <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#7C3AED]"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17.9l.9-5.4L4.2 7.7l5.4-.8z" /></svg>,
              }, {
                label: "Win Rate",
                value: "68%",
                delta: "Target: 70%",
                accent: "text-[#7C3AED]",
                icon: <svg viewBox="0 0 36 36" className="h-6 w-6"><circle cx="18" cy="18" r="16" stroke="#1E1E2E" strokeWidth="4" fill="none" /><path d="M18 2 a16 16 0 0 1 0 32" stroke="#7C3AED" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>,
              }, {
                label: "Global Rank",
                value: "#47",
                delta: "+2 today",
                accent: "text-white",
                icon: <svg viewBox="0 0 24 24" className="h-5 w-5 fill-orange-400"><path d="M6 22h12l-2-8h4L12 2 4 14h4z" /></svg>,
              }].map((card) => (
                <div key={card.label} className="flex items-start justify-between border border-[#1E1E2E] bg-[#12121A] p-6 shadow-[0_0_25px_rgba(124,58,237,0.06)] hover:shadow-[0_0_30px_rgba(124,58,237,0.12)] transition-shadow">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-white/60">{card.label}</p>
                    <p className={`text-3xl font-semibold ${card.accent}`}>{card.value}</p>
                    <p className="text-xs text-white/60">{card.delta}</p>
                  </div>
                  <div className="border border-[#1E1E2E] bg-[#0A0A0F] p-3">{card.icon}</div>
                </div>
              ))}
            </section>

            <section className="grid gap-8 xl:grid-cols-3">
              {/* Live bounties */}
              <div className="xl:col-span-2 space-y-6">
                <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#7C3AED] mb-1">Feed</p>
                    <h2 className="text-2xl font-semibold tracking-wide">Live Bounties</h2>
                  </div>
                  <div className="flex gap-3 text-xs tracking-wider">
                    {["All", "Code", "Design", "Writing", "ML/AI"].map((pill) => (
                      <button key={pill} className={`border px-4 py-2 uppercase transition-all ${pill === "All" ? "border-[#7C3AED] bg-[#7C3AED]/10 text-white shadow-[0_0_15px_rgba(124,58,237,0.2)]" : "border-[#1E1E2E] text-white/50 hover:border-[#7C3AED]/50 hover:text-white"}`}>
                        {pill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {bounties.map((item) => (
                    <article key={item.title} className="group flex h-full flex-col gap-4 border border-[#1E1E2E] bg-[#12121A] p-6 transition-all hover:-translate-y-1 hover:border-[#7C3AED]/50 hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)]">
                      <div className="flex items-center justify-between">
                        <span className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${item.color}`}>{item.category}</span>
                        <span className="text-lg text-[#22C55E] font-semibold">{item.reward}</span>
                      </div>
                      <h3 className="text-xl font-semibold leading-tight text-white group-hover:text-[#7C3AED] transition-colors">{item.title}</h3>
                      <p className="text-base text-white/60 leading-relaxed">{item.desc}</p>
                      <div className="mt-auto flex items-center justify-between pt-4 text-sm text-white/60 border-t border-[#1E1E2E]/50">
                        <span className="flex items-center gap-3">
                          <span className="h-8 w-8 rounded-full border border-[#1E1E2E] bg-[#0A0A0F]"></span>
                          {item.company}
                        </span>
                        <button className="border border-[#1E1E2E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all">View</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Right rail */}
              <div className="space-y-6">
                <div className="border border-[#1E1E2E] bg-[#12121A] p-6 shadow-[0_0_20px_rgba(34,197,94,0.03)]">
                  <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#22C55E] mb-1">Wallet</p>
                      <h3 className="text-xl font-semibold tracking-wide">Portfolio</h3>
                    </div>
                    <span className="border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 text-xs text-[#22C55E] uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                      Synced
                    </span>
                  </div>
                  <div className="mt-5 space-y-4 text-base">
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 uppercase tracking-widest text-sm">ETH</span>
                      <span className="font-semibold text-[#22C55E] text-lg">2.847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 uppercase tracking-widest text-sm">USDC</span>
                      <span className="font-semibold text-white text-lg">1,120</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#1E1E2E] pt-3">
                      <span className="text-white/50 uppercase tracking-widest text-sm">Pending</span>
                      <span className="font-semibold text-[#7C3AED]">3 active</span>
                    </div>
                  </div>
                  <button className="mt-6 w-full border border-[#7C3AED] bg-[#7C3AED]/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#7C3AED] hover:bg-[#7C3AED]/20 hover:text-white transition-all shadow-[inset_0_0_20px_rgba(124,58,237,0.1)]">
                    View Wallet
                  </button>
                </div>

                <div className="border border-[#1E1E2E] bg-[#12121A] p-6">
                  <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#7C3AED] mb-1">Leaderboard</p>
                      <h3 className="text-xl font-semibold tracking-wide">Top Builders</h3>
                    </div>
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#7C3AED] filter drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17.9l.9-5.4L4.2 7.7l5.4-.8z" />\
                    </svg>
                  </div>
                  <div className="mt-5 space-y-3">
                    {leaderboard.map((row, idx) => (
                      <div key={row.name} className="flex items-center justify-between border border-[#1E1E2E]/50 bg-[#0A0A0F]/50 px-4 py-3 hover:border-[#1E1E2E] transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="text-[#7C3AED] font-mono font-bold">{idx + 1}</span>
                          <span className="font-semibold">{row.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-widest text-white/40 mb-0.5">{row.wins} Wins</p>
                          <p className="text-[#22C55E] font-semibold text-sm">{row.earned}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-[#1E1E2E] bg-[#12121A] p-6">
                  <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40 mb-1">Activity</p>
                      <h3 className="text-xl font-semibold tracking-wide">Recent Logs</h3>
                    </div>
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white/40"><path d="M12 8v5h5v-2h-3V8z" /><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" /></svg>
                  </div>
                  <div className="mt-5 space-y-4">
                    {activities.map((act) => (
                      <div key={act.label} className="relative pl-4 border-l border-[#1E1E2E]">
                        <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#1A1A24] border border-[#1E1E2E]" />
                        <p className="font-semibold text-sm text-white/90">{act.label}</p>
                        <p className="text-xs text-white/50 mt-1">{act.meta}</p>
                        <p className="text-xs text-[#7C3AED] mt-1 font-mono">{act.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {user && (
              <div className="text-xs text-white/60">Signed in as {user.email}</div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}