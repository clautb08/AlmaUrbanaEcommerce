import { describe, it, expect } from 'vitest';
import {
    filtrarProductosPorCategoria,
    agregarAlCarrito,
    calcularTotal,
    calcularUnidades,
    quitarDelCarrito,
    productos,
} from '../utils/carritoUtils';

describe('PRUEBAS UNITARIAS - Funcionalidades del E-commerce', () => {
    
    // ========== PRUEBAS DE FILTRADO ==========
    describe('Funcionalidad 1: Filtrar productos por categoría', () => {
        
        it('debe retornar todos los productos cuando el filtro es "todos"', () => {
            const resultado = filtrarProductosPorCategoria(productos, "todos");
            expect(resultado).toHaveLength(9);
            expect(resultado).toEqual(productos);
        });

        it('debe retornar solo productos de categoría "hombre"', () => {
            const resultado = filtrarProductosPorCategoria(productos, "hombre");
            expect(resultado).toHaveLength(3);
            expect(resultado.every(p => p.categoria === "hombre")).toBe(true);
        });

        it('debe retornar solo productos de categoría "mujer"', () => {
            const resultado = filtrarProductosPorCategoria(productos, "mujer");
            expect(resultado).toHaveLength(3);
            expect(resultado.every(p => p.categoria === "mujer")).toBe(true);
        });

        it('debe retornar solo productos de categoría "nino"', () => {
            const resultado = filtrarProductosPorCategoria(productos, "nino");
            expect(resultado).toHaveLength(3);
            expect(resultado.every(p => p.categoria === "nino")).toBe(true);
        });

        it('debe retornar array vacío para categoría inexistente', () => {
            const resultado = filtrarProductosPorCategoria(productos, "inexistente");
            expect(resultado).toHaveLength(0);
        });

        it('debe ser case-sensitive', () => {
            const resultado = filtrarProductosPorCategoria(productos, "HOMBRE");
            expect(resultado).toHaveLength(0);
        });

        // Prueba de rendimiento
        it('debe filtrar 9 productos en menos de 5ms', () => {
            const inicio = performance.now();
            filtrarProductosPorCategoria(productos, "hombre");
            const fin = performance.now();
            expect(fin - inicio).toBeLessThan(5);
        });
    });

    // ========== PRUEBAS DE AGREGAR AL CARRITO ==========
    describe('Funcionalidad 2: Agregar productos al carrito', () => {
        
        it('debe agregar un producto nuevo al carrito vacío', () => {
            const carrito = [];
            const producto = productos[0];
            const resultado = agregarAlCarrito(carrito, producto);
            
            expect(resultado).toHaveLength(1);
            expect(resultado[0].id).toBe("p1");
            expect(resultado[0].cantidad).toBe(1);
        });

        it('debe incrementar la cantidad si el producto ya existe', () => {
            const carrito = [{ ...productos[0], cantidad: 1 }];
            const producto = productos[0];
            const resultado = agregarAlCarrito(carrito, producto);
            
            expect(resultado).toHaveLength(1);
            expect(resultado[0].cantidad).toBe(2);
        });

        it('debe agregar múltiples productos diferentes', () => {
            let carrito = [];
            carrito = agregarAlCarrito(carrito, productos[0]);
            carrito = agregarAlCarrito(carrito, productos[1]);
            carrito = agregarAlCarrito(carrito, productos[2]);
            
            expect(carrito).toHaveLength(3);
            expect(carrito[0].id).toBe("p1");
            expect(carrito[1].id).toBe("p2");
            expect(carrito[2].id).toBe("p3");
        });

        it('debe mantener intacto el carrito original (inmutabilidad)', () => {
            const carrito = [{ ...productos[0], cantidad: 1 }];
            const original = JSON.stringify(carrito);
            agregarAlCarrito(carrito, productos[1]);
            
            expect(JSON.stringify(carrito)).toBe(original);
        });

        it('debe preservar todas las propiedades del producto', () => {
            const carrito = [];
            const resultado = agregarAlCarrito(carrito, productos[0]);
            
            expect(resultado[0]).toHaveProperty('id');
            expect(resultado[0]).toHaveProperty('nombre');
            expect(resultado[0]).toHaveProperty('precio');
            expect(resultado[0]).toHaveProperty('cantidad');
            expect(resultado[0]).toHaveProperty('imagen');
        });

        // Prueba de rendimiento
        it('debe agregar 100 productos en menos de 50ms', () => {
            let carrito = [];
            const inicio = performance.now();
            
            for (let i = 0; i < 100; i++) {
                const producto = productos[i % productos.length];
                carrito = agregarAlCarrito(carrito, producto);
            }
            
            const fin = performance.now();
            expect(fin - inicio).toBeLessThan(50);
        });
    });

    // ========== PRUEBAS DE CÁLCULO DE TOTAL ==========
    describe('Funcionalidad 3: Calcular total del carrito', () => {
        
        it('debe retornar 0 para un carrito vacío', () => {
            const total = calcularTotal([]);
            expect(total).toBe(0);
        });

        it('debe calcular correctamente el total de un producto', () => {
            const carrito = [{ ...productos[0], cantidad: 1 }];
            const total = calcularTotal(carrito);
            expect(total).toBe(59.90);
        });

        it('debe calcular correctamente el total de un producto con cantidad > 1', () => {
            const carrito = [{ ...productos[0], cantidad: 3 }];
            const total = calcularTotal(carrito);
            expect(total).toBeCloseTo(59.90 * 3, 2);
        });

        it('debe calcular correctamente el total con múltiples productos', () => {
            const carrito = [
                { ...productos[0], cantidad: 1 }, // 59.90
                { ...productos[1], cantidad: 2 }, // 120 * 2 = 240
                { ...productos[2], cantidad: 1 }  // 189.90
            ];
            const total = calcularTotal(carrito);
            const esperado = 59.90 + 240 + 189.90;
            expect(total).toBeCloseTo(esperado, 2);
        });

        it('debe manejar valores decimales correctamente', () => {
            const carrito = [
                { ...productos[3], cantidad: 1 }, // 79.90
                { ...productos[4], cantidad: 1 }  // 109.90
            ];
            const total = calcularTotal(carrito);
            expect(total).toBeCloseTo(189.80, 2);
        });

        it('debe retornar número positivo', () => {
            const carrito = [
                { ...productos[0], cantidad: 5 },
                { ...productos[1], cantidad: 3 }
            ];
            const total = calcularTotal(carrito);
            expect(total).toBeGreaterThan(0);
        });

        // Prueba de rendimiento
        it('debe calcular total de 1000 items en menos de 10ms', () => {
            const carrito = [];
            for (let i = 0; i < 1000; i++) {
                carrito.push({
                    ...productos[i % productos.length],
                    cantidad: 1
                });
            }
            
            const inicio = performance.now();
            calcularTotal(carrito);
            const fin = performance.now();
            
            expect(fin - inicio).toBeLessThan(10);
        });
    });

    // ========== PRUEBAS DE CÁLCULO DE UNIDADES ==========
    describe('Pruebas adicionales: Calcular unidades totales', () => {
        
        it('debe retornar 0 para carrito vacío', () => {
            expect(calcularUnidades([])).toBe(0);
        });

        it('debe contar unidades correctamente', () => {
            const carrito = [
                { ...productos[0], cantidad: 3 },
                { ...productos[1], cantidad: 2 }
            ];
            expect(calcularUnidades(carrito)).toBe(5);
        });
    });

    // ========== PRUEBAS DE QUITAR DEL CARRITO ==========
    describe('Pruebas adicionales: Quitar producto del carrito', () => {
        
        it('debe quitar un producto del carrito', () => {
            const carrito = [
                { ...productos[0], cantidad: 1, id: "p1" },
                { ...productos[1], cantidad: 1, id: "p2" }
            ];
            const resultado = quitarDelCarrito(carrito, "p1");
            
            expect(resultado).toHaveLength(1);
            expect(resultado[0].id).toBe("p2");
        });

        it('debe retornar carrito vacío si se quita el único producto', () => {
            const carrito = [{ ...productos[0], cantidad: 1, id: "p1" }];
            const resultado = quitarDelCarrito(carrito, "p1");
            
            expect(resultado).toHaveLength(0);
        });

        it('debe retornar carrito intacto si ID no existe', () => {
            const carrito = [{ ...productos[0], cantidad: 1, id: "p1" }];
            const resultado = quitarDelCarrito(carrito, "inexistente");
            
            expect(resultado).toHaveLength(1);
        });
    });
});
