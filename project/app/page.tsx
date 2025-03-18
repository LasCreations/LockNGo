import Link from 'next/link';
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

export default async function Home() {
  const session = await getServerSession(options);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Link href="/recaptcha" className="text-blue-500 hover:underline">
        Sign In
      </Link>
    </div>
  );
}

