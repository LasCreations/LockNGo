//Without a defined matxher, this one line applies next-auth to entire project
export {default} from 'next-auth/middleware'

// app/middleware.ts (or app/middleware.js)
import { withAuth } from 'next-auth/middleware';


//apply next-auth only yo matching routes
export const config = {matcher: ["/image", "/dashboard", "/signup"]}

