import { Redirect } from "expo-router";

// Si el usuario entra a una ruta que no existe, lo mandamos al inicio
export default function NoEncontrada() {
  return <Redirect href="/" />;
}
