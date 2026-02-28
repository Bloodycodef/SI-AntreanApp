import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export const RegisterPage = () => {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user" as "user" | "company",
    companyName: "",
    industry: "",
    website: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // Prepare payload
      const payload =
        form.role === "company"
          ? form
          : {
              email: form.email,
              password: form.password,
              role: "user",
            };

      await register(payload);

      // Redirect to login after successful registration
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="company">Company</option>
        </select>

        {form.role === "company" && (
          <>
            <input
              name="companyName"
              placeholder="Company Name"
              value={form.companyName}
              onChange={handleChange}
              required
            />

            <input
              name="industry"
              placeholder="Industry"
              value={form.industry}
              onChange={handleChange}
              required
            />

            <input
              name="website"
              placeholder="Website"
              value={form.website}
              onChange={handleChange}
            />

            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};
