'use server'; // action.ts


import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';
import { registerSchema } from './schema';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { usersTable } from '@/database/schema';
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import UserCard from "@/app/components/UserCard";

const db = drizzle(process.env.DATABASE_URL!);

export async function register(prevState: unknown, formData: FormData) {
  
  const session = await getServerSession(options);

  const submission = parseWithZod(formData, {
    schema: registerSchema,
  });

  const user: typeof usersTable.$inferInsert = {
    name:formData.get("name"),
    email: session.user.email,
    username: formData.get("username"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    state: formData.get("state"),
    postal: formData.get("postal"),
    country: formData.get("country"),
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!')
  console.log(formData.get("name"));

  if (submission.status !== 'success') {
    return submission.reply();
  }

  redirect('/dashboard');
}
