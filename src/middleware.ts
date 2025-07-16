
import { auth } from "@/auth"

const authPages = ["/login", "/register", '/forgot-password', '/reset-password', '/verify']
const apiAuthPrefix = "/api/auth"

export default auth((req) => {
    const {nextUrl} = req
    const isAuthenticated = !!req.auth?.user

    const isAuthPage  = authPages.includes(nextUrl.pathname)
    const isApiAuth = nextUrl.pathname.startsWith(apiAuthPrefix)

    if (isApiAuth) {
        return null
    }

    if(isAuthPage) {
        if (isAuthenticated) {
            return Response.redirect(new URL("/", nextUrl))
        }
        return null
    }

    if(!isAuthenticated) {
        return Response.redirect(new URL("/login", nextUrl))
    }

    return null
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}