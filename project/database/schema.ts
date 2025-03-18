import { integer, pgTable, varchar, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 255 }).notNull().unique(),
  address: varchar({ length: 255 }),
  phone: varchar({ length: 255 }),
  city: varchar({ length: 255 }),
  state: varchar({ length: 255 }),
  postal: varchar({ length: 255 }),
  country: varchar({ length: 255 }),
  isVerified: boolean("is_verified").default(false).notNull(),

});


