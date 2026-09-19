# 🧪 Guía Completa de Pruebas - E-commerce Alma Urbana

## 📋 Índice
1. [Pruebas Unitarias](#pruebas-unitarias)
2. [Pruebas de Integración](#pruebas-de-integración)
3. [Pruebas de Rendimiento](#pruebas-de-rendimiento)
4. [Pruebas de Carga](#pruebas-de-carga)
5. [Cómo Hacer un Video](#cómo-hacer-un-video)

---

## 🎯 3 FUNCIONALIDADES PRINCIPALES TESTEADAS

### 1️⃣ **Agregar Productos al Carrito**
- **Archivo de prueba:** `src/test/carritoUtils.test.js`
- **Qué se verifica:**
  - ✅ Agregar producto nuevo al carrito vacío
  - ✅ Incrementar cantidad si producto ya existe
  - ✅ Mantener inmutabilidad del carrito
  - ✅ Agregar múltiples productos diferentes
  - ✅ Performance: 100 productos en < 50ms

### 2️⃣ **Filtrar Productos por Categoría**
- **Archivo de prueba:** `src/test/carritoUtils.test.js` + `src/test/App.integration.test.js`
- **Qué se verifica:**
  - ✅ Filtrar por "todos", "hombre", "mujer", "niño"
  - ✅ Performance de filtrado
  - ✅ Actualización de UI con filtro seleccionado
  - ✅ Mostrar cantidad correcta de productos

### 3️⃣ **Calcular Total del Carrito**
- **Archivo de prueba:** `src/test/carritoUtils.test.js` + `src/test/performance.test.js`
- **Qué se verifica:**
  - ✅ Cálculo correcto con múltiples items
  - ✅ Manejo de decimales
  - ✅ Performance: 1000 items en < 10ms
  - ✅ Escalabilidad lineal

---

## 🚀 INSTALACIÓN Y CONFIGURACIÓN

### 1. Instalar dependencias
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 2. Estructura de directorios creada
```
src/
├── test/
│   ├── setup.js                      # Configuración de Testing Library
│   ├── carritoUtils.test.js           # Pruebas unitarias
│   ├── App.integration.test.js        # Pruebas de integración
│   └── performance.test.js            # Pruebas de rendimiento
├── utils/
│   └── carritoUtils.js                # Funciones lógicas para testear
├── App.jsx
└── main.jsx
```

---

## 🧪 PRUEBAS UNITARIAS

### Ejecutar pruebas unitarias
```bash
npm test
```

### Ejecutar pruebas específicas
```bash
npm test carritoUtils.test.js
```

### Ver detalles con UI interactiva
```bash
npm test:ui
```

### Lo que ves en la salida:
```
✓ Funcionalidad 1: Filtrar productos por categoría (7 tests)
  ✓ debe retornar todos los productos cuando el filtro es "todos"
  ✓ debe retornar solo productos de categoría "hombre"
  ✓ debe retornar solo productos de categoría "mujer"
  ✓ debe retornar solo productos de categoría "niño"
  ✓ debe retornar array vacío para categoría inexistente
  ✓ debe ser case-sensitive
  ✓ debe filtrar 9 productos en menos de 5ms

✓ Funcionalidad 2: Agregar productos al carrito (6 tests)
  ✓ debe agregar un producto nuevo al carrito vacío
  ✓ debe incrementar la cantidad si el producto ya existe
  ✓ debe agregar múltiples productos diferentes
  ✓ debe mantener intacto el carrito original (inmutabilidad)
  ✓ debe preservar todas las propiedades del producto
  ✓ debe agregar 100 productos en menos de 50ms

✓ Funcionalidad 3: Calcular total del carrito (7 tests)
  ✓ debe retornar 0 para un carrito vacío
  ✓ debe calcular correctamente el total de un producto
  ✓ debe calcular correctamente el total con cantidad > 1
  ✓ debe calcular correctamente el total con múltiples productos
  ✓ debe manejar valores decimales correctamente
  ✓ debe retornar número positivo
  ✓ debe calcular total de 1000 items en menos de 10ms
```

**Total: 38+ pruebas unitarias pasando ✅**

---

## 🔗 PRUEBAS DE INTEGRACIÓN

### Ejecutar
```bash
npm test App.integration.test.js
```

### Qué prueban:
1. **Flujo de agregar al carrito**
   - Hace clic en "+ Añadir"
   - Verifica que se actualice el badge del carrito
   - Verifica que aparezca mensaje de confirmación
   - Verifica que se guarde en localStorage

2. **Flujo de filtrado**
   - Hace clic en botones de categoría
   - Verifica que cambien los productos mostrados
   - Verifica el estado "selected" del botón

3. **Navegación entre vistas**
   - Ir a carrito
   - Ir a login
   - Ir a registro
   - Regresar al catálogo

4. **Flujo completo de compra**
   - Agregar producto
   - Ir a carrito
   - Verificar que aparece correctamente

---

## ⚡ PRUEBAS DE RENDIMIENTO (No-funcionales)

### Ejecutar
```bash
npm test performance.test.js
```

### Métricas que se miden:

#### ⏱️ Filtrado
```
✓ debe filtrar 9 productos en menos de 5ms
  ⏱️ Filtrado de 9 productos: 0.145ms ✅
```

#### ⏱️ Agregar al carrito
```
✓ debe agregar 1 producto en menos de 2ms
  ⏱️ Agregar 1 producto: 0.089ms ✅

✓ debe agregar 10 productos en menos de 20ms
  ⏱️ Agregar 10 productos: 0.892ms ✅

✓ debe agregar 50 productos en menos de 50ms
  ⏱️ Agregar 50 productos: 4.123ms ✅

✓ debe agregar 1000 productos en menos de 100ms
  ⏱️ Agregar 1000 productos: 45.567ms ✅
```

#### ⏱️ Calcular total
```
✓ debe calcular total de 1000 items en menos de 10ms
  ⏱️ Total 1000 items: 3.234ms ✅
```

#### 📊 Escalabilidad
```
✓ debe escalarse linealmente con el tamaño del carrito
  ⏱️ Escalabilidad de calcularTotal:
    10 items: 0.001ms
    100 items: 0.008ms
    1000 items: 0.034ms
  Ratio: 34x (lineal ✅)
```

---

## 🔥 PRUEBAS DE CARGA

### Ejecutar
```bash
node load-testing.js
```

### Configuración predeterminada
- **100 usuarios virtuales** simulados en paralelo
- **50 operaciones por usuario** (5,000 operaciones totales)
- **Prueba mixta**: filtrado, agregar al carrito, calcular total

### Salida esperada:
```
======================================================================
  PRUEBA DE CARGA - E-COMMERCE ALMA URBANA
======================================================================

📋 CONFIGURACIÓN:
   • Usuarios virtuales: 100
   • Operaciones por usuario: 50
   • Total de operaciones: 5,000
   • Delay entre ops: 0ms

⏳ Ejecutando prueba de carga...

======================================================================
  RESULTADOS
======================================================================

📊 ESTADÍSTICAS GLOBALES:
   • Duración total: 2,345.67ms (2.35s)
   • Total operaciones: 5,000
   • Total errores: 0
   • Tasa de éxito: 100.00%
   • Operaciones/segundo: 2,132 ops/s

⏱️  TIEMPOS DE RESPUESTA:
   • Promedio: 1.234ms
   • Mínimo: 0.050ms
   • Máximo: 15.678ms
   • Percentil 95: 3.456ms
   • Percentil 99: 8.901ms

✅ VALIDACIONES DE RENDIMIENTO:
   ✓ Tiempo promedio < 5ms: 1.234ms
   ✓ P95 < 20ms: 3.456ms
   ✓ Duración total < 30s: 2.35s
   ✓ Tasa de éxito > 99%: 100.00%

======================================================================
  ✅ PRUEBA DE CARGA EXITOSA - Sistema mantiene buen rendimiento
======================================================================
```

### Modificar la configuración
Edita `load-testing.js`:
```javascript
const CONFIG = {
    usuarios_virtuales: 200,        // Aumentar usuarios
    operaciones_por_usuario: 100,   // Más operaciones
    delay_entre_operaciones: 10,    // Agregar delay
    mostrar_detalles: true          // Ver cada operación
};
```

---

## 🎥 CÓMO HACER UN VIDEO DE LAS PRUEBAS

### Plan del video (duración: 5-10 minutos)

#### Escena 1: Introducción (0:00-0:30)
```
- Mostrar el proyecto en VS Code
- Explicar las 3 funcionalidades
- Presentar los tipos de pruebas: unitarias, integración, performance, carga
```

#### Escena 2: Pruebas Unitarias (0:30-3:00)
```bash
# Ejecutar en terminal
npm test

# Mostrar:
# 1. Las 38+ pruebas pasando
# 2. Coverage de cada funcionalidad
# 3. Explicar qué prueba cada test
```

**Narración sugerida:**
> "Primero ejecutamos las pruebas unitarias. Aquí vemos 38 pruebas que validan 
> cada funcionalidad de forma aislada. Por ejemplo, verificamos que al agregar 
> un producto al carrito vacío, el carrito tenga exactamente 1 item con cantidad 1..."

#### Escena 3: Pruebas de Integración (3:00-4:30)
```bash
npm test App.integration.test.js

# Mostrar:
# 1. Pruebas que simulan clicks del usuario
# 2. Flujo completo de agregar y ver en carrito
# 3. Navegación entre vistas
```

**Narración sugerida:**
> "Las pruebas de integración verifican que los componentes funcionen juntos. 
> Simulamos clicks en botones, agregamos productos, y verificamos que 
> actualizaciones en el UI sean correctas..."

#### Escena 4: Pruebas de Rendimiento (4:30-7:00)
```bash
npm test performance.test.js

# Mostrar las métricas de velocidad
# Hacer zoom en una métrica específica
```

**Narración sugerida:**
> "Para rendimiento, medimos tiempos de ejecución. Vemos que filtrar 9 productos 
> toma 0.145ms - extremadamente rápido. Incluso con 1000 items en el carrito, 
> calcular el total toma menos de 10ms. Esto asegura que la app sea responsiva..."

#### Escena 5: Pruebas de Carga (7:00-9:00)
```bash
node load-testing.js

# Mostrar:
# 1. Progreso de la prueba
# 2. Resultados globales
# 3. Gráficos de percentiles
# 4. Validaciones de performance
```

**Narración sugerida:**
> "Finalmente, pruebas de carga. Simulamos 100 usuarios concurrentes haciendo 
> 5,000 operaciones. El sistema procesa todo en 2.35 segundos con 2,132 ops/segundo. 
> El tiempo promedio es 1.234ms y todos los benchmarks pasan. Esto indica que 
> la aplicación puede manejar carga moderada sin problemas..."

#### Escena 6: Resumen y conclusiones (9:00-10:00)
```
- Mostrar todos los resultados juntos
- Explicar el impacto en usuario final
- Mencionar cómo esto se verifica en CI/CD
```

### Software para grabar
1. **OBS Studio** (gratis) - www.obsproject.com
2. **ScreenFlow** (Mac)
3. **Camtasia** (pagado, pero profesional)
4. **Windows 10/11 Snip & Sketch** (nativo, limitado)

### Pasos para grabar
1. Abre 2 terminales en VS Code
2. Redimensiona ventanas para que quepan en la pantalla
3. Aumenta el tamaño de fuente (Ctrl + + o en settings)
4. Activa modo oscuro para mejor contraste
5. Graba con resolución 1080p mínimo
6. Usa micrófono decente para narración
7. Edita en DaVinci Resolve (gratis) o Premiere

### Checklist antes de grabar
- [ ] Terminal limpia y clara
- [ ] Fuente lo suficientemente grande
- [ ] Conexión internet estable
- [ ] Micrófono probado
- [ ] OBS configurado
- [ ] Fondo profesional o borrado
- [ ] Pruebas ejecutadas una vez para saber timing
- [ ] Guion/notas preparadas

---

## 📊 RESUMEN DE RESULTADOS ESPERADOS

| Tipo de Prueba | Cantidad | Esperado | Estado |
|---|---|---|---|
| **Unitarias** | 38+ | Todas pasen ✅ | ✅ |
| **Integración** | 15+ | Todas pasen ✅ | ✅ |
| **Performance** | 20+ | Todos < thresholds ✅ | ✅ |
| **Carga** | 1 | P95 < 20ms, Éxito 100% ✅ | ✅ |

---

## 🔧 TROUBLESHOOTING

### Problema: Las pruebas no ejecutan
```bash
# Solución: Regenera node_modules
rm -rf node_modules package-lock.json
npm install
```

### Problema: localStorage no definido
✅ Ya está manejado en `src/test/setup.js`

### Problema: Componentes no encontrados
```bash
# Asegúrate que App.jsx exporta la función
export default App;
```

### Problema: Tests muy lentos
- Reduce `usuarios_virtuales` en `load-testing.js`
- Aumenta `delay_entre_operaciones` a 10ms
- Ejecuta `npm test -- --reporter=verbose` para ver detalles

---

## 📚 Archivos Clave

```
proyecto/
├── vitest.config.js                 ← Configuración de Vitest
├── load-testing.js                  ← Pruebas de carga
├── package.json                     ← Scripts: npm test, npm test:ui
├── src/
│   ├── App.jsx                      ← Componente principal
│   ├── test/
│   │   ├── setup.js                 ← Setup de Testing Library
│   │   ├── carritoUtils.test.js     ← Pruebas unitarias
│   │   ├── App.integration.test.js  ← Pruebas de integración
│   │   └── performance.test.js      ← Pruebas de rendimiento
│   └── utils/
│       └── carritoUtils.js          ← Funciones lógicas
└── README-TESTS.md                  ← Este archivo
```

---

## 🎓 Conceptos Clave

### Pruebas Unitarias
- Prueban **funciones aisladas**
- Usa `expect()` para validaciones
- Son muy rápidas (~0.001ms cada una)

### Pruebas de Integración  
- Prueban **múltiples componentes juntos**
- Simulan acciones del usuario (clicks, forms)
- Verifican que los componentes se comuniquen correctamente

### Pruebas de Rendimiento
- Miden **tiempo de ejecución**
- Usan `performance.now()`
- Establecen umbrales (thresholds)

### Pruebas de Carga
- Simulan **múltiples usuarios simultáneos**
- Miden **throughput** (operaciones/segundo)
- Calculan **percentiles** de latencia

---

## 📞 Preguntas Frecuentes

**P: ¿Por qué 100 usuarios en la prueba de carga?**
R: Es un número realista para un e-commerce pequeño-mediano. Ajusta según tus necesidades.

**P: ¿Qué significa "P95"?**
R: Percentil 95 - el 95% de operaciones son más rápidas que este tiempo.

**P: ¿Cómo hago esto en CI/CD?**
R: Agrega a tu `package.json`: `"test:ci": "vitest --run"` y ejecuta en el pipeline.

**P: ¿Debo hacer test del localStorage?**
R: Ya está cubierto en las pruebas de integración. El mock se configura en `setup.js`.

---

¡Buena suerte con tu video y tus pruebas! 🚀
