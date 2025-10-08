import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import bgImage from "../assets/welder-bg.png"; // ✅ Imagen lateral
import logo from "../assets/logo-light.png"; // ✅ Logo dentro del form

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://weldzone-backend-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!res.ok) throw new Error("Usuario o contraseña incorrectos");

      const data: { access_token: string } = await res.json();
      await login(data.access_token);
      navigate("/admin");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* 🧰 Sección Izquierda - Formulario */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center relative px-8 py-16 bg-gradient-to-br from-zinc-950 to-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(250,204,21,0.05),transparent_70%)] pointer-events-none" />

        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-zinc-900/70 backdrop-blur-lg border border-yellow-500/30 p-10 rounded-2xl shadow-[0_0_35px_rgba(250,204,21,0.15)] space-y-6"
        >
          {/* 🔥 Logo */}
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="WeldZone"
              className="w-40 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
            />
          </div>

          {/* ⚠️ Error */}
          {error && (
            <p className="text-red-400 text-center bg-red-900/40 py-2 rounded-lg border border-red-500/30">
              {error}
            </p>
          )}

          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none placeholder-zinc-500"
              placeholder="Tu usuario"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none placeholder-zinc-500"
              placeholder="********"
              required
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:shadow-[0_0_25px_rgba(250,204,21,0.7)]"
          >
            Acceder al panel
          </button>
        </form>

        <p className="text-xs text-zinc-600 mt-6">
          © {new Date().getFullYear()} WeldZone — Potencia para el soldador ⚡
        </p>
      </div>

      {/* 🔥 Sección Derecha - Imagen con texto */}
      <div
        className="hidden md:flex w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Capa oscura con degradado */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-zinc-950/80 to-yellow-900/20" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-12">
          <h2 className="text-4xl font-extrabold text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.7)]">
            Control total de tu negocio ⚙️
          </h2>
          <p className="text-lg max-w-md text-zinc-300">
            Gestiona productos, monitorea y administra desde un solo panel.{" "}
            <br /> Tu taller, tu control, tu potencia.
          </p>
        </div>
      </div>
    </div>
  );
}
