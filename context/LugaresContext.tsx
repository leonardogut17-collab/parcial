import { createContext, ReactNode, useContext, useState } from "react";

// Datos de cada lugar que guarda el usuario
export type Lugar = {
  id: string;
  uri: string;
  latitud: number | null;
  longitud: number | null;
  precision: number | null;
  direccion: string | null;
  fecha: number;
};

type ContextoLugares = {
  lugares: Lugar[];
  agregarLugar: (lugar: Omit<Lugar, "id" | "fecha">) => void;
  eliminarLugar: (id: string) => void;
};

const LugaresContext = createContext<ContextoLugares | null>(null);

// Guarda la lista de lugares en memoria mientras la app está abierta
export function LugaresProvider({ children }: { children: ReactNode }) {
  const [lugares, setLugares] = useState<Lugar[]>([]);

  function agregarLugar(lugar: Omit<Lugar, "id" | "fecha">) {
    const nuevo: Lugar = {
      ...lugar,
      id: String(Date.now()),
      fecha: Date.now(),
    };
    // El lugar nuevo se pone de primero en la lista
    setLugares([nuevo, ...lugares]);
  }

  function eliminarLugar(id: string) {
    setLugares(lugares.filter((lugar) => lugar.id !== id));
  }

  return (
    <LugaresContext.Provider value={{ lugares, agregarLugar, eliminarLugar }}>
      {children}
    </LugaresContext.Provider>
  );
}

export function useLugares() {
  const contexto = useContext(LugaresContext);
  if (!contexto) {
    throw new Error("useLugares debe usarse dentro de LugaresProvider");
  }
  return contexto;
}
