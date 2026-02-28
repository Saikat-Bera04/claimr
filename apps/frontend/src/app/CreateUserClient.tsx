"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type User = {
  name?: string | null;
  email?: string | null;
};

export default function CreateUserClient({ user }: { user?: User | null }) {
  const createUser = useMutation(api.userFunctions.createUser);

  useEffect(() => {
    if (!user || !user.email) return;

    // Fire-and-forget: create user record if needed. Errors are logged to console.
    (async () => {
      try {
        const email = user.email ?? "";
        const name = user.name ?? "";
        if (!email) return;
        await createUser({ name, email });
      } catch (err) {
        console.error("CreateUserClient: failed to create user", err);
      }
    })();
  }, [user, createUser]);

  return null;
}
