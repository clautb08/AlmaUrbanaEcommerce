import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function solicitarAPI(endpoint, opciones) {
    const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...opciones,
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.error || "No se pudo completar la solicitud.");
    return datos;
}

const productos = [
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

function App() {
    const [vista, setVista] = useState("catalogo");
    const [filtro, setFiltro] = useState("todos");
    const [carrito, setCarrito] = useState(() => JSON.parse(localStorage.getItem("carrito")) || []);
    const [mensaje, setMensaje] = useState("");

    function navegar(nuevaVista) { setVista(nuevaVista); setMensaje(""); }

    function agregar(producto) {
        const existente = carrito.find((item) => item.id === producto.id);
        const nuevoCarrito = existente
            ? carrito.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)
            : [...carrito, { ...producto, cantidad: 1 }];
        setCarrito(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        setMensaje(`${producto.nombre} se agregó al carrito.`);
    }

    function quitar(id) {
        const nuevoCarrito = carrito.filter((item) => item.id !== id);
        setCarrito(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    }

    const filtrados = filtro === "todos" ? productos : productos.filter((producto) => producto.categoria === filtro);
    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    const unidades = carrito.reduce((suma, item) => suma + item.cantidad, 0);

    return <>
        <header className="site-header">
            <button className="brand" onClick={() => navegar("catalogo")}>ALMA <span>URBANA</span></button>
            <nav>
                <button className={vista === "catalogo" ? "active" : ""} onClick={() => navegar("catalogo")}>Catálogo</button>
                <button className={vista === "login" ? "active" : ""} onClick={() => navegar("login")}>Iniciar sesión</button>
                <button className={vista === "registro" ? "active" : ""} onClick={() => navegar("registro")}>Crear cuenta</button>
                <button className="cart-link" onClick={() => navegar("carrito")}>Carrito <b>{unidades}</b></button>
            </nav>
        </header>
        {mensaje && <div className="notice" role="status">{mensaje}</div>}
        <main>
            {vista === "catalogo" && <Catalogo productos={filtrados} filtro={filtro} setFiltro={setFiltro} agregar={agregar} />}
            {vista === "carrito" && <Carrito carrito={carrito} total={total} quitar={quitar} navegar={navegar} />}
            {vista === "login" && <FormularioLogin navegar={navegar} />}
            {vista === "registro" && <FormularioRegistro navegar={navegar} />}
            {vista === "checkout" && <Checkout total={total} unidades={unidades} navegar={navegar} />}
        </main>
        <footer>© 2026 Alma Urbana. Todos los derechos reservados.</footer>
    </>;
}

function Catalogo({ productos: lista, filtro, setFiltro, agregar }) {
    return <section className="catalogo">
        <div className="catalogo-intro"><p className="eyebrow">Nueva temporada</p><h1>Viste tu <em>propia</em> historia.</h1><p>Piezas cotidianas con carácter para todos los días.</p></div>
        <div className="filter-bar">{[["todos", "Todo"], ["hombre", "Hombres"], ["mujer", "Mujeres"], ["nino", "Niños"]].map(([valor, texto]) => <button className={filtro === valor ? "selected" : ""} onClick={() => setFiltro(valor)} key={valor}>{texto}</button>)}</div>
        <div className="product-grid">{lista.map((producto) => <article className="product-tile" key={producto.id}><div className="image-wrap"><img src={producto.imagen} alt={producto.nombre} /></div><div className="tile-info"><span>{producto.categoria}</span><h2>{producto.nombre}</h2><p>{producto.descripcion}</p><div className="tile-bottom"><strong>S/. {producto.precio.toFixed(2)}</strong><button onClick={() => agregar(producto)}>+ Añadir</button></div></div></article>)}</div>
    </section>;
}

function Carrito({ carrito, total, quitar, navegar }) {
    return <section className="page-section"><p className="eyebrow">Tu selección</p><h1>Carrito de compras</h1>{carrito.length === 0 ? <div className="empty"><p>Tu carrito todavía está vacío.</p><button onClick={() => navegar("catalogo")}>Explorar catálogo</button></div> : <div className="cart-layout"><div>{carrito.map((item) => <article className="cart-row" key={item.id}><img src={item.imagen} alt="" /><div><h2>{item.nombre}</h2><p>{item.cantidad} unidad(es) · S/. {item.precio.toFixed(2)}</p></div><strong>S/. {(item.precio * item.cantidad).toFixed(2)}</strong><button aria-label={`Quitar ${item.nombre}`} onClick={() => quitar(item.id)}>×</button></article>)}</div><aside className="summary"><h2>Resumen</h2><p>{carrito.length} productos</p><strong>S/. {total.toFixed(2)}</strong><button onClick={() => navegar("checkout")}>Continuar pedido</button></aside></div>}</section>;
}

function FormularioLogin({ navegar }) {
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function iniciarSesion(event) {
        event.preventDefault();
        setError("");
        setCargando(true);
        const formulario = new FormData(event.currentTarget);
        try {
            const datos = await solicitarAPI("/auth/login", { method: "POST", body: JSON.stringify(Object.fromEntries(formulario)) });
            localStorage.setItem("token", datos.token);
            navegar("catalogo");
        } catch (apiError) {
            setError(apiError.message);
        } finally {
            setCargando(false);
        }
    }

    return <section className="form-page"><p className="eyebrow">Bienvenido de vuelta</p><h1>Iniciar sesión</h1>{error && <p className="notice" role="alert">{error}</p>}<form onSubmit={iniciarSesion}><label>Correo electrónico<input name="email" type="email" required placeholder="ejemplo@gmail.com" /></label><label>Contraseña<input name="password" type="password" required minLength="8" placeholder="Mínimo 8 caracteres" /></label><button disabled={cargando}>{cargando ? "Ingresando..." : "Ingresar"}</button></form><p>¿No tienes una cuenta? <button className="text-button" onClick={() => navegar("registro")}>Créala aquí</button></p></section>;
}
function FormularioRegistro({ navegar }) {
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function registrar(event) {
        event.preventDefault();
        setError("");
        setCargando(true);
        const formulario = new FormData(event.currentTarget);
        const datosFormulario = Object.fromEntries(formulario);
        try {
            await solicitarAPI("/auth/register", { method: "POST", body: JSON.stringify({ name: `${datosFormulario.name} ${datosFormulario.apellidos}`.trim(), email: datosFormulario.email, password: datosFormulario.password }) });
            navegar("login");
        } catch (apiError) {
            setError(apiError.message);
        } finally {
            setCargando(false);
        }
    }

    return <section className="form-page wide"><p className="eyebrow">Únete a la comunidad</p><h1>Crear cuenta</h1>{error && <p className="notice" role="alert">{error}</p>}<form onSubmit={registrar}><div className="form-columns"><label>Nombre<input name="name" required placeholder="Claudia" /></label><label>Apellidos<input name="apellidos" required placeholder="Torres Braul" /></label><label>Teléfono<input required type="tel" placeholder="987654321" /></label><label>Fecha de nacimiento<input required type="date" /></label><label>Correo electrónico<input name="email" required type="email" placeholder="ejemplo@gmail.com" /></label><label>Contraseña<input name="password" required minLength="8" type="password" placeholder="Mínimo 8 caracteres" /></label></div><button disabled={cargando}>{cargando ? "Creando cuenta..." : "Crear cuenta"}</button></form></section>;
}
function Checkout({ total, unidades, navegar }) { return <section className="form-page wide"><p className="eyebrow">Último paso</p><h1>Finalizar pedido</h1><div className="checkout-total"><span>{unidades} producto(s)</span><strong>S/. {total.toFixed(2)}</strong></div><form onSubmit={(event) => { event.preventDefault(); alert("Pedido registrado correctamente"); navegar("catalogo"); }}><div className="form-columns"><label>Nombre<input required /></label><label>Apellido<input required /></label><label>Correo electrónico<input required type="email" /></label><label>Teléfono<input required type="tel" /></label><label className="full">Dirección<input required /></label><label>Distrito<input required /></label><label>Referencia<input required /></label><label className="full">Número de tarjeta<input required inputMode="numeric" minLength="16" maxLength="16" /></label></div><button>Confirmar pedido</button></form></section>; }

export default App;
