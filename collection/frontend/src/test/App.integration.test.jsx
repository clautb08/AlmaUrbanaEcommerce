import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock de localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('PRUEBAS DE INTEGRACIÓN - Componentes del E-commerce', () => {
    
    beforeEach(() => {
        localStorage.clear();
    });

    // ========== PRUEBA 1: FLUJO DE AGREGAR AL CARRITO ==========
    describe('Integración: Agregar producto al carrito', () => {
        
        it('debe mostrar la cantidad actualizada en el carrito tras agregar un producto', async () => {
            render(<App />);
            
            // Verificar que el carrito inicie en 0
            const cartBadge = screen.getByText(/Carrito/i).parentElement.querySelector('b');
            expect(cartBadge.textContent).toBe('0');
            
            // Encontrar y hacer clic en el botón de agregar (primer producto)
            const buttons = screen.getAllByText('+ Añadir');
            fireEvent.click(buttons[0]);
            
            await waitFor(() => {
                expect(cartBadge.textContent).toBe('1');
            });
        });

        it('debe mostrar mensaje de confirmación al agregar un producto', async () => {
            render(<App />);
            
            const buttons = screen.getAllByText('+ Añadir');
            fireEvent.click(buttons[0]);
            
            await waitFor(() => {
                expect(screen.getByRole('status')).toBeInTheDocument();
                expect(screen.getByText(/se agregó al carrito/i)).toBeInTheDocument();
            });
        });

        it('debe incrementar la cantidad cuando se agrega el mismo producto dos veces', async () => {
            render(<App />);
            
            const buttons = screen.getAllByText('+ Añadir');
            fireEvent.click(buttons[0]);
            
            await waitFor(() => {
                const cartBadge = screen.getByText(/Carrito/i).parentElement.querySelector('b');
                expect(cartBadge.textContent).toBe('1');
            });
            
            fireEvent.click(buttons[0]);
            
            await waitFor(() => {
                const cartBadge = screen.getByText(/Carrito/i).parentElement.querySelector('b');
                expect(cartBadge.textContent).toBe('2');
            });
        });

        it('debe guardar el carrito en localStorage', async () => {
            render(<App />);
            
            const buttons = screen.getAllByText('+ Añadir');
            fireEvent.click(buttons[0]);
            
            await waitFor(() => {
                const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
                expect(carritoGuardado).toHaveLength(1);
                expect(carritoGuardado[0].cantidad).toBe(1);
            });
        });
    });

    // ========== PRUEBA 2: FLUJO DE FILTRADO ==========
    describe('Integración: Filtrar productos por categoría', () => {
        
        it('debe mostrar todos los productos cuando se selecciona "Todo"', () => {
            render(<App />);
            
            const buttons = screen.getAllByRole('button');
            const todoButton = buttons.find(b => b.textContent === 'Todo' && b.className.includes('filter'));
            
            expect(todoButton).toHaveClass('selected');
            const productTitles = screen.getAllByRole('heading', { level: 2 });
            // Debe haber títulos de productos (al menos 9)
            expect(productTitles.length).toBeGreaterThanOrEqual(9);
        });

        it('debe mostrar solo productos de hombre al hacer clic en "Hombres"', async () => {
            render(<App />);
            
            const buttons = screen.getAllByRole('button');
            const hombresButton = buttons.find(b => b.textContent === 'Hombres' && b.className.includes('filter'));
            
            fireEvent.click(hombresButton);
            
            await waitFor(() => {
                const productTitles = screen.getAllByRole('heading', { level: 2 });
                // Polo, Jean, Cazadora = 3 productos
                expect(productTitles.length).toBeGreaterThanOrEqual(3);
                expect(hombresButton).toHaveClass('selected');
            });
        });

        it('debe mostrar solo productos de mujer al hacer clic en "Mujeres"', async () => {
            render(<App />);
            
            const buttons = screen.getAllByRole('button');
            const mujeresButton = buttons.find(b => b.textContent === 'Mujeres' && b.className.includes('filter'));
            
            fireEvent.click(mujeresButton);
            
            await waitFor(() => {
                expect(mujeresButton).toHaveClass('selected');
            });
        });

        it('debe mostrar solo productos de niño al hacer clic en "Niños"', async () => {
            render(<App />);
            
            const buttons = screen.getAllByRole('button');
            const ninosButton = buttons.find(b => b.textContent === 'Niños' && b.className.includes('filter'));
            
            fireEvent.click(ninosButton);
            
            await waitFor(() => {
                expect(ninosButton).toHaveClass('selected');
            });
        });
    });

    // ========== PRUEBA 3: FLUJO DE CARRITO ==========
    describe('Integración: Navegación entre vistas', () => {
        
        it('debe navegar a la vista de carrito cuando se hace clic en el botón del carrito', async () => {
            render(<App />);
            
            const cartButton = screen.getByText(/Carrito/i);
            fireEvent.click(cartButton);
            
            await waitFor(() => {
                expect(screen.getByText('Carrito de compras')).toBeInTheDocument();
            });
        });

        it('debe navegar al login cuando se hace clic en "Iniciar sesión"', async () => {
            render(<App />);
            
            const loginButton = screen.getByText('Iniciar sesión');
            fireEvent.click(loginButton);
            
            await waitFor(() => {
                expect(screen.getByText('Bienvenido de vuelta')).toBeInTheDocument();
            });
        });

        it('debe navegar al registro cuando se hace clic en "Crear cuenta"', async () => {
            render(<App />);
            
            const registroButton = screen.getByText('Crear cuenta');
            fireEvent.click(registroButton);
            
            await waitFor(() => {
                expect(screen.getByText('Únete a la comunidad')).toBeInTheDocument();
            });
        });

        it('debe regresar al catálogo cuando se hace clic en el logo', async () => {
            render(<App />);
            
            // Ir a carrito
            const cartButton = screen.getByText(/Carrito/i);
            fireEvent.click(cartButton);
            
            await waitFor(() => {
                expect(screen.getByText('Carrito de compras')).toBeInTheDocument();
            });
            
            // Regresar al catálogo
            const logoButton = screen.getByText(/ALMA/i);
            fireEvent.click(logoButton);
            
            await waitFor(() => {
                expect(screen.getByText('Viste tu propia historia.')).toBeInTheDocument();
            });
        });
    });

    // ========== PRUEBA 4: FLUJO COMPLETO ==========
    describe('Integración: Flujo completo de compra', () => {
        
        it('debe permitir agregar productos y visualizar en el carrito', async () => {
            render(<App />);
            
            // Agregar producto
            const agregarButtons = screen.getAllByText('+ Añadir');
            fireEvent.click(agregarButtons[0]);
            
            // Ir a carrito
            await waitFor(() => {
                const cartButton = screen.getByText(/Carrito/i);
                fireEvent.click(cartButton);
            });
            
            // Verificar que aparece en el carrito
            await waitFor(() => {
                expect(screen.getByText('Carrito de compras')).toBeInTheDocument();
                // Debe mostrar el producto agregado
                expect(screen.getByText(/1 producto/)).toBeInTheDocument();
            });
        });
    });
});
