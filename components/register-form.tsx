"use client";

import { useRouter } from "next/navigation";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast"; // Certifique-se de ter este hook
import { createUser } from "@/libs/api/user";

const createUserForm = z
  .object({
    name: z.string().min(1, "Informe o seu Nome"),
    email: z.string().email("Informe um email válido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type CreateUserForm = z.infer<typeof createUserForm>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, formState, reset } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserForm),
  });

  async function handleCreateUser(data: CreateUserForm) {
    try {
      const response = await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.status === 201) {
        toast({
          title: "Usuário criado com sucesso!",
          description: "Você será redirecionado para a página de login.",
        });

        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);

        reset();
      } else {
        throw new Error("Erro ao criar usuário");
      }
    } catch (error: any) {
      console.log(error);
      
      toast({
        title: "Erro ao criar usuário",
        description: "Email já cadastrado.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Criar Conta</CardTitle>
        <CardDescription>
          Digite seu e-mail abaixo para fazer login em sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleCreateUser)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jhon Doe"
                {...register("name")}
              />
              {formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                {...register("password")}
              />
              {formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirme sua senha"
                {...register("confirmPassword")}
              />
              {formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? "Criando..." : "Criar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
