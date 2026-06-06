# 🚌 Sistema de Control Transmetro — Prompt Maestro

> Stack: React + Node.js + Express + MySQL | Despliegue: Railway

---

## 🧠 Prompt principal (pegar al inicio de cada conversación)

```
Eres la empresa Arvity solutions trabajando en el Sistema de Control
Transmetro de la Ciudad de Guatemala.

Stack tecnológico:
- Frontend: React 18 + Vite + Tailwind CSS + React Router + Axios
- Backend: Node.js + Express + Sequelize ORM + JWT + dotenv
- Base de datos: MySQL 8 (Railway)
- Despliegue: Railway (todo en uno)

Siempre responde en español. Escribe código limpio, comentado y listo
para producción. Cuando generes archivos, indícame claramente el nombre
y la ruta donde debo guardarlo dentro del proyecto.
```

---

## 📦 Contexto del sistema

El sistema gestiona la operación completa de la red de transporte masivo
Transmetro de Guatemala. Estas son las entidades principales:

| Entidad | Descripción |
|---|---|
| `MUNICIPALIDAD` | Cada línea y estación pertenece a una municipalidad |
| `LÍNEA` | Compuesta por estaciones en orden específico |
| `ESTACIÓN` | Pertenece a una o varias líneas, tiene accesos y guardias |
| `ACCESO` | Pertenece exclusivamente a una estación |
| `BUS` | Asignado a una sola línea o a ninguna, siempre tiene parqueo |
| `PARQUEO` | Puede tener varios buses asignados |
| `PILOTO` | Con historial educativo, residencia y datos de comunicación |
| `GUARDIA` | Mínimo uno por acceso de estación |
| `OPERADOR` | Uno por estación, controla la PC de trabajo |

---

## ⚙️ Reglas de negocio críticas

```
- Buses por línea mínimo  → igual al número de estaciones de la línea
- Buses por línea máximo  → el doble del número de estaciones
- Alerta de capacidad     → si una estación tiene 50% más de su capacidad,
                            generar alerta para que llegue otro bus
- Espera por baja ocupación → si un bus no llena el 25% de su capacidad,
                              esperar 5 minutos extra en cada estación
- Bus sin línea           → un bus puede no estar asignado a ninguna línea
                            pero SIEMPRE debe tener parqueo
- Cambio de parqueo       → un bus puede cambiar de parqueo pero nunca
                            quedarse sin uno
- Red de PCs              → proponer arquitectura de conectividad entre
                            las PCs de cada estación (WebSockets o polling)
```

---

## 🗂️ Estructura del proyecto

```
transmetro/
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables (Tabla, Modal, Alerta)
│   │   ├── pages/           # Vistas (Dashboard, Líneas, Buses, Pilotos...)
│   │   ├── services/        # Llamadas a la API con axios
│   │   └── context/         # Estado global
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/          # Endpoints REST
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── models/          # Modelos Sequelize
│   │   └── middleware/      # Auth, errores, motor de alertas
│   └── package.json
└── database/
    ├── schema.sql            # Creación de tablas
    └── seed.sql              # Datos de prueba reales
```

---

## 🚀 Comandos de inicio rápido

Ejecutar en la terminal de VS Code:

```bash
# 1. Crear carpeta raíz
mkdir transmetro && cd transmetro

# 2. Crear el frontend
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios react-router-dom
cd ..

# 3. Crear el backend
mkdir backend && cd backend
npm init -y
npm install express sequelize mysql2 dotenv cors bcryptjs jsonwebtoken
npm install -D nodemon
cd ..

# 4. Inicializar Git
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
git add .
git commit -m "Inicializar proyecto Transmetro"
```

---

## 📋 Prompts por fase

### Fase 1 — Base de datos MySQL

```
Crea el script SQL completo para MySQL con todas las tablas del sistema
Transmetro. Incluye las siguientes tablas:
municipalidad, linea, estacion, linea_estacion (orden + distancia entre
estaciones), acceso, parqueo, bus, piloto, historial_educativo_piloto,
guardia, operador.

Aplica todas las constraints, foreign keys y las reglas de negocio como
CHECK constraints. Al final incluye un script seed.sql con datos reales
basados en las líneas existentes del Transmetro de Guatemala:
Línea 1, 2, 6, 7, 12, 13 y 18.
```

---

### Fase 2 — Backend Node.js + Express

```
Crea el proyecto backend completo en Node.js + Express + Sequelize para
el sistema Transmetro. Incluye:
- Estructura de carpetas completa
- package.json con todas las dependencias
- Modelos Sequelize para cada tabla
- Rutas REST para cada módulo: líneas, estaciones, buses, pilotos,
  parqueos, personal y reportes
- Middleware de manejo de errores centralizado
- Motor de alertas de capacidad (lógica del 50% y del 25%)
- Variables de entorno para la conexión a MySQL de Railway
- Archivo .env.example documentado
```

---

### Fase 3 — Frontend React

```
Crea el proyecto frontend completo en React 18 + Vite + Tailwind CSS
para el sistema Transmetro. Incluye:
- Estructura de carpetas completa
- Todas las páginas: Dashboard, Líneas, Estaciones, Buses, Pilotos,
  Parqueos, Personal y Reportes
- Componentes reutilizables: Tabla, Modal, Formulario, AlertaBus,
  Sidebar y Navbar
- Servicios axios para cada módulo del backend
- Panel de alertas de capacidad en tiempo real
- Diseño con colores del Transmetro Guatemala (verde #4CAF50 principal)
```

---

### Fase 4 — Despliegue en Railway

```
Guíame paso a paso para desplegar el sistema Transmetro completo en
Railway. El proyecto tiene: frontend React (Vite), backend Node.js +
Express, y base de datos MySQL.

Necesito:
1. Crear el servicio MySQL en Railway y obtener las credenciales
2. Configurar las variables de entorno del backend
3. Desplegar el backend desde GitHub con Railway
4. Desplegar el frontend desde GitHub con Railway
5. Verificar que todo funcione con el dominio público generado
```

---

## 📊 Módulos del sistema

### Módulo 1 — Líneas y estaciones
- CRUD completo de líneas con estaciones en orden
- Asignación de municipalidad a cada línea y estación
- Cálculo de distancia entre estaciones y distancia total de línea
- Vista de recorrido ordenado

### Módulo 2 — Buses y flota
- CRUD de buses con capacidad máxima de pasajeros
- Asignación de bus a línea respetando regla min/max
- Motor de alertas: 50% capacidad → alerta automática
- Lógica de espera: menos del 25% ocupación → 5 minutos extra
- Dashboard de estado de flota

### Módulo 3 — Parqueos
- CRUD de parqueos
- Asignación obligatoria de parqueo a bus
- Historial de cambios de parqueo por bus

### Módulo 4 — Pilotos
- CRUD con historial educativo completo
- Datos de residencia y comunicación
- Asignación de piloto a bus

### Módulo 5 — Personal de estación
- Gestión de guardias (mínimo uno por acceso)
- Gestión de operadores (uno por estación)
- Control de accesos por estación

### Módulo 6 — Reportes
- Reporte de estaciones: accesos, guardias, operador, líneas
- Reporte de líneas: estaciones en orden, distancia total, buses
- Reporte de buses asignados con estado de ocupación
- Queries documentados en el código y en el documento del proyecto

---

## 🗃️ Datos reales del Transmetro

| Línea | Recorrido | Estaciones | Buses |
|---|---|---|---|
| Línea 12 (Eje Sur) | Centra Sur → Plaza Barrios Z.1 | 14 | 86 articulados |
| Línea 2 (Corredor Central) | Hipódromo Norte Z.2 → San Sebastián Z.1 | 18 | 30 Scania |
| Línea 6 (Norte Z.6) | Proyectos Z.6 → FEGUA Z.1 | 10 | 66 articulados |
| Línea 1 | San Sebastián Z.1 → Centro Cívico Z.1 | — | — |
| Línea 7 | USAC Periférico Z.12 → La Merced Z.1 | — | — |
| Línea 13 | Hangares Z.13 → Tipografía Z.1 | — | — |
| Línea 18 | Atlántida Z.18 → FEGUA Z.1 | — | — |

| Dato operativo | Valor |
|---|---|
| Tarifa | Q.1.00 |
| Exentos | Mayores 65 años, menores 7 años, discapacitados |
| Velocidad promedio | 17 km/h |
| Velocidad máxima | 25 km/h |
| Capacidad bus articulado | 160 pasajeros |
| Capacidad bus Scania | 150 pasajeros |
| Horario Eje Sur | 4:30 – 23:00 horas |
| Horario Corredor Central | 5:00 – 22:00 horas |

---

## 📝 Notas importantes

- Siempre validar datos tanto en frontend como en backend
- Cada endpoint debe retornar errores con respuestas JSON estructuradas
- Los queries de reportes deben estar documentados en el código
- El motor de alertas se ejecuta al registrar ocupación de buses
- Conectividad entre PCs: proponer WebSockets o polling cada 30 segundos
- Probar todo en `localhost` antes de desplegar en Railway

---

*Sistema de Control Transmetro — Ciudad de Guatemala*  
*Ingeniería del Software — Ing. Nancy Portillo*
