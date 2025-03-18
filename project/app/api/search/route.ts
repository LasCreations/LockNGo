// app/api/search/route.ts
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-serverless"; // Use the serverless version
import { neon, neonConfig } from "@neondatabase/serverless"; // Correct Neon client
import { eq } from "drizzle-orm";
import { usersTable } from "@/database/schema"; // Ensure this import is correct



const db = drizzle(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const singleUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);
    if (singleUser.length === 0) {
      return NextResponse.json({
            message: "User not found",
            user: singleUser[0],
        }, { status: 404 });
    }

    return NextResponse.json(singleUser[0]);
    
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "An error occurred while searching for the user" },
      { status: 500 }
    );
  }
}

