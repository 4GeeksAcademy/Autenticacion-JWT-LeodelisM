const TOKEN_KEY = "token";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

async function login(email, password) {

  const response = await fetch(`${backendUrl}/api/auth/login`, {
    method: "post",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  localStorage.setItem(TOKEN_KEY, result.token);
  return true;
}

async function sign_up(name, email, password) {

  const response = await fetch(`${backendUrl}/api/auth/signup`, {
    method: "post",
    body: JSON.stringify({ name, email, password}),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
  }

 
export default {
  login,
  sign_up,
};
