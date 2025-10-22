import ErrorLayout from "./ErrorLayout";

export default function Error404() {
  return (
    <ErrorLayout
      code={404}
      title="Página no encontrada"
      message="Parece que el electrodo se perdió en el taller. No pudimos encontrar lo que buscabas."
    />
  );
}
