import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: { 
    name: v.string(),
    email: v.string(),
   },
  handler: async (ctx, args) => {
    const newId = await ctx.db.insert("users", { name: args.name, email: args.email });
    return newId;
  },
});

export const getUserDetails = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userDetails = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!userDetails) {
      return null;
    }

    const bountiesGiven = await ctx.db
      .query("bounty")
      .withIndex("by_setter", (q) => q.eq("bountySetter", userDetails._id))
      .collect();

    
    const bountiesSolved = await ctx.db
      .query("bounty")
      .withIndex("by_hunter", (q) => q.eq("bountyHunter", userDetails._id))
      .collect();

    return {
      ...userDetails,
      bountiesGiven,
      bountiesSolved,
    };
  },
});