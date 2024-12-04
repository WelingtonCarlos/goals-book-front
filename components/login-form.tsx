"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { signInUser } from "@/libs/api/auth";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const signInUserForm = z.object({
  email: z.string().email("Informe um email válido!"),
  password: z.string().min(1, "Informe a senha!"),
});

type SignInUserForm = z.infer<typeof signInUserForm>;

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const { register, handleSubmit, formState, reset } = useForm<SignInUserForm>({
    resolver: zodResolver(signInUserForm),
  });

  async function handleSignInUser(data: SignInUserForm) {
    try {
      const { access_token } = await signInUser({
        email: data.email,
        password: data.password,
      });

      const secret_key = process.env.NEXT_PUBLIC_SECRET_ACCESS_TOKEN;

      if (!secret_key) {
        throw new Error(
          "A variável NEXT_PUBLIC_SECRET_ACCESS_TOKEN não está definida."
        );
      }

      const encryptedToken = CryptoJS.AES.encrypt(
        access_token,
        secret_key
      ).toString();

      Cookies.set("auth_token", encryptedToken, { expires: 1 });

      toast({
        title: "Usuário logado com sucesso!",
        description: "Você será redirecionado para a página inicial.",
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);

      reset();
    } catch (error: any) {
      console.log(error);

      toast({
        title: "Erro ao entrar",
        description: error.message || "Erro desconhecido.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Digite seu e-mail abaixo para fazer login em sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleSignInUser)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
              {formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                Esqueceu sua senha?
              </Link> */}
              </div>
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
              />
              {formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Ainda não tem uma conta?{" "}
          <Link href="sign-up" className="underline">
            Inscreva-se
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
