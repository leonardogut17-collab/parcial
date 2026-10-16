import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "expo-router";
import Aviso from "@/components/Aviso";
import Burbuja from "@/components/Burbuja";
import Encabezado from "@/components/Encabezado";
import Tarjeta from "@/components/Tarjeta";
import { useNivel } from "@/hooks/useNivel";
import { aGrados, estaNivelado } from "@/utils/nivel";
import { vibrarSuave } from "@/utils/sistema";
import { colores } from "@/constants/colores";

// Pantalla del sensor: nivel de burbuja con el acelerómetro
export default function Nivel() {
  const pestanaActiva = useIsFocused();
  const { disponible, inclinacion } = useNivel(pestanaActiva);
  const nivelado = estaNivelado(inclinacion);
  const estabaNivelado = useRef(false);

  // Cuando el celular queda nivelado vibra una vez
  useEffect(() => {
    if (nivelado && !estabaNivelado.current) {
      vibrarSuave();
    }
    estabaNivelado.current = nivelado;
  }, [nivelado]);

  return (
    <View style={estilos.contenedor}>
      <Encabezado titulo="Nivel" subtitulo="Apoya el teléfono boca arriba sobre una superficie." />
      <View style={estilos.cuerpo}>
        {disponible === false ? (
          <Aviso
            titulo="Sensor no disponible"
            tipo="error"
            mensaje="Este dispositivo no tiene acelerómetro o el sistema no lo permite (por ejemplo, en un emulador de iOS)."
          />
        ) : (
          <>
            <Burbuja inclinacion={inclinacion} />
            <Tarjeta>
              <Text style={[estilos.estado, nivelado && { color: colores.verde }]}>
                {nivelado ? "¡Nivelado!" : "Inclinado"}
              </Text>
              <View style={estilos.fila}>
                <Text style={estilos.eje}>X: {aGrados(inclinacion.x).toFixed(1)}°</Text>
                <Text style={estilos.eje}>Y: {aGrados(inclinacion.y).toFixed(1)}°</Text>
              </View>
            </Tarjeta>
          </>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  cuerpo: { flex: 1, padding: 16, gap: 24, justifyContent: "center" },
  estado: { fontSize: 22, fontWeight: "800", color: colores.texto, textAlign: "center" },
  fila: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 },
  eje: { fontSize: 16, color: colores.textoSuave },
});
