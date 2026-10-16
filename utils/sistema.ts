import { Linking, Platform } from "react-native";
import * as Haptics from "expo-haptics";

// Nombre del sistema operativo donde se está ejecutando la app
export const nombreSistema = Platform.select({
  ios: "iOS",
  android: "Android",
  default: "Web",
});

// En Android la versión es un número de API (ejemplo 34) y en iOS es un texto (ejemplo 17.2)
export const versionSistema =
  Platform.OS === "android" ? "API " + Platform.Version : String(Platform.Version);

// Cada sistema tiene los permisos en un lugar diferente de los ajustes
export const textoAjustes = Platform.select({
  ios: "Ve a Ajustes > APP y activa el permiso.",
  android: "Ve a Ajustes > Aplicaciones > APP > Permisos.",
  default: "Revisa los permisos del navegador.",
});

// Devuelve el enlace para abrir el mapa según el sistema operativo
export function crearUrlMapa(latitud: number, longitud: number) {
  if (Platform.OS === "ios") {
    return "http://maps.apple.com/?ll=" + latitud + "," + longitud;
  }
  if (Platform.OS === "android") {
    return "geo:" + latitud + "," + longitud + "?q=" + latitud + "," + longitud;
  }
  return "https://www.google.com/maps?q=" + latitud + "," + longitud;
}

export function abrirMapa(latitud: number, longitud: number) {
  Linking.openURL(crearUrlMapa(latitud, longitud)).catch(() => {});
}

// Abre los ajustes de la app para que el usuario active un permiso
export function abrirAjustes() {
  Linking.openSettings().catch(() => {});
}

// La vibración solo funciona en el celular, en la web no se usa
export async function vibrarExito() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    // Si el dispositivo no puede vibrar no pasa nada
  }
}

export async function vibrarSuave() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Si el dispositivo no puede vibrar no pasa nada
  }
}
