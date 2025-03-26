// app/api/search/route.ts
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-serverless"; // Use the serverless version
import { neon, neonConfig } from "@neondatabase/serverless"; // Correct Neon client
import { eq } from "drizzle-orm";
import { contractTable } from "@/database/schema"; 



const db = drizzle(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contractId = searchParams.get("contractId");
  const buyer = searchParams.get("buyer");
  const seller = searchParams.get("seller");
  const details = searchParams.get("details");
  const status = "Pending Confirmation";


  if (!contractId || !buyer ) {
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

