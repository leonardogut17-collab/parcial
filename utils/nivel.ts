// Funciones del nivel de burbuja. No usan React, solo matemáticas.

export type Inclinacion = { x: number; y: number };

// Los valores del acelerómetro se miden en "g" (1 g = gravedad).
// Android y iOS entregan los ejes con signo contrario, entonces
// usamos el signo de z para dejar siempre la misma dirección.
export function normalizar(lectura: { x: number; y: number; z: number }): Inclinacion {
  const signo = lectura.z < 0 ? -1 : 1;
  return { x: lectura.x * signo, y: lectura.y * signo };
}

// Promedia la lectura nueva con la anterior para que la burbuja no tiemble
export function suavizar(anterior: Inclinacion, nueva: Inclinacion): Inclinacion {
  const factor = 0.25;
  return {
    x: anterior.x + (nueva.x - anterior.x) * factor,
    y: anterior.y + (nueva.y - anterior.y) * factor,
  };
}

// Pasa el valor en g a grados de inclinación
export function aGrados(g: number) {
  const limitado = Math.min(1, Math.max(-1, g));
  return (Math.asin(limitado) * 180) / Math.PI;
}

// Calcula cuánto se mueve la burbuja desde el centro (en pixeles).
// Con 10 grados de inclinación llega al borde del círculo.
export function posicionBurbuja(inclinacion: Inclinacion, radio: number) {
  const maximo = Math.sin((10 * Math.PI) / 180);
  let x = Math.min(1, Math.max(-1, inclinacion.x / maximo));
  let y = Math.min(1, Math.max(-1, -inclinacion.y / maximo));

  // Si se sale del círculo la dejamos en el borde
  const largo = Math.sqrt(x * x + y * y);
  if (largo > 1) {
    x = x / largo;
    y = y / largo;
  }
  return { x: x * radio, y: y * radio };
}

// Se considera nivelado si la inclinación es menor a 1.5 grados
export function estaNivelado(inclinacion: Inclinacion) {
  return Math.abs(aGrados(inclinacion.x)) <= 1.5 && Math.abs(aGrados(inclinacion.y)) <= 1.5;
}
