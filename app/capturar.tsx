import { useRef, useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "expo-router";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import Aviso from "@/components/Aviso";
import Boton from "@/components/Boton";
import Encabezado from "@/components/Encabezado";
import Tarjeta from "@/components/Tarjeta";
import { useLugares } from "@/context/LugaresContext";
import { colores } from "@/constants/colores";
import { abrirAjustes, textoAjustes, vibrarExito } from "@/utils/sistema";

// Datos de la foto que se acaba de tomar (todavía no se guarda)
type Borrador = {
  uri: string;
  latitud: number | null;
  longitud: number | null;
  precision: number | null;
  direccion: string | null;
  error: string | null;
};

export default function Capturar() {
  const pestanaActiva = useIsFocused();
  const [permiso, pedirPermiso] = useCameraPermissions();
  const camara = useRef<CameraView>(null);
  const [lado, setLado] = useState<CameraType>("back");
  const [camaraLista, setCamaraLista] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [borrador, setBorrador] = useState<Borrador | null>(null);
  const { agregarLugar } = useLugares();

  // Segunda función nativa: obtiene la ubicación y la convierte en una dirección
  async function obtenerUbicacion() {
    const vacio = { latitud: null, longitud: null, precision: null, direccion: null };
    try {
      const respuesta = await Location.requestForegroundPermissionsAsync();
      if (!respuesta.granted) {
        return { ...vacio, error: "Sin permiso de ubicación. " + textoAjustes };
      }

      // Se revisa que el GPS esté encendido
      const gpsEncendido = await Location.hasServicesEnabledAsync();
      if (!gpsEncendido) {
        return { ...vacio, error: "El GPS está apagado. Actívalo e inténtalo de nuevo." };
      }

      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        // Solo funciona en Android: ofrece encender el GPS desde una ventana del sistema
        mayShowUserSettingsDialog: true,
      });

      // Con las coordenadas se busca la dirección (puede fallar sin internet)
      let direccion: string | null = null;
      try {
        const resultados = await Location.reverseGeocodeAsync(posicion.coords);
        if (resultados.length > 0) {
          const r = resultados[0];
          const partes = [r.street ?? r.name, r.district ?? r.subregion, r.city];
          direccion = partes.filter((p) => p).join(", ");
        }
      } catch (error) {
        direccion = null;
      }

      return {
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
        precision: posicion.coords.accuracy,
        direccion: direccion,
        error: null,
      };
    } catch (error) {
      return { ...vacio, error: "No se pudo obtener la ubicación." };
    }
  }

  // Primera función nativa: tomar la foto con la cámara
  async function tomarFoto() {
    if (!camara.current || !camaraLista || cargando) return;
    setCargando(true);
    try {
      const foto = await camara.current.takePictureAsync({ quality: 0.6 });
      const ubicacion = await obtenerUbicacion();
      setBorrador({ uri: foto.uri, ...ubicacion });
      vibrarExito();
    } catch (error) {
      setBorrador(null);
    }
    setCargando(false);
  }

  async function reintentarUbicacion() {
    if (!borrador) return;
    setCargando(true);
    const ubicacion = await obtenerUbicacion();
    setBorrador({ uri: borrador.uri, ...ubicacion });
    setCargando(false);
  }

  function guardar() {
    if (!borrador) return;
    agregarLugar({
      uri: borrador.uri,
      latitud: borrador.latitud,
      longitud: borrador.longitud,
      precision: borrador.precision,
      direccion: borrador.direccion,
    });
    setBorrador(null);
  }

  const encabezado = <Encabezado titulo="Capturar" subtitulo="Foto y ubicación en un solo paso." />;

  // 1. Los permisos todavía se están consultando
  if (!permiso) {
    return (
      <View style={estilos.contenedor}>
        {encabezado}
        <ActivityIndicator style={{ marginTop: 40 }} color={colores.principal} />
      </View>
    );
  }

  // 2. El usuario aún no dio permiso para la cámara
  if (!permiso.granted) {
    return (
      <View style={estilos.contenedor}>
        {encabezado}
        <View style={estilos.cuerpo}>
          <Aviso
            titulo="Necesitamos la cámara"
            tipo="alerta"
            mensaje={
              permiso.canAskAgain
                ? "Para fotografiar un lugar, la app debe usar la cámara."
                : "Permiso bloqueado. " + textoAjustes
            }
          >
            {permiso.canAskAgain ? (
              <Boton texto="Permitir cámara" icono="camera" alPresionar={pedirPermiso} />
            ) : (
              <Boton texto="Abrir ajustes" icono="settings" alPresionar={abrirAjustes} />
            )}
          </Aviso>
        </View>
      </View>
    );
  }

  // 3. Ya se tomó la foto: se muestra para guardarla o repetirla
  if (borrador) {
    return (
      <View style={estilos.contenedor}>
        {encabezado}
        <View style={estilos.cuerpo}>
          <Tarjeta>
            <Image source={{ uri: borrador.uri }} style={estilos.foto} />
            <Text style={estilos.direccion}>
              {borrador.direccion ?? (borrador.latitud !== null ? "Dirección no disponible" : "Sin ubicación")}
            </Text>
            {borrador.latitud !== null && borrador.longitud !== null && (
              <Text style={estilos.coordenadas}>
                {borrador.latitud.toFixed(5)}, {borrador.longitud.toFixed(5)}
                {borrador.precision ? " · ±" + Math.round(borrador.precision) + " m" : ""}
              </Text>
            )}
          </Tarjeta>

          {borrador.error && (
            <Aviso titulo="Ubicación no disponible" tipo="error" mensaje={borrador.error} />
          )}

          <Boton texto="Guardar lugar" icono="checkmark-circle" alPresionar={guardar} deshabilitado={cargando} />
          {borrador.error && (
            <Boton texto="Reintentar ubicación" icono="refresh" tipo="suave" alPresionar={reintentarUbicacion} deshabilitado={cargando} />
          )}
          <Boton texto="Descartar y repetir" icono="trash" tipo="peligro" alPresionar={() => setBorrador(null)} />
        </View>
      </View>
    );
  }

  // 4. Pantalla normal con la cámara
  return (
    <View style={estilos.contenedor}>
      {encabezado}
      <View style={estilos.cuerpo}>
        <View style={estilos.cajaCamara}>
          {/* La cámara solo se enciende si esta pestaña se está viendo */}
          {pestanaActiva && (
            <CameraView
              ref={camara}
              style={StyleSheet.absoluteFill}
              facing={lado}
              onCameraReady={() => setCamaraLista(true)}
            />
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cambiar cámara"
            onPress={() => setLado(lado === "back" ? "front" : "back")}
            style={estilos.botonGirar}
          >
            <Ionicons name="camera-reverse" size={24} color="#fff" />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tomar foto"
          onPress={tomarFoto}
          disabled={!camaraLista || cargando}
          android_ripple={{ color: "rgba(0,0,0,0.15)", radius: 40 }}
          style={({ pressed }) => [
            estilos.disparador,
            { opacity: !camaraLista || cargando ? 0.5 : Platform.OS === "ios" && pressed ? 0.7 : 1 },
          ]}
        >
          {cargando ? <ActivityIndicator color={colores.principal} /> : <View style={estilos.disparadorInterno} />}
        </Pressable>

        <Text style={estilos.ayuda}>
          {cargando ? "Obteniendo ubicación..." : "Toca el botón para fotografiar y ubicar el lugar."}
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  cuerpo: { flex: 1, padding: 16, gap: 16 },
  cajaCamara: { flex: 1, borderRadius: 24, overflow: "hidden", backgroundColor: "#000" },
  botonGirar: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  disparador: {
    alignSelf: "center",
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: colores.principal,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.blanco,
  },
  disparadorInterno: { width: 54, height: 54, borderRadius: 27, backgroundColor: colores.principal },
  ayuda: { textAlign: "center", color: colores.textoSuave, fontSize: 14 },
  foto: { width: "100%", height: 260, borderRadius: 10, backgroundColor: colores.borde },
  direccion: { fontSize: 16, fontWeight: "700", color: colores.texto, marginTop: 16 },
  coordenadas: { fontSize: 13, color: colores.textoSuave, marginTop: 4 },
});
