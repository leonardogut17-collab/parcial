import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colores } from "@/constants/colores";

type Props = {
  texto: string;
  alPresionar: () => void;
  icono?: keyof typeof Ionicons.glyphMap;
  tipo?: "principal" | "suave" | "peligro";
  deshabilitado?: boolean;
};

// Botón de la app. Tiene tres estilos: principal, suave y peligro
export default function Boton({ texto, alPresionar, icono, tipo = "principal", deshabilitado }: Props) {
  let fondo = colores.principal;
  let letra = colores.blanco;

  if (tipo === "suave") {
    fondo = colores.principalClaro;
    letra = colores.principalOscuro;
  }
  if (tipo === "peligro") {
    fondo = colores.rojoClaro;
    letra = colores.rojo;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={texto}
      disabled={deshabilitado}
      onPress={alPresionar}
      // En Android se muestra el efecto "ripple" al tocar
      android_ripple={{ color: "rgba(0,0,0,0.12)" }}
      style={({ pressed }) => [
        estilos.boton,
        {
          backgroundColor: fondo,
          // En iOS el botón se aclara un poco al tocarlo
          opacity: deshabilitado ? 0.5 : Platform.OS === "ios" && pressed ? 0.7 : 1,
        },
      ]}
    >
      {icono && <Ionicons name={icono} size={20} color={letra} />}
      <Text style={[estilos.texto, { color: letra }]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    overflow: "hidden",
  },
  texto: { fontSize: 16, fontWeight: "700" },
});
