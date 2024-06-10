import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware({ debug: true });

export const config = { matcher: ["/", "/deck/:path*"] };
