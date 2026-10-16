// Prueba de las funciones del nivel. Se ejecuta con: npm run probar
import assert from "node:assert/strict";
import { aGrados, estaNivelado, normalizar, posicionBurbuja } from "../utils/nivel";

// 1. Con el celular plano (z = 1 en Android, z = -1 en iOS) debe estar nivelado
assert.ok(estaNivelado(normalizar({ x: 0, y: 0, z: 1 })));
assert.ok(estaNivelado(normalizar({ x: 0, y: 0, z: -1 })));

// 2. Con z negativo (iOS) se invierten los signos de x e y
assert.deepEqual(normalizar({ x: 0.1, y: -0.2, z: -1 }), { x: -0.1, y: 0.2 });
assert.deepEqual(normalizar({ x: 0.1, y: -0.2, z: 1 }), { x: 0.1, y: -0.2 });

// 3. 0.5 g son 30 grados
assert.ok(Math.abs(aGrados(0.5) - 30) < 0.000001);

// 4. Un valor mayor que 1 no debe dar NaN
assert.ok(Number.isFinite(aGrados(1.2)));

// 5. Con 5 grados de inclinación ya no está nivelado
assert.ok(!estaNivelado({ x: Math.sin((5 * Math.PI) / 180), y: 0 }));

// 6. La burbuja nunca sale del círculo
const p = posicionBurbuja({ x: 1, y: -1 }, 100);
assert.ok(Math.sqrt(p.x * p.x + p.y * p.y) <= 100.0001);

console.log("Todas las pruebas del nivel pasaron");
