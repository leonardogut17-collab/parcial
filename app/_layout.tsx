import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LugaresProvider } from "@/context/LugaresContext";
import { colores } from "@/constants/colores";

// Esta es la estructura principal de la app.
// Solo se usa navegación por pestañas (Tabs), no hay Stack ni Drawer.
export default function Layout() {
  return (
    <LugaresProvider>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colores.principal,
          tabBarInactiveTintColor: colores.textoSuave,
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
          tabBarStyle: {
            backgroundColor: colores.blanco,
            borderTopColor: colores.borde,
            // La barra de iOS es más alta por la línea del gesto de inicio
            height: Platform.select({ ios: 88, android: 66, default: 72 }),
            paddingTop: 6,
            paddingBottom: Platform.select({ ios: 28, android: 8, default: 8 }),
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color as string} />
            ),
          }}
        />
        <Tabs.Screen
          name="capturar"
          options={{
            title: "Capturar",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="camera" size={size} color={color as string} />
            ),
          }}
        />
        <Tabs.Screen
          name="lugares"
          options={{
            title: "Lugares",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="location" size={size} color={color as string} />
            ),
          }}
        />
        <Tabs.Screen
          name="nivel"
          options={{
            title: "Nivel",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass" size={size} color={color as string} />
            ),
          }}
        />
        {/* Esta pantalla no aparece en la barra, solo evita errores con rutas que no existen */}
        <Tabs.Screen name="+not-found" options={{ href: null }} />
      </Tabs>
    </LugaresProvider>
  );
}
