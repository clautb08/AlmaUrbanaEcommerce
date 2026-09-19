/**
 * PRUEBAS DE CARGA SIMULADAS
 * 
 * Este script simula pruebas de carga sin necesidad de un servidor.
 * Simula múltiples "usuarios virtuales" realizando operaciones simultáneamente.
 * 
 * Usar: node load-testing.js
 */

import { 
    filtrarProductosPorCategoria,
    agregarAlCarrito,
    calcularTotal,
    calcularUnidades,
    productos 
} from './src/utils/carritoUtils.js';

// ========== CONFIGURACIÓN ==========
const CONFIG = {
    usuarios_virtuales: 100,           // Número de usuarios simultáneos
    operaciones_por_usuario: 50,       // Operaciones que cada usuario realiza
    delay_entre_operaciones: 0,        // Delay en ms (0 = sin delay)
    mostrar_detalles: false            // Mostrar log de cada operación
};

// ========== COLORES PARA CONSOLA ==========
const COLORES = {
    reset: '\x1b[0m',
    rojo: '\x1b[31m',
    verde: '\x1b[32m',
    amarillo: '\x1b[33m',
    azul: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(mensaje, color = 'reset') {
    console.log(`${COLORES[color]}${mensaje}${COLORES.reset}`);
}

// ========== SIMULADOR DE USUARIO VIRTUAL ==========
class UsuarioVirtual {
    constructor(id) {
        this.id = id;
        this.carrito = [];
        this.operaciones = 0;
        this.errores = 0;
        this.tiempos = [];
    }

    async realizar_operacion() {
        const operacion = Math.floor(Math.random() * 3);
        const inicio = performance.now();

        try {
            switch(operacion) {
                case 0: // Filtrar productos
                    const categorias = ["todos", "hombre", "mujer", "nino"];
                    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
                    filtrarProductosPorCategoria(productos, categoria);
                    break;

                case 1: // Agregar al carrito
                    const producto = productos[Math.floor(Math.random() * productos.length)];
                    this.carrito = agregarAlCarrito(this.carrito, producto);
                    break;

                case 2: // Calcular total
                    calcularTotal(this.carrito);
                    calcularUnidades(this.carrito);
                    break;
            }

            const duracion = performance.now() - inicio;
            this.tiempos.push(duracion);
            this.operaciones++;

            if (CONFIG.mostrar_detalles) {
                log(`[Usuario ${this.id}] Op ${this.operaciones}: ${duracion.toFixed(3)}ms`, 'cyan');
            }

            return true;
        } catch (error) {
            this.errores++;
            console.error(`[Usuario ${this.id}] Error:`, error.message);
            return false;
        }
    }

    async ejecutar(operaciones) {
        for (let i = 0; i < operaciones; i++) {
            await this.realizar_operacion();
            if (CONFIG.delay_entre_operaciones > 0) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.delay_entre_operaciones));
            }
        }
    }

    obtener_estadisticas() {
        if (this.tiempos.length === 0) return null;

        const ordenados = [...this.tiempos].sort((a, b) => a - b);
        const suma = ordenados.reduce((a, b) => a + b, 0);

        return {
            operaciones: this.operaciones,
            errores: this.errores,
            promedio: suma / ordenados.length,
            minimo: ordenados[0],
            maximo: ordenados[ordenados.length - 1],
            percentil_95: ordenados[Math.floor(ordenados.length * 0.95)],
            percentil_99: ordenados[Math.floor(ordenados.length * 0.99)]
        };
    }
}

// ========== EJECUTOR DE PRUEBA DE CARGA ==========
async function ejecutar_prueba_carga() {
    log('\n' + '='.repeat(70), 'cyan');
    log('  PRUEBA DE CARGA - E-COMMERCE ALMA URBANA', 'cyan');
    log('='.repeat(70) + '\n', 'cyan');

    // Mostrar configuración
    log('📋 CONFIGURACIÓN:', 'azul');
    log(`   • Usuarios virtuales: ${CONFIG.usuarios_virtuales}`);
    log(`   • Operaciones por usuario: ${CONFIG.operaciones_por_usuario}`);
    log(`   • Total de operaciones: ${CONFIG.usuarios_virtuales * CONFIG.operaciones_por_usuario}`);
    log(`   • Delay entre ops: ${CONFIG.delay_entre_operaciones}ms\n`);

    // Crear usuarios
    const usuarios = Array.from({ length: CONFIG.usuarios_virtuales }, (_, i) => new UsuarioVirtual(i + 1));

    // Ejecutar prueba
    log('⏳ Ejecutando prueba de carga...', 'amarillo');
    const inicio_total = performance.now();

    // Ejecutar todas las operaciones en paralelo (simulando usuarios concurrentes)
    await Promise.all(
        usuarios.map(usuario => usuario.ejecutar(CONFIG.operaciones_por_usuario))
    );

    const duracion_total = performance.now() - inicio_total;

    // ========== MOSTRAR RESULTADOS ==========
    log('\n' + '='.repeat(70), 'verde');
    log('  RESULTADOS', 'verde');
    log('='.repeat(70) + '\n', 'verde');

    // Estadísticas globales
    const total_operaciones = usuarios.reduce((sum, u) => sum + u.operaciones, 0);
    const total_errores = usuarios.reduce((sum, u) => sum + u.errores, 0);
    const todos_los_tiempos = usuarios.flatMap(u => u.tiempos);
    const promedio_global = todos_los_tiempos.reduce((a, b) => a + b, 0) / todos_los_tiempos.length;
    
    const tiempos_ordenados = [...todos_los_tiempos].sort((a, b) => a - b);
    const min_global = tiempos_ordenados[0];
    const max_global = tiempos_ordenados[tiempos_ordenados.length - 1];
    const p95 = tiempos_ordenados[Math.floor(tiempos_ordenados.length * 0.95)];
    const p99 = tiempos_ordenados[Math.floor(tiempos_ordenados.length * 0.99)];

    log('📊 ESTADÍSTICAS GLOBALES:', 'azul');
    log(`   • Duración total: ${duracion_total.toFixed(2)}ms (${(duracion_total / 1000).toFixed(2)}s)`);
    log(`   • Total operaciones: ${total_operaciones}`);
    log(`   • Total errores: ${total_errores}`);
    log(`   • Tasa de éxito: ${((1 - total_errores / total_operaciones) * 100).toFixed(2)}%`);
    log(`   • Operaciones/segundo: ${(total_operaciones / (duracion_total / 1000)).toFixed(0)}`);
    
    log('\n⏱️  TIEMPOS DE RESPUESTA:', 'azul');
    log(`   • Promedio: ${promedio_global.toFixed(3)}ms`);
    log(`   • Mínimo: ${min_global.toFixed(3)}ms`);
    log(`   • Máximo: ${max_global.toFixed(3)}ms`);
    log(`   • Percentil 95: ${p95.toFixed(3)}ms`);
    log(`   • Percentil 99: ${p99.toFixed(3)}ms`);

    // Por usuario
    log('\n👥 ESTADÍSTICAS POR USUARIO (muestra):', 'azul');
    const usuarios_muestra = [usuarios[0], usuarios[Math.floor(usuarios.length / 2)], usuarios[usuarios.length - 1]];
    
    usuarios_muestra.forEach(usuario => {
        const stats = usuario.obtener_estadisticas();
        if (stats) {
            log(`\n   Usuario ${usuario.id}:`, 'cyan');
            log(`   ├─ Operaciones: ${stats.operaciones}`);
            log(`   ├─ Errores: ${stats.errores}`);
            log(`   ├─ Promedio: ${stats.promedio.toFixed(3)}ms`);
            log(`   ├─ Rango: ${stats.minimo.toFixed(3)}ms - ${stats.maximo.toFixed(3)}ms`);
            log(`   └─ P95/P99: ${stats.percentil_95.toFixed(3)}ms / ${stats.percentil_99.toFixed(3)}ms`);
        }
    });

    // Validación de rendimiento
    log('\n✅ VALIDACIONES DE RENDIMIENTO:', 'azul');
    const validaciones = [
        { nombre: 'Tiempo promedio < 5ms', condicion: promedio_global < 5, valor: promedio_global.toFixed(3) + 'ms' },
        { nombre: 'P95 < 20ms', condicion: p95 < 20, valor: p95.toFixed(3) + 'ms' },
        { nombre: 'Duración total < 30s', condicion: duracion_total < 30000, valor: (duracion_total / 1000).toFixed(2) + 's' },
        { nombre: 'Tasa de éxito > 99%', condicion: (1 - total_errores / total_operaciones) * 100 > 99, valor: ((1 - total_errores / total_operaciones) * 100).toFixed(2) + '%' }
    ];

    validaciones.forEach(v => {
        const simbolo = v.condicion ? '✓' : '✗';
        const color = v.condicion ? 'verde' : 'rojo';
        log(`   ${simbolo} ${v.nombre}: ${v.valor}`, color);
    });

    // Resumen
    log('\n' + '='.repeat(70), 'cyan');
    const todas_pasadas = validaciones.every(v => v.condicion);
    if (todas_pasadas) {
        log('  ✅ PRUEBA DE CARGA EXITOSA - Sistema mantiene buen rendimiento', 'verde');
    } else {
        log('  ⚠️  Algunas validaciones no pasaron - Revisar problemas de performance', 'amarillo');
    }
    log('='.repeat(70) + '\n', 'cyan');

    return {
        exitoso: todas_pasadas,
        estadisticas: {
            duracion_total,
            total_operaciones,
            total_errores,
            promedio_global,
            min_global,
            max_global,
            p95,
            p99
        }
    };
}

// ========== EJECUTAR ==========
ejecutar_prueba_carga().catch(err => {
    log('Error en prueba de carga:', 'rojo');
    console.error(err);
    process.exit(1);
});
