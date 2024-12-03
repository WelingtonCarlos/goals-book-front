interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export async function createUser({ name, email, password }: CreateUserRequest) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  if (!BASE_URL) {
    throw new Error("A variável NEXT_PUBLIC_BASE_URL não está definida.");
  }

  try {
    const response = await fetch(`${BASE_URL}/user/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao criar usuário");
    }

    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro desconhecido"
    );
  }
}
