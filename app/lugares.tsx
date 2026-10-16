import { Alert, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Boton from "@/components/Boton";
import Encabezado from "@/components/Encabezado";
import Tarjeta from "@/components/Tarjeta";
import { Lugar, useLugares } from "@/context/LugaresContext";
import { colores } from "@/constants/colores";
import { abrirMapa } from "@/utils/sistema";

// Cada elemento de la lista de lugares
function ItemLugar({ lugar, alEliminar }: { lugar: Lugar; alEliminar: () => void }) {
  const tieneCoordenadas = lugar.latitud !== null && lugar.longitud !== null;
  const fecha = new Date(lugar.fecha).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });

  return (
    <Tarjeta>
      <Image source={{ uri: lugar.uri }} style={estilos.foto} />
      <Text style={estilos.direccion}>
        {lugar.direccion ?? (tieneCoordenadas ? "Dirección no disponible" : "Sin ubicación")}
      </Text>
      {tieneCoordenadas && (
        <Text style={estilos.dato}>
          {lugar.latitud!.toFixed(5)}, {lugar.longitud!.toFixed(5)}
        </Text>
      )}
      <Text style={estilos.dato}>{fecha}</Text>

      <View style={estilos.fila}>
        {tieneCoordenadas && (
          <View style={{ flex: 1 }}>
            <Boton texto="Ver en mapa" icono="map" tipo="suave" alPresionar={() => abrirMapa(lugar.latitud!, lugar.longitud!)} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Boton texto="Eliminar" icono="trash" tipo="peligro" alPresionar={alEliminar} />
        </View>
      </View>
    </Tarjeta>
  );
}

export default function Lugares() {
  const { lugares, eliminarLugar } = useLugares();
  const router = useRouter();

  // Antes de borrar se le pregunta al usuario si está seguro
  function confirmarEliminar(id: string) {
    Alert.alert("Eliminar lugar", "Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => eliminarLugar(id) },
    ]);
  }

  return (
    <View style={estilos.contenedor}>
      <Encabezado titulo="Lugares" subtitulo="Tus fotos con su ubicación." />
      <FlatList
        data={lugares}
        keyExtractor={(lugar) => lugar.id}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => <ItemLugar lugar={item} alEliminar={() => confirmarEliminar(item.id)} />}
        // Se muestra cuando todavía no hay lugares guardados
        ListEmptyComponent={
          <Tarjeta>
            <Text style={estilos.direccion}>Todavía no hay lugares</Text>
            <Text style={estilos.dato}>Captura tu primera foto para verla aquí.</Text>
            <View style={{ marginTop: 16 }}>
              <Boton texto="Ir a Capturar" icono="camera" alPresionar={() => router.navigate("/capturar")} />
            </View>
          </Tarjeta>
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  lista: { padding: 16, gap: 16 },
  foto: { width: "100%", height: 180, borderRadius: 10, backgroundColor: colores.borde },
  direccion: { fontSize: 16, fontWeight: "700", color: colores.texto, marginTop: 8 },
  dato: { fontSize: 13, color: colores.textoSuave, marginTop: 4 },
  fila: { flexDirection: "row", gap: 8, marginTop: 16 },
});
