import { Platform, StyleSheet, Text, View } from "react-native";
import { colores } from "@/constants/colores";

type Props = {
  titulo: string;
  subtitulo?: string;
};

// Parte de arriba de cada pantalla (fondo azul oscuro con título)
export default function Encabezado({ titulo, subtitulo }: Props) {
  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  encabezado: {
    backgroundColor: colores.azulOscuro,
    // En iOS se deja más espacio arriba por la barra de estado y el notch
    paddingTop: Platform.select({ ios: 64, android: 48, default: 32 }),
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titulo: { color: colores.blanco, fontSize: 26, fontWeight: "800" },
  subtitulo: { color: "#B8CBD6", fontSize: 14, marginTop: 4, lineHeight: 20 },
});
