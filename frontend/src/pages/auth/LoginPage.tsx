import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export const LoginPage = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      if (response.user.role === "company") {
        navigate("/company/dashboard");
      } else {
        navigate("/users/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
};
