"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { upliftBounty, type BountyAnalysis } from "./uplift";

type Step = "form" | "analysing" | "review";

const verdictColor: Record<string, string> = {
  EXCELLENT: "#22C55E",
  GOOD: "#84CC16",
  FAIR: "#EAB308",
  POOR: "#EF4444",
};

export default function UpliftBountyModal( email : {email : string}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    unit: "USDC",
    endDate: "",
  });
  const [analysis, setAnalysis] = useState< any>();
  const [aiError, setAiError] = useState<string | null>(null);

  const resetModal = () => {
    setStep("form");
    setAnalysis(null);
    setAiError(null);
    setIsOpen(false);
  };


   const createBounty = useMutation(api.bountyFunctions.createBounty)
   const getUserIdByemail = useQuery(api.userFunctions.getUserDetails, { email: email.email });



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGlobalSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    // Logic to submit globally
    const userId = getUserIdByemail?._id;
    if (!userId) {
      console.error("User ID not found for email:", email.email);
      return;
    }
    createBounty({
      title: formData.title,
      description: formData.description,
      amount: parseFloat(formData.amount),
      unit: formData.unit,
      endDate: new Date(formData.endDate),
      bountySetter: userId, // Replace with actual user ID from session
    });
    console.log("Submitting Globally:", formData);
    resetModal();
  };

  const handleAISubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setStep("analysing");
    setAiError(null);
    try {
      const result = await upliftBounty(formData);
      setAnalysis(result);
      setStep("review");
    } catch {
      setAiError("AI analysis failed. You can still submit globally.");
      setStep("review");
    }
  };

  const handleConfirmPublish = () => {
    console.log("Publishing globally after AI review:", formData);
    resetModal();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="border border-[#22C55E] bg-[#22C55E]/10 px-6 py-3 text-sm text-[#22C55E] uppercase tracking-widest hover:bg-[#22C55E] hover:text-black transition-colors"
      >
        [ uplift bounty ]
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg border border-[#1E1E2E] bg-black shadow-2xl">

            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-[#1E1E2E] px-8 py-5">
              <h2 className="text-xl font-bold uppercase tracking-widest text-white">
                {step === "review" ? (
                  <>AI <span className="text-[#22C55E]">Analysis</span></>
                ) : (
                  <>Uplift <span className="text-[#22C55E]">Bounty</span></>
                )}
              </h2>
              <button onClick={resetModal} className="text-white/50 hover:text-white transition-colors">✕</button>
            </div>

            {/* ── Step: Form ── */}
            {step === "form" && (
              <form className="space-y-4 px-8 py-6">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">Title</label>
                  <input
                    type="text" name="title" value={formData.title} onChange={handleChange}
                    className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors"
                    placeholder="e.g. Implement Zero-Knowledge Proofs" required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange} rows={4}
                    className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors resize-none"
                    placeholder="Explain the requirements..." required
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">Amount</label>
                    <input
                      type="number" name="amount" value={formData.amount} onChange={handleChange}
                      className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors"
                      placeholder="e.g. 500" required
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">Unit</label>
                    <select
                      name="unit" value={formData.unit} onChange={handleChange}
                      className="w-full border border-[#1E1E2E] bg-black px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors appearance-none"
                    >
                      <option value="USDC">USDC</option>
                      <option value="ETH">ETH</option>
                      <option value="MATIC">MATIC</option>
                      <option value="SOL">SOL</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">End Date</label>
                  <input
                    type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                    className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors [color-scheme:dark]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={handleGlobalSubmit}
                    className="w-full border border-white px-4 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                  >
                    Submit Globally
                  </button>
                  <button
                    onClick={handleAISubmit}
                    className="w-full border border-[#22C55E] bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E] uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors"
                  >
                    Submit to AI then Globally
                  </button>
                </div>
              </form>
            )}

            {/* ── Step: Analysing ── */}
            {step === "analysing" && (
              <div className="flex flex-col items-center gap-6 px-8 py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1E1E2E] border-t-[#22C55E]" />
                <p className="text-sm uppercase tracking-widest text-white/60">// running ai analysis…</p>
              </div>
            )}

            {/* ── Step: Review ── */}
            {step === "review" && (
              <div className="px-8 py-6 space-y-6">
                {aiError ? (
                  <p className="text-sm text-red-400 border border-red-400/30 bg-red-400/10 px-4 py-3">
                    {aiError}
                  </p>
                ) : analysis && (
                  <>
                    {/* Score bar */}
                    <div className="border border-[#1E1E2E] bg-[#0A0A0F] p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-white/50">// quality score</span>
                        <span
                          className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 border"
                          style={{
                            color: verdictColor[analysis.verdict] ?? "#fff",
                            borderColor: verdictColor[analysis.verdict] ?? "#fff",
                            backgroundColor: `${verdictColor[analysis.verdict] ?? "#fff"}18`,
                          }}
                        >
                          {analysis.verdict}
                        </span>
                      </div>

                      <div className="flex items-end gap-3">
                        <span
                          className="text-5xl font-bold tabular-nums"
                          style={{ color: verdictColor[analysis.verdict] ?? "#fff" }}
                        >
                          {analysis.score}
                        </span>
                        <span className="mb-1 text-lg text-white/40">/100</span>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1 w-full bg-[#1E1E2E]">
                        <div
                          className="h-1 transition-all duration-700"
                          style={{
                            width: `${analysis.score}%`,
                            backgroundColor: verdictColor[analysis.verdict] ?? "#fff",
                          }}
                        />
                      </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-white/50">// remarks</p>
                      {analysis.remarks.map((remark : any, i : any) => (
                        <div key={i} className="flex items-start gap-3 border border-[#1E1E2E] px-4 py-3">
                          <span className="mt-0.5 text-[#22C55E] text-xs">▸</span>
                          <span className="text-sm text-white/80 leading-relaxed">{remark}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep("form")}
                    className="flex-1 border border-[#1E1E2E] px-4 py-3 text-xs uppercase tracking-wider text-white/60 hover:border-white hover:text-white transition-colors"
                  >
                    ← Edit
                  </button>
                  <button
                    onClick={handleConfirmPublish}
                    className="flex-1 border border-[#22C55E] bg-[#22C55E]/10 px-4 py-3 text-xs text-[#22C55E] uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors"
                  >
                    Confirm &amp; Publish
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
