import { get, put } from "./base";

export async function getMaintenance(): Promise<boolean> {
  const data = await get<{ mantenimiento: boolean }>(
    `/config/mantenimiento`
  );
  return data.mantenimiento;
}

export async function setMaintenance(mantenimiento: boolean): Promise<void> {
  await put<void>(`/config/mantenimiento`, { mantenimiento });
}

