import { StyleSheet, Text, View } from "react-native";
import { colores } from "@/constants/colores";

type Props = {
  texto: string;
  // true = verde, false = rojo, null = gris (todavía cargando)
  activo: boolean | null;
};

// Etiqueta pequeña con un punto de color. Se usa para mostrar el estado de los permisos
export default function Etiqueta({ texto, activo }: Props) {
  let fondo = colores.borde;
  let color = colores.textoSuave;
  if (activo === true) {
    fondo = colores.verdeClaro;
    color = colores.verde;
  }
  if (activo === false) {
    fondo = colores.rojoClaro;
    color = colores.rojo;
  }

  return (
    <View style={[estilos.etiqueta, { backgroundColor: fondo }]}>
      <View style={[estilos.punto, { backgroundColor: color }]} />
      <Text style={[estilos.texto, { color: color }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  punto: { width: 8, height: 8, borderRadius: 4 },
  texto: { fontSize: 13, fontWeight: "600" },
});
