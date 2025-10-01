// ✅ Exportamos la interfaz para poder usarla en otros archivos
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  etiqueta?: "Nuevo" | "Oferta";
}

// ✅ Importamos imágenes correctamente (esto es lo más recomendable con Vite)
import soldadoraImg from "../assets/SoldadoraInverter200A.png";
import caretaImg from "../assets/CaretaAutoOscurecente.jpg";
import guantesImg from "../assets/GuantesSoldador.jpg";
import electrodosImg from "../assets/Electrodos.jpg";

// ✅ Exportamos el arreglo con el tipo aplicado
export const products: Producto[] = [
  {
    id: 1,
    nombre: "Soldadora Inverter 200A",
    descripcion: "Ligera, eficiente y portátil. Ideal para trabajos en campo.",
    precio: 4599,
    imagen: soldadoraImg,
    etiqueta: "Oferta",
  },
  {
    id: 2,
    nombre: "Careta Auto-oscurecible DIN 9–13",
    descripcion: "Protección UV/IR, ajuste cómodo y sensor rápido.",
    precio: 899,
    imagen: caretaImg,
    etiqueta: "Nuevo",
  },
  {
    id: 3,
    nombre: "Guantes de Soldador Pro",
    descripcion: "Cuero premium, alta resistencia térmica y gran durabilidad.",
    precio: 299,
    imagen: guantesImg,
  },
  {
    id: 4,
    nombre: "Electrodos 6013 (1 kg)",
    descripcion: "Arco estable y fácil encendido. Uso general.",
    precio: 199,
    imagen: electrodosImg,
  },
];
