import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
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

  // If no user is found, kick them back to login
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Pass the authorized user to the interactive client component
  return <DashboardClient sessionUser={session.user} />;
}