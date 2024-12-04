interface SignInUserRequest {
  email: string;
  password: string;
}

interface SignInUserResponse {
  access_token: string;
}

export async function signInUser({
  email,
  password,
}: SignInUserRequest): Promise<SignInUserResponse> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  if (!BASE_URL) {
    throw new Error("A variável NEXT_PUBLIC_BASE_URL não está definida.");
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      // Extrai os detalhes do erro do corpo da resposta
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao fazer login");
    }

    // Processa o JSON com o token
    const data: SignInUserResponse = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Erro desconhecido");
  }
}
