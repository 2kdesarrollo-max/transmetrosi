# Requerimientos del negocio (funcionalidades)

## 1) Acceso y seguridad

1. El sistema debe permitir autenticación de usuarios por credenciales (usuario/contraseña).
2. El sistema debe mantener sesión con tokens (acceso y refresco).
3. El sistema debe autorizar el acceso por roles y permisos a nivel de módulo y endpoint.
4. El sistema debe permitir cierre de sesión y limpieza de sesión inválida/expirada.

## 2) Panel de Control (Dashboard)

1. El sistema debe mostrar un resumen operativo en tiempo real/casi real del estado del servicio.
2. El sistema debe mostrar ocupación por buses y su clasificación (baja/normal/saturación) según umbrales configurables.
3. El sistema debe mostrar alertas operativas (por saturación y por baja ocupación).
4. El sistema debe mostrar órdenes de refuerzo relacionadas con saturación/operación.
5. El sistema debe permitir consultar la configuración operativa usada para la clasificación (umbrales).

## 3) Flota de buses

1. El sistema debe listar buses con sus atributos principales (unidad, placa, modelo, capacidad, estado, ocupación actual).
2. El sistema debe permitir registrar/actualizar ocupación de buses y asociar estación cuando aplique.
3. El sistema debe permitir actualizar estado del bus (en ruta, en estación, mantenimiento, fuera de servicio, etc.).
4. El sistema debe permitir asignar bus a una línea/eje operativo.
5. El sistema debe permitir asignar bus a un parqueo.
6. El sistema debe permitir asignar un piloto a un bus.

## 4) Operación de estaciones y ocupación

1. El sistema debe permitir registrar eventos de ocupación realizados por operadores.
2. El sistema debe registrar el historial de ocupación (bitácora de registros) por bus y estación.
3. El sistema debe generar alertas automáticamente cuando la ocupación sobrepase umbrales de saturación.
4. El sistema debe generar alertas informativas cuando la ocupación esté por debajo de umbrales de baja ocupación.

## 5) Órdenes de refuerzo

1. El sistema debe permitir crear órdenes de refuerzo asociadas a una línea, estación y bus objetivo.
2. El sistema debe manejar estados de la orden (pendiente, alistando, despachado, cancelado, completado).
3. El sistema debe permitir transiciones controladas entre estados.
4. El sistema debe permitir visualizar y dar seguimiento a refuerzos desde la operación.

## 6) Red de ejes (Líneas y estaciones)

1. El sistema debe permitir administrar líneas (ejes/rutas) y sus atributos (nombre, color, municipalidad).
2. El sistema debe permitir administrar estaciones y su capacidad máxima.
3. El sistema debe permitir definir el orden/secuencia de estaciones por línea (relación línea-estación).
4. El sistema debe permitir administrar accesos asociados a estaciones.
5. El sistema debe soportar líneas troncales/circuitos y variantes por sentido cuando se modelen como estaciones distintas.

## 7) Personal

1. El sistema debe permitir administrar pilotos (datos generales e identificación).
2. El sistema debe permitir gestionar asignaciones piloto-bus (vigencia/activo).
3. El sistema debe permitir administrar guardias y sus turnos asociados a accesos.
4. El sistema debe permitir administrar operadores y asociarlos a estaciones y equipos (PC).

## 8) Usuarios y roles

1. El sistema debe permitir listar usuarios y sus roles.
2. El sistema debe permitir activar/desactivar usuarios.
3. El sistema debe permitir que los permisos determinen el acceso a módulos: Dashboard, Flota, Personal, Refuerzos, Red de Ejes, Reportes y Usuarios.

## 9) Reportes

1. El sistema debe permitir consultar reportes operativos.
2. El sistema debe permitir generar consultas relacionadas con ocupación, alertas y refuerzos.

## 10) Configuración operativa

1. El sistema debe permitir definir parámetros de operación (umbrales de saturación y baja ocupación, tiempos/criterios).
2. El sistema debe usar esos parámetros en la generación de alertas y refuerzos.

## 11) Requerimientos no funcionales

1. El sistema debe asegurar integridad referencial entre líneas, estaciones, buses, personal, alertas y refuerzos.
2. El sistema debe manejar correctamente caracteres Unicode en nombres (tildes, ñ).
3. El sistema no debe exponer credenciales ni secretos en el frontend.
4. El sistema debe manejar errores de API sin dejar la UI en estados inconsistentes.
