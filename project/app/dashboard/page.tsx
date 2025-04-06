import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import UserCard from "@/app/components/UserCard";
import { redirect } from "next/navigation"; // Use redirect() for SSR
import Navbar from "@/app/components/Navbar";
import ToastNotification from "@/app/components/ToastNotification";
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

import { Button } from "@/components/ui/button"
import { usersTable } from '@/database/schema';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,

} from "@/components/ui/avatar"




const db = drizzle(process.env.DATABASE_URL!);

export default async function Home() {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/"); // Redirect on the server side
  }


  const singleUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, session.user.email))
    .limit(1);


  if (!singleUser || singleUser.length === 0) {
    redirect("/signup"); // Redirect on the server side
  } 



return (
  <div>
    <ToastNotification />
  </div>
);

 
}



