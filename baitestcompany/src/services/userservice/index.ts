const API_URL = "https://companytest.onrender.com/auth/"; // đổi thành URL backend của bạn

// Login
export const login = async (username: string, password: string) => {
  const res = await fetch(`${API_URL}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json(); // ServiceResponse
};

// Register
export const register = async (user: {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}) => {
  const res = await fetch(`${API_URL}register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json();
};

// Logout
export const logout = async (token: string) => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json();
};
