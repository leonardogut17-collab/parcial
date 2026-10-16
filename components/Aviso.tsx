import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colores } from "@/constants/colores";

type Props = {
  titulo: string;
  mensaje?: string;
  tipo?: "info" | "alerta" | "error";
  children?: ReactNode;
};

// Recuadro de color para dar mensajes al usuario (permisos, errores, etc.)
export default function Aviso({ titulo, mensaje, tipo = "info", children }: Props) {
  let fondo = colores.principalClaro;
  if (tipo === "alerta") fondo = colores.amarilloClaro;
  if (tipo === "error") fondo = colores.rojoClaro;

  return (
    <View style={[estilos.aviso, { backgroundColor: fondo }]}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {mensaje ? <Text style={estilos.mensaje}>{mensaje}</Text> : null}
      {children ? <View style={{ marginTop: 16 }}>{children}</View> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: { borderRadius: 16, padding: 16 },
  titulo: { fontSize: 16, fontWeight: "700", color: colores.texto },
  mensaje: { fontSize: 14, lineHeight: 20, color: colores.textoSuave, marginTop: 4 },
});
