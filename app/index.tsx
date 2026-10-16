import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { useForegroundPermissions } from "expo-location";
import { Accelerometer } from "expo-sensors";
import Boton from "@/components/Boton";
import Encabezado from "@/components/Encabezado";
import Etiqueta from "@/components/Etiqueta";
import Tarjeta from "@/components/Tarjeta";
import { useLugares } from "@/context/LugaresContext";
import { colores } from "@/constants/colores";
import { nombreSistema, versionSistema } from "@/utils/sistema";

// Pantalla de inicio: muestra un resumen y el estado de los permisos
export default function Inicio() {
  const router = useRouter();
  const { lugares } = useLugares();
  const [permisoCamara] = useCameraPermissions();
  const [permisoUbicacion] = useForegroundPermissions();
  const [hayAcelerometro, setHayAcelerometro] = useState<boolean | null>(null);

  // Al abrir la pantalla se revisa si el celular tiene acelerómetro
  useEffect(() => {
    Accelerometer.isAvailableAsync()
      .then((respuesta) => setHayAcelerometro(respuesta))
      .catch(() => setHayAcelerometro(false));
  }, []);

  const ultimo = lugares[0];
  const cantidad = lugares.length;

  return (
    <View style={estilos.contenedor}>
      <Encabezado
        titulo="APP"
        subtitulo={
          cantidad + (cantidad === 1 ? " lugar guardado. " : " lugares guardados. ") +
          "Toma una foto y guarda dónde estabas."
        }
      />
      <ScrollView contentContainerStyle={estilos.cuerpo}>
        <Tarjeta>
          <Text style={estilos.subtitulo}>Acciones rápidas</Text>
          <View style={estilos.botones}>
            <Boton texto="Capturar un lugar" icono="camera" alPresionar={() => router.navigate("/capturar")} />
            <Boton texto="Medir nivel" icono="compass" tipo="suave" alPresionar={() => router.navigate("/nivel")} />
          </View>
        </Tarjeta>

        <Tarjeta>
          <Text style={estilos.subtitulo}>Tu dispositivo</Text>
          <Text style={estilos.texto}>
            Sistema: {nombreSistema} · {versionSistema}
          </Text>
          <View style={estilos.etiquetas}>
            <Etiqueta texto="Cámara" activo={permisoCamara ? permisoCamara.granted : null} />
            <Etiqueta texto="Ubicación" activo={permisoUbicacion ? permisoUbicacion.granted : null} />
            <Etiqueta texto="Acelerómetro" activo={hayAcelerometro} />
          </View>
        </Tarjeta>

        <Tarjeta>
          <Text style={estilos.subtitulo}>Último lugar</Text>
          <Text style={estilos.texto}>
            {ultimo ? ultimo.direccion ?? "Sin dirección disponible" : "Aún no has guardado ningún lugar."}
          </Text>
        </Tarjeta>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  cuerpo: { padding: 16, gap: 16 },
  subtitulo: { fontSize: 17, fontWeight: "700", color: colores.texto },
  texto: { fontSize: 14, color: colores.textoSuave, marginTop: 6, lineHeight: 20 },
  botones: { gap: 8, marginTop: 16 },
  etiquetas: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
});
