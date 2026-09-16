// Funciones lógicas puras para poder testearlas fácilmente

export const productos = [
    { id: "p1", nombre: "Polo Oversize Urban", categoria: "hombre", precio: 59.90, talla: "L", stock: 8, imagen: "https://th.bing.com/th/id/R.b822d39560ff722eb7c84c9b0f40711d?rik=X9YGRFwgbWscTg&riu=http%3a%2f%2fpepuno.com%2fweb%2fimage%2fproduct.template%2f1164%2fimage_1024%3funique%3dc12f324&ehk=m0ZthLzOMMWHcUuqJEfU4W1AmszfQNphJnRtvnT52dA%3d&risl=&pid=ImgRaw&r=0", descripcion: "Polo de algodón 100% de corte holgado" },
    { id: "p2", nombre: "Pantalón Jean Slim Fit", categoria: "hombre", precio: 120, talla: "32", stock: 5, imagen: "https://http2.mlstatic.com/D_NQ_NP_751990-MLA99226813313_112025-O.webp", descripcion: "Jean de mezclilla elástica y corte ajustado" },
    { id: "p3", nombre: "Cazadora de Cuerina", categoria: "hombre", precio: 189.90, talla: "M", stock: 3, imagen: "https://es.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Sites-master-catalog/default/dwfb0f4099/images/hi-res/Sandro_SHPBL01124-20_H_3.jpg?sw=2000&sh=2000", descripcion: "Chaqueta biker con forro térmico interior" },
    { id: "p4", nombre: "Blusa Manga Larga", categoria: "mujer", precio: 79.90, talla: "S", stock: 6, imagen: "https://media.vogue.mx/photos/69a86814c1227b17dea70d39/master/w_1600%2Cc_limit/blusa-zara.jpg", descripcion: "Blusa satinada para una ocasión formal" },
    { id: "p5", nombre: "Pantalón Wide Leg", categoria: "mujer", precio: 109.90, talla: "M", stock: 4, imagen: "https://content.clara.es/medio/2024/11/19/zara_75d99af1_241119160313_800x1201.webp", descripcion: "Pantalón de tiro alto y bota ancha" },
    { id: "p6", nombre: "Cazadora Denim Oversize", categoria: "mujer", precio: 149.90, talla: "S", stock: 2, imagen: "https://static.zara.net/assets/public/84a3/c0a6/2b4d4c739cce/8beee94b4781/04730271401-a1/04730271401-a1.jpg?ts=1744712302956&w=375", descripcion: "Casaca de jean con acabado vintage" },
    { id: "p7", nombre: "Polera Infantil Estampada", categoria: "nino", precio: 45.90, talla: "8", stock: 7, imagen: "https://www.pionier.pe/assets/upload/producto/5061602863_1.jpg", descripcion: "Polera de franela suave con diseño animado" },
    { id: "p8", nombre: "Pantalón Jogger Kids", categoria: "nino", precio: 55, talla: "10", stock: 5, imagen: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/15d47b83aaa742abae2e2211ab348449_9366/Conjunto_de_pantalones_deportivos_Essentials_Ninos_Beige_KB9668_41_detail.jpg", descripcion: "Pantalón deportivo con pretina elástica" },
    { id: "p9", nombre: "Cazadora Acolchada Kids", categoria: "nino", precio: 89.90, talla: "12", stock: 3, imagen: "https://static.zara.net/assets/public/e005/b16d/06f04b8caa05/7147bd2b9070/03121550664-e1/03121550664-e1.jpg?ts=1756197837872&w=560", descripcion: "Chaqueta impermeable con capucha" }
];

// Función para filtrar productos por categoría
export const filtrarProductosPorCategoria = (productosList, categoria) => {
    if (categoria === "todos") return productosList;
    return productosList.filter(producto => producto.categoria === categoria);
};

// Función para agregar producto al carrito
export const agregarAlCarrito = (carrito, producto) => {
    const existente = carrito.find(item => item.id === producto.id);
    return existente
        ? carrito.map(item => 
            item.id === producto.id 
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
        )
        : [...carrito, { ...producto, cantidad: 1 }];
};

// Función para calcular total del carrito
export const calcularTotal = (carrito) => {
    return carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
};

// Función para calcular cantidad total de unidades
export const calcularUnidades = (carrito) => {
    return carrito.reduce((suma, item) => suma + item.cantidad, 0);
};

// Función para quitar producto del carrito
export const quitarDelCarrito = (carrito, id) => {
    return carrito.filter(item => item.id !== id);
};
