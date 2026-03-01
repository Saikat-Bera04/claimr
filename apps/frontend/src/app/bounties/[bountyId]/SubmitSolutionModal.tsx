// src/app/bounties/[bountyId]/SubmitSolutionModal.tsx
"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { evaluateProof } from "../evaluateSolution";

interface SubmitSolutionProps {
  bountyId: Id<"bounty">;
  bountyTitle: string;
  bountyDescription: string;
  userEmail?: string | null;
}

type Step = "input" | "evaluating" | "success";

export default function SubmitSolutionModal({
  bountyId,
  bountyTitle,
  bountyDescription,
  userEmail,
}: SubmitSolutionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("input");
  const [proof, setProof] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get the user ID from Convex
  const user = useQuery(
    api.userFunctions.getUserDetails,
    userEmail ? { email: userEmail } : "skip"
  );
  
  const createSolution = useMutation(api.bountyFunctions.createSolution);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!proof.trim()) return;

    if (!userEmail || user === null) {
      setError("Authentication required. Please log in.");
      return;
    }

    if (user === undefined) return; // Still loading

    setStep("evaluating");
    setError(null);

    try {
      // 1. Run AI Evaluation
      const aiResult = await evaluateProof(
        { title: bountyTitle, description: bountyDescription },
        proof
      );

      // 2. Save to Database
      await createSolution({
        bountyId,
        hunterId: user._id,
        proof,
        score: aiResult.score,
        remarks: aiResult.remarks,
      });

      // 3. Show Success
      setStep("success");
    } catch (err: any) {
      console.error(err);
      setError("Secure channel disrupted. AI evaluation failed. Try again.");
      setStep("input");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full border border-[#22C55E] bg-[#22C55E]/10 px-6 py-4 text-sm font-bold text-[#22C55E] uppercase tracking-widest hover:bg-[#22C55E] hover:text-black transition-colors"
      >
        [ Submit_Solution ]
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg border border-[#1E1E2E] bg-black shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E1E2E] px-8 py-5">
              <h2 className="text-xl font-bold uppercase tracking-widest text-white">
                Submit <span className="text-[#22C55E]">Proof</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-8 py-6">
              {step === "input" && (
                <form className="space-y-4">
                  {error && (
                    <p className="text-xs text-red-400 border border-red-400/30 bg-red-400/10 px-4 py-3">
                      {error}
                    </p>
                  )}
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                      Proof of Work (Link or Text)
                    </label>
                    <textarea
                      value={proof}
                      onChange={(e) => setProof(e.target.value)}
                      rows={5}
                      className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors resize-none"
                      placeholder="https://github.com/your-repo/pull/123&#10;or explain your solution..."
                      required
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={user === undefined}
                    className="w-full border border-[#22C55E] bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E] uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors disabled:opacity-50"
                  >
                    Transmit to AI Evaluator
                  </button>
                </form>
              )}

              {step === "evaluating" && (
                <div className="flex flex-col items-center gap-6 py-12">
                  <div className="h-10 w-10 animate-spin border-2 border-[#1E1E2E] border-t-[#22C55E] rounded-full" />
                  <p className="text-sm uppercase tracking-widest text-white/60">
                    // AI analyzing proof signature...
                  </p>
                </div>
              )}

              {step === "success" && (
                <div className="flex flex-col items-center text-center gap-4 py-8">
                  <div className="text-4xl text-[#22C55E]">✓</div>
                  <div>
                    <p className="text-lg font-bold text-white uppercase tracking-widest mb-1">
                      Transmission Successful
                    </p>
                    <p className="text-sm text-white/50">
                      Your solution has been scored and secured on the network.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-4 border border-[#1E1E2E] px-6 py-2 text-xs uppercase tracking-widest hover:border-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}