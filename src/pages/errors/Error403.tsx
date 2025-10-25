import ErrorLayout from "./ErrorLayout";

export default function Error403() {
  return (
    <ErrorLayout
      code={403}
      title="Acceso denegado"
      message="No tienes permisos para ver esta sección. Si crees que es un error, contacta al administrador."
    />
  );
}

