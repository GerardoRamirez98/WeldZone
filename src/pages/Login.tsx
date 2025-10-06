import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // 🌐 URL base desde variable de entorno o localhost por defecto
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 🔑 1. Autenticación
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Usuario o contraseña incorrectos");

      const data: { access_token: string } = await res.json();

      // ✅ Guardar token en el contexto
      await login(data.access_token);

      // 👤 2. Obtener perfil del usuario
      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      if (!meRes.ok)
        throw new Error("No se pudo obtener el perfil del usuario");

      const userData: { user: { username: string; role: string } } =
        await meRes.json();
      console.log("✅ Usuario autenticado:", userData.user);

      // 🚀 3. Redirigir al panel admin
      navigate("/admin");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-emerald-600">
          🔐 Iniciar Sesión
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-200">
            Usuario
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Tu usuario"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-200">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
