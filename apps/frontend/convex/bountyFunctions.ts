
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createBounty = mutation({
  args: { 
    title: v.string(),
    description: v.string(),
    amount: v.number(),
    unit: v.string(),
    endDate: v.any(),
    bountySetter: v.id("users"),
   },
  handler: async (ctx, args) => {
    const BountyId = await ctx.db.insert("bounty", { ...args, bountyStatus: "active", amountStatus: "pending"});
    return BountyId;
  },
});

export const createSolution = mutation({
  args: {
    bountyId: v.id("bounty"),
    hunterId: v.id("users"),
    proof: v.any(),
    score : v.number(),
    remarks : v.string(),
  },
  handler: async (ctx, args) => {
    const solutionId = await ctx.db.insert("solutions", { bountyId: args.bountyId, hunterId: args.hunterId, proof: args.proof, status: "submitted", score: args.score, remarks: args.remarks });
    return solutionId;
  },
});