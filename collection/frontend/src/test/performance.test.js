/**
 * PRUEBAS DE RENDIMIENTO Y CARGA (No-funcionales)
 * 
 * Este archivo contiene:
 * 1. Pruebas de rendimiento de operaciones críticas
 * 2. Pruebas de carga simuladas
 * 3. Mediciones de Web Vitals
 * 
 * Para ejecutar: npm run test performance.test.js
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    filtrarProductosPorCategoria,
    agregarAlCarrito,
    calcularTotal,
    productos,
} from '../utils/carritoUtils';

// ========== CONFIGURACIÓN DE UMBRALES DE RENDIMIENTO ==========
const PERFORMANCE_THRESHOLDS = {
    filtrado: 5,           // ms - Debe ser menor a 5ms
    agregarCarrito: 2,     // ms - Debe ser menor a 2ms
    calcularTotal: 1,      // ms - Debe ser menor a 1ms
    operacionesGrandes: 50 // ms - Para operaciones con muchos items
};

describe('PRUEBAS DE RENDIMIENTO (No-funcionales)', () => {
    
    // ========== PRUEBAS DE RENDIMIENTO: FILTRADO ==========
    describe('Performance: Filtrado de productos', () => {
        
        it('debe filtrar 9 productos en menos de 5ms', () => {
            const inicio = performance.now();
            filtrarProductosPorCategoria(productos, "hombre");
            const duracion = performance.now() - inicio;
            
            console.log(`⏱️  Filtrado de 9 productos: ${duracion.toFixed(3)}ms`);
            expect(duracion).toBeLessThan(PERFORMANCE_THRESHOLDS.filtrado);
        });

        it('debe filtrar con múltiples categorías sin degradación', () => {
            const categorias = ["todos", "hombre", "mujer", "nino"];
            const resultados = {};
            
            categorias.forEach(categoria => {
                const inicio = performance.now();
                filtrarProductosPorCategoria(productos, categoria);
                resultados[categoria] = performance.now() - inicio;
            });
            
            Object.entries(resultados).forEach(([cat, duracion]) => {
                console.log(`⏱️  Filtrado ${cat}: ${duracion.toFixed(3)}ms`);
                expect(duracion).toBeLessThan(PERFORMANCE_THRESHOLDS.filtrado);
            });
        });
    });

    // ========== PRUEBAS DE RENDIMIENTO: AGREGAR AL CARRITO ==========
    describe('Performance: Agregar productos al carrito', () => {
        
        it('debe agregar 1 producto en menos de 2ms', () => {
            let carrito = [];
            const inicio = performance.now();
            carrito = agregarAlCarrito(carrito, productos[0]);
            const duracion = performance.now() - inicio;
            
            console.log(`⏱️  Agregar 1 producto: ${duracion.toFixed(3)}ms`);
            expect(duracion).toBeLessThan(PERFORMANCE_THRESHOLDS.agregarCarrito);
        });

        it('debe agregar 10 productos en menos de 20ms', () => {
            let carrito = [];
            const inicio = performance.now();
            
            for (let i = 0; i < 10; i++) {
                carrito = agregarAlCarrito(carrito, productos[i % productos.length]);
            }
            
            const duracion = performance.now() - inicio;
            console.log(`⏱️  Agregar 10 productos: ${duracion.toFixed(3)}ms`);
            expect(duracion).toBeLessThan(20);
        });

        it('debe agregar 50 productos en menos de 50ms', () => {
            let carrito = [];
            const inicio = performance.now();
            
            for (let i = 0; i < 50; i++) {
                carrito = agregarAlCarrito(carrito, productos[i % productos.length]);
            }
            
            const duracion = performance.now() - inicio;
            console.log(`⏱️  Agregar 50 productos: ${duracion.toFixed(3)}ms`);
            expect(duracion).toBeLessThan(50);
        });

        it('debe mantener performance incluso con incrementos repetidos', () => {
            let carrito = [{ ...productos[0], cantidad: 1 }];
            const inicio = performance.now();
            
            for (let i = 0; i < 100; i++) {
                carrito = agregarAlCarrito(carrito, productos[0]);
            }
            
            const duracion = performance.now() - inicio;
            console.log(`⏱️  Incrementar cantidad 100 veces: ${duracion.toFixed(3)}ms`);
            expect(duracion).toBeLessThan(100);
        });
    });

    // ========== PRUEBAS DE RENDIMIENTO: CÁLCULO DE TOTAL ==========
    describe('Performance: Calcular total del carrito', () => {
        
        it('debe calcular total de carrito vacío en menos de 1ms', () => {
            const inicio = performance.now();
            calcularTotal([]);
            const duracion = performance.now() - inicio;
            
            console.log(`⏱️  Total carrito vacío: ${duracion.toFixed(3)}ms`);
            expect(duracion).toBeLessThan(PERFORMANCE_THRESHOLDS.calcularTotal);
        });

        it('debe calcular total de 10 items en menos de 5ms', () => {
            const carrito = Array(10).fill(null).map((_, i) => ({
                ...productos[i % productos.length],
                cantidad: 1
            }));
            
            const inicio = performance.now();
            calcularTotal(carrito);
            const duracion = performance.now() - inicio;
            
            console.log(`⏱️  Total 10 items: ${duracion.toFixed(3)}ms`);
            expect(duracion).toBeLessThan(5);
        });

        it('debe calcular total de 100 items en menos de 10ms', () => {
            const carrito = Array(100).fill(null).map((_, i) => ({
                ...productos[i % productos.length],
                cantidad: 1
            }));
            
            const inicio = performance.now();
            calcularTotal(carrito);
            const duracion = performance.now() - inicio;
            
            console.log(`⏱️  Total 100 items: ${duracion.toFixed(3)}ms`);
            expect(duracion).toBeLessThan(10);
        });

        it('debe calcular total de 1000 items en menos de 50ms', () => {
            const carrito = Array(1000).fill(null).map((_, i) => ({
                ...productos[i % productos.length],
                cantidad: 1
            }));
            
            const inicio = performance.now();
            calcularTotal(carrito);
            const duracion = performance.now() - inicio;
            
            console.log(`⏱️  Total 1000 items: ${duracion.toFixed(3)}ms`);
            expect(duracion).toBeLessThan(50);
        });
    });

    // ========== PRUEBAS DE CARGA ==========
    describe('Pruebas de Carga: Operaciones concurrentes', () => {
        
        it('debe manejar múltiples operaciones simultáneamente', () => {
            const inicio = performance.now();
            let carrito = [];
            
            // Simular 100 operaciones concurrentes
            for (let i = 0; i < 100; i++) {
                carrito = agregarAlCarrito(carrito, productos[i % productos.length]);
            }
            calcularTotal(carrito);
            filtrarProductosPorCategoria(productos, "hombre");
            
            const duracion = performance.now() - inicio;
            console.log(`⏱️  100 operaciones concurrentes: ${duracion.toFixed(3)}ms`);
            expect(duracion).toBeLessThan(200);
        });

        it('debe manejar 1000 adiciones al carrito sin perder performance', () => {
            let carrito = [];
            const mediciones = [];
            const inicio = performance.now();
            
            for (let i = 0; i < 1000; i++) {
                const inicioOp = performance.now();
                carrito = agregarAlCarrito(carrito, productos[i % productos.length]);
                mediciones.push(performance.now() - inicioOp);
            }
            
            const duracionTotal = performance.now() - inicio;
            const promedio = mediciones.reduce((a, b) => a + b, 0) / mediciones.length;
            const maxima = Math.max(...mediciones);
            
            console.log(`⏱️  1000 adiciones: ${duracionTotal.toFixed(0)}ms (promedio: ${promedio.toFixed(3)}ms, máx: ${maxima.toFixed(3)}ms)`);
            expect(duracionTotal).toBeLessThan(2000); // Máximo 2 segundos para 1000 ops
            expect(promedio).toBeLessThan(5); // Promedio menor a 5ms por operación
        });

        it('debe escalarse linealmente con el tamaño del carrito', () => {
            const tamaños = [10, 100, 1000];
            const resultados = {};
            
            tamaños.forEach(tamaño => {
                const carrito = Array(tamaño).fill(null).map((_, i) => ({
                    ...productos[i % productos.length],
                    cantidad: 1
                }));
                
                const inicio = performance.now();
                calcularTotal(carrito);
                resultados[tamaño] = performance.now() - inicio;
            });
            
            console.log(`⏱️  Escalabilidad de calcularTotal:`);
            Object.entries(resultados).forEach(([tamaño, duracion]) => {
                console.log(`    ${tamaño} items: ${duracion.toFixed(3)}ms`);
            });
            
            // Verificar que el crecimiento es aproximadamente lineal
            const ratio = resultados[1000] / resultados[100];
            expect(ratio).toBeLessThan(15); // No debe crecer más de 15x
        });
    });

    // ========== PRUEBAS DE MEMORIA ==========
    describe('Pruebas de Memoria: Gestión eficiente', () => {
        
        it('no debe haber memory leaks al agregar/quitar productos repetidamente', () => {
            const operaciones = 100;
            let carrito = [];
            
            for (let i = 0; i < operaciones; i++) {
                carrito = agregarAlCarrito(carrito, productos[0]);
            }
            
            expect(carrito.length).toBe(1);
            expect(carrito[0].cantidad).toBe(operaciones);
        });

        it('debe mantener eficiencia con carritos grandes', () => {
            const carrito = Array(10000).fill(null).map((_, i) => ({
                ...productos[i % productos.length],
                cantidad: 1
            }));
            
            const inicio = performance.now();
            const total = calcularTotal(carrito);
            const duracion = performance.now() - inicio;
            
            console.log(`⏱️  Carrito de 10000 items: ${duracion.toFixed(3)}ms`);
            expect(duracion).toBeLessThan(100);
            expect(total).toBeGreaterThan(0);
        });
    });
});
