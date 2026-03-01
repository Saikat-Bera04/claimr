
import { mutation, query } from "./_generated/server";
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
    // 1. Fetch the user setting the bounty
    const setter = await ctx.db.get(args.bountySetter);
    if (!setter) throw new Error("Setter not found");

    const currentTokens = setter.TotalTokens || 0;

    // 2. Check if they have enough tokens to fund it
    if (currentTokens < args.amount) {
      throw new Error("Insufficient tokens to fund this bounty.");
    }

    // 3. Deduct tokens from setter's balance
    await ctx.db.patch(setter._id, { 
      TotalTokens: currentTokens - args.amount 
    });

    // 4. Create the bounty with the funds locked in escrow
    const BountyId = await ctx.db.insert("bounty", { 
      ...args, 
      escrowAmount: args.amount, // Lock the funds here
      bountyStatus: "active", 
      amountStatus: "escrowed"   // Mark as safely held
    });

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

export const getBountyDetailsAfterEnd = query({
  args: {
    bountyId: v.id("bounty"),
  },
  handler: async (ctx, args) => {
    const bountyDetails = await ctx.db
      .query("bounty")
      .filter((q) => q.eq(q.field("_id"), args.bountyId))
      .first();

    if (!bountyDetails) {
      return null;
    }

    const solutions = await ctx.db
      .query("solutions")
      .withIndex("by_bounty", (q) => q.eq("bountyId", args.bountyId))
      .collect(
      );

    const selectedSolution = solutions.find((solution) => solution.status === "selected");

    return {
      ...bountyDetails,
      solutions,
      selectedSolution,
    };
  },
});


export const getBountyDetails = query({
  args: {
    bountyId: v.id("bounty"),
  },
  handler: async (ctx, args) => {
    // Instant, optimized lookup by ID
    const bountyDetails = await ctx.db.get(args.bountyId);
    
    if (!bountyDetails) {
      return null;
    }
    return bountyDetails;   
  }
});

// convex/bountyFunctions.ts

export const getAllBounties = query({
  handler: async (ctx) => {
    // Fetches all bounties, newest first
    return await ctx.db.query("bounty").order("desc").collect();
  },
});



export const acceptSolution = mutation({
  args: {
    solutionId: v.id("solutions"),
  },
  handler: async (ctx, args) => {
    // 1. Get all the records we need
    const solution = await ctx.db.get(args.solutionId);
    if (!solution) throw new Error("Solution not found");

    const bounty = await ctx.db.get(solution.bountyId);
    if (!bounty) throw new Error("Bounty not found");
    
    // Prevent double-paying if clicked twice
    if (bounty.bountyStatus === "closed") {
      throw new Error("Bounty is already closed and paid out.");
    }

    const hunter = await ctx.db.get(solution.hunterId);
    if (!hunter) throw new Error("Hunter not found");

    const escrow = bounty.escrowAmount || 0;
    const currentHunterTokens = hunter.TotalTokens || 0;

    // 2. Transfer tokens to the Hunter
    await ctx.db.patch(hunter._id, {
      TotalTokens: currentHunterTokens + escrow
    });

    // 3. Close the Bounty and zero out the escrow
    await ctx.db.patch(bounty._id, {
      escrowAmount: 0,
      amountStatus: "released",
      bountyStatus: "closed",
      bountyHunter: hunter._id // Mark who won it
    });

    // 4. Mark the specific solution as selected
    await ctx.db.patch(solution._id, {
      status: "selected"
    });

    return bounty._id;
  },
});

// ── 3. NEW: GET RANKINGS (Leaderboard) ──
export const getRankings = query({
  handler: async (ctx) => {
    // Fetch all users
    const allUsers = await ctx.db.query("users").collect();

    // Sort them in memory by TotalTokens (highest to lowest)
    const sortedUsers = allUsers.sort((a, b) => {
      const tokensA = a.TotalTokens || 0;
      const tokensB = b.TotalTokens || 0;
      return tokensB - tokensA; // Descending order
    });

    // Return the top 50 hackers
    return sortedUsers.slice(0, 50);
  }
});