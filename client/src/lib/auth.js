
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function sendAuthRequest(endpoint, formData) {
  const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export async function registerUser(formData) {
  return sendAuthRequest("register", formData);
}

export async function loginUser(formData) {
  const data = await sendAuthRequest("login", formData);

  if (!data.token || !data.user) {
    throw new Error("Invalid login response from server.");
  }

  localStorage.setItem("homebite-token", data.token);
  localStorage.setItem("homebite-user", JSON.stringify(data.user));

  window.dispatchEvent(new Event("homebite-auth-changed"));

  return data;
}
