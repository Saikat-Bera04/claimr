"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

export default function UpliftBountyModal( email : {email : string}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    unit: "USDC",
    endDate: "",
  });


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
    setIsOpen(false);
  };

  const handleAISubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    // Logic to submit to AI then globally
    console.log("Submitting to AI then Globally:", formData);
    setIsOpen(false);
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
          <div className="w-full max-w-lg border border-[#1E1E2E] bg-black p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-white">
                Uplift <span className="text-[#22C55E]">Bounty</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors"
                  placeholder="e.g. Implement Zero-Knowledge Proofs"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors resize-none"
                  placeholder="Explain the requirements..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors"
                    placeholder="e.g. 500"
                    required
                  />
                </div>
                <div className="w-1/3">
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
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
                <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors [color-scheme:dark]"
                  required
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 pt-4">
                <button
                  onClick={handleGlobalSubmit}
                  className="w-full border border-white px-4 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                >
                  Submit Globally
                </button>
                <button
                  onClick={handleAISubmit}
                  className="w-full border border-[#22C55E] bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E] uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                  Submit to AI then Globally
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
