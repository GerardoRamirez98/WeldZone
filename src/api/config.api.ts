const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getMaintenance(): Promise<boolean> {
  const res = await fetch(`${API_URL}/config/mantenimiento`);
  if (!res.ok) throw new Error("Error al obtener estado de mantenimiento");
  const data = await res.json();
  return data.mantenimiento;
}

export async function setMaintenance(mantenimiento: boolean): Promise<void> {
  const res = await fetch(`${API_URL}/config/mantenimiento`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mantenimiento }),
  });
  if (!res.ok) throw new Error("Error al actualizar modo mantenimiento");
}
