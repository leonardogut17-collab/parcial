import { Platform } from "react-native";

// Colores que usa toda la aplicación (así se ven iguales en todas las pantallas)
export const colores = {
  azulOscuro: "#0E2433",
  fondo: "#F1F5F7",
  blanco: "#FFFFFF",
  borde: "#DCE5EA",
  texto: "#0E2433",
  textoSuave: "#566B78",
  principal: "#1F8A82",
  principalClaro: "#DDF1EE",
  principalOscuro: "#16665F",
  naranja: "#F2A33A",
  rojo: "#B93D32",
  rojoClaro: "#FBE7E4",
  verde: "#1D8553",
  verdeClaro: "#DCF3E7",
  amarilloClaro: "#FDF1DC",
};

// Separaciones que se repiten en las pantallas
export const espacio = { chico: 8, medio: 16, grande: 24 };

// En iOS la sombra se hace con shadow..., en Android con elevation
export const sombra = Platform.select({
  ios: {
    shadowColor: "#0E2433",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  android: { elevation: 3 },
  default: {},
});
