const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

async function login(email, password) {
  try {
    // Validación
    if (!email || !password) {
      throw new Error("Email y contraseña son requeridos");
    }

    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // Verificar que el token existe en la respuesta
    if (!result.token) {
      throw new Error("La respuesta del servidor no contiene un token");
    }

    return {
      token: result.token,
      user: result.user,
    };

    
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error.message);
    throw error;
  }
}

async function signUp(name, email, password) {
  const response = await fetch(`${backendUrl}/api/auth/signup`, {
    method: "post",
    body: JSON.stringify({ name, email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

export default {
  login,
  signUp,
};
