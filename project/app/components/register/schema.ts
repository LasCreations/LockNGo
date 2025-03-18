// schema.ts

import { z } from 'zod';


export const registerSchema = z.object({

  name: z.string().min(2, {
    message: "Name must be at least 2 characters and no more than 50.",
  }).max(50),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters and no more than 50.",
  }).max(50),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),

  phone: z.string(),
  city: z.string(),
  state: z.string(),
  postal: z.string(),
  country: z.string(),
});
