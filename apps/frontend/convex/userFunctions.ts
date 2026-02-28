import { mutation } from "./_generated/server";
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