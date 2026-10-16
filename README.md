# APP

Aplicación móvil hecha con **React Native** y **Expo** para el parcial práctico. Permite guardar lugares: se toma una foto, la app obtiene la ubicación del celular y todo queda en una lista. También incluye un nivel de burbuja que usa el acelerómetro.

## Qué cumple del enunciado

| Requisito | Cómo se cumple |
|---|---|
| Dos funcionalidades nativas | **Cámara** (`expo-camera`) y **ubicación GPS** (`expo-location`) |
| Un sensor útil | **Acelerómetro** (`expo-sensors`) para el nivel de burbuja |
| Validación del sistema operativo | Se usa `Platform.OS` y `Platform.select` |
| Solo navegación por Tabs | `app/_layout.tsx` usa únicamente `<Tabs>` |
| Interfaz atractiva | Paleta de colores única, componentes repetidos, mensajes claros |
| APK con EAS Build | `eas.json` tiene el perfil `preview` que genera un `.apk` |

## Pantallas

1. **Inicio:** resumen y estado de los permisos del celular.
2. **Capturar:** cámara para tomar la foto y ubicación del lugar.
3. **Lugares:** lista de lugares guardados, con botón para ver el mapa y eliminar.
4. **Nivel:** burbuja que se mueve con la inclinación del celular.

## Cómo ejecutarla

Se necesita Node.js y la aplicación **Expo Go** en el celular.

```bash
npm install
npx expo start
```

Se escanea el código QR con Expo Go. La cámara, el GPS y el acelerómetro se prueban mejor en un celular real.

Comandos de revisión:

```bash
npm run revisar   # revisa los tipos de TypeScript
npm run probar    # prueba las funciones del nivel
```

## Cómo generar el APK

```bash
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build -p android --profile preview
```

Al terminar, EAS entrega un enlace para descargar el `.apk`.
