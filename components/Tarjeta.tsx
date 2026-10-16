import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colores, sombra } from "@/constants/colores";

// Caja blanca con bordes redondeados donde se muestra la información
export default function Tarjeta({ children }: { children: ReactNode }) {
  return <View style={estilos.tarjeta}>{children}</View>;
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.blanco,
    borderRadius: 16,
    padding: 16,
    ...sombra,
  },
});
