import ErrorLayout from "./ErrorLayout";

export default function Error500() {
  return (
    <ErrorLayout
      code={500}
      title="Error interno del servidor"
      message="Algo se sobrecalentó en el sistema. Estamos trabajando para repararlo."
    />
  );
}
