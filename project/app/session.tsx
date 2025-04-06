import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export async function getSession() {
  const session = await getServerSession(options);
  return session;
}
