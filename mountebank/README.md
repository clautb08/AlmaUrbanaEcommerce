# Stubs de Mountebank para Alma Urbana

Este directorio incluye una configuración de Mountebank para emular los endpoints REST que usa la aplicación:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user`
- `GET /api/admin`

## Requisitos

Instala Mountebank y ejecuta el servidor en el puerto 3000 para que el frontend pueda consumir los stubs sin cambiar la configuración del proyecto.

## Arranque

```bash
mb --configfile ./mountebank/ecommerce-stubs.json
```

Si prefieres usar la CLI con el binario instalado globalmente:

```bash
mountebank --configfile ./mountebank/ecommerce-stubs.json
```

## Usuarios y tokens simulados

- Usuario válido: `ana@example.com` / `Ana12345!`
  - Token: `valid-user-token`
- Administrador válido: `admin@local.test` / `Admin123!`
  - Token: `valid-admin-token`

## Casos cubiertos

- Registro exitoso y duplicado
- Login exitoso con usuario y administrador
- Error 400 por validación de Joi
- Error 401 por credenciales inválidas
- Error 429 por bloqueo por demasiados intentos
- Respuestas protegidas para `/api/user` y `/api/admin`
- Headers CORS compatibles con `http://localhost:5173`

## Probar los stubs

```bash
curl http://localhost:3000/api/health

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"Ana12345!"}'

curl -H "Authorization: Bearer valid-user-token" http://localhost:3000/api/user

curl -H "Authorization: Bearer valid-admin-token" http://localhost:3000/api/admin
```
