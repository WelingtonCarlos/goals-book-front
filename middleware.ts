import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  console.log("token", token);

  const { pathname } = request.nextUrl;

  // Usuário autenticado: bloqueia acesso às rotas de sign-in e sign-up
  if (token && (pathname === "/sign-in" || pathname === "/sign-up")) {
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Usuário não autenticado: bloqueia acesso à rota "/"
  if (!token && pathname === "/") {
    const redirectUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Permite outras rotas normalmente
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up"], // Especifica as rotas que o middleware deve proteger
};
