import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Accelerometer } from "expo-sensors";
import { Inclinacion, normalizar, suavizar } from "@/utils/nivel";

// Lee el acelerómetro solo cuando "activo" es true (cuando la pestaña se está viendo)
export function useNivel(activo: boolean) {
  const [disponible, setDisponible] = useState<boolean | null>(null);
  const [inclinacion, setInclinacion] = useState<Inclinacion>({ x: 0, y: 0 });

  useEffect(() => {
    if (!activo) return;

    let cancelado = false;
    let suscripcion: { remove: () => void } | undefined;

    async function iniciar() {
      // Primero se revisa si el dispositivo tiene acelerómetro
      const hayAcelerometro = await Accelerometer.isAvailableAsync();
      if (cancelado) return;
      setDisponible(hayAcelerometro);
      if (!hayAcelerometro) return;

      // Cada cuántos milisegundos se lee el sensor (depende del sistema)
      let milisegundos = 80;
      if (Platform.OS === "ios") milisegundos = 60;
      if (Platform.OS === "android") milisegundos = 50;
      Accelerometer.setUpdateInterval(milisegundos);

      let actual: Inclinacion = { x: 0, y: 0 };
      const nueva = Accelerometer.addListener((datos) => {
        actual = suavizar(actual, normalizar(datos));
        setInclinacion(actual);
      });

      // Si el usuario cambió de pestaña mientras se iniciaba, se cierra la lectura
      if (cancelado) nueva.remove();
      else suscripcion = nueva;
    }

    iniciar();

    // Al salir de la pestaña se deja de leer el sensor para ahorrar batería
    return () => {
      cancelado = true;
      if (suscripcion) suscripcion.remove();
    };
  }, [activo]);

  return { disponible, inclinacion };
}
