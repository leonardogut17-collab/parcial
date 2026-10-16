import { StyleSheet, View } from "react-native";
import { colores } from "@/constants/colores";
import { Inclinacion, estaNivelado, posicionBurbuja } from "@/utils/nivel";

const TAMANO = 280; // tamaño del círculo grande
const TAMANO_BURBUJA = 56; // tamaño de la burbuja

// Dibuja el nivel: un círculo con una burbuja que se mueve según la inclinación
export default function Burbuja({ inclinacion }: { inclinacion: Inclinacion }) {
  const nivelado = estaNivelado(inclinacion);
  const radioMaximo = (TAMANO - TAMANO_BURBUJA) / 2 - 6;
  const posicion = posicionBurbuja(inclinacion, radioMaximo);

  return (
    <View style={[estilos.circulo, nivelado && { borderColor: colores.verde }]}>
      <View style={[estilos.anillo, { width: TAMANO * 0.66, height: TAMANO * 0.66 }]} />
      <View style={[estilos.anillo, { width: TAMANO * 0.33, height: TAMANO * 0.33 }]} />
      <View style={[estilos.linea, { width: TAMANO, height: 1 }]} />
      <View style={[estilos.linea, { width: 1, height: TAMANO }]} />
      <View
        style={[
          estilos.burbuja,
          {
            backgroundColor: nivelado ? colores.verde : colores.naranja,
            transform: [{ translateX: posicion.x }, { translateY: posicion.y }],
          },
        ]}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  circulo: {
    width: TAMANO,
    height: TAMANO,
    borderRadius: TAMANO / 2,
    borderWidth: 4,
    borderColor: colores.azulOscuro,
    backgroundColor: colores.blanco,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  anillo: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colores.borde,
  },
  linea: { position: "absolute", backgroundColor: colores.borde },
  burbuja: {
    width: TAMANO_BURBUJA,
    height: TAMANO_BURBUJA,
    borderRadius: TAMANO_BURBUJA / 2,
    opacity: 0.92,
  },
});
