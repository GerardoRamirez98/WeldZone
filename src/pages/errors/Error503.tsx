import ErrorLayout from "./ErrorLayout";

export default function Error503() {
  return (
    <ErrorLayout
      code={503}
      title="Estamos en mantenimiento"
      message="Estamos soldando nuevas mejoras para ti. El sitio volverá a funcionar en breve."
    />
  );
}
