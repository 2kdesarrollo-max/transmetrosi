TRUNCATE TABLE ROL_PERMISO CASCADE;
TRUNCATE TABLE PERMISO CASCADE;
TRUNCATE TABLE CONFIG_PARAM CASCADE;
TRUNCATE TABLE CAT_TRANSICION_REFUERZO CASCADE;
TRUNCATE TABLE CAT_TIPO_ALERTA CASCADE;
TRUNCATE TABLE CAT_TURNO_GUARDIA CASCADE;
TRUNCATE TABLE CAT_ESTADO_REFUERZO CASCADE;
TRUNCATE TABLE CAT_ESTADO_BUS CASCADE;
TRUNCATE TABLE REFRESH_TOKEN CASCADE;
TRUNCATE TABLE BITACORA_AUDITORIA CASCADE;
TRUNCATE TABLE ALERTA_SATURACION CASCADE;
TRUNCATE TABLE ALERTA CASCADE;
TRUNCATE TABLE REGISTRO_OCUPACION CASCADE;
TRUNCATE TABLE ORDEN_REFUERZO CASCADE;
TRUNCATE TABLE ASIGNACION_PILOTO_BUS CASCADE;
TRUNCATE TABLE HISTORIAL_EDUCATIVO CASCADE;
TRUNCATE TABLE GUARDIA CASCADE;
TRUNCATE TABLE OPERADOR CASCADE;
TRUNCATE TABLE ACCESO CASCADE;
TRUNCATE TABLE BUS CASCADE;
TRUNCATE TABLE PILOTO CASCADE;
TRUNCATE TABLE PARQUEO CASCADE;
TRUNCATE TABLE LINEA_ESTACION CASCADE;
TRUNCATE TABLE ESTACION CASCADE;
TRUNCATE TABLE LINEA CASCADE;
TRUNCATE TABLE MUNICIPALIDAD CASCADE;
TRUNCATE TABLE USUARIO CASCADE;
TRUNCATE TABLE ROL CASCADE;

INSERT ALL
  INTO rol (codigo, nombre, activo) VALUES ('SUPER_ADMIN', 'Super Admin', 1)
  INTO rol (codigo, nombre, activo) VALUES ('ADMIN_EMT', 'Admin EMT', 1)
  INTO rol (codigo, nombre, activo) VALUES ('OPERADOR', 'Operador', 1)
  INTO rol (codigo, nombre, activo) VALUES ('SUPERVISOR_LINEA', UNISTR('Supervisor de L\\00EDnea'), 1)
  INTO rol (codigo, nombre, activo) VALUES ('AUDITOR_DIRECCION', UNISTR('Auditor/Direcci\\00F3n'), 1)
SELECT 1 FROM dual;

INSERT ALL
  INTO permiso (codigo, descripcion) VALUES ('dashboard:read', 'Ver panel de control')
  INTO permiso (codigo, descripcion) VALUES ('usuarios:read', 'Listar usuarios')
  INTO permiso (codigo, descripcion) VALUES ('usuarios:write', 'Crear/editar usuarios')
  INTO permiso (codigo, descripcion) VALUES ('municipalidades:read', 'Listar municipalidades')
  INTO permiso (codigo, descripcion) VALUES ('municipalidades:write', 'Crear/editar municipalidades')
  INTO permiso (codigo, descripcion) VALUES ('lineas:read', 'Listar líneas')
  INTO permiso (codigo, descripcion) VALUES ('lineas:write', 'Crear/editar líneas')
  INTO permiso (codigo, descripcion) VALUES ('estaciones:read', 'Listar estaciones')
  INTO permiso (codigo, descripcion) VALUES ('estaciones:write', 'Crear/editar estaciones')
  INTO permiso (codigo, descripcion) VALUES ('accesos:read', 'Listar accesos')
  INTO permiso (codigo, descripcion) VALUES ('accesos:write', 'Crear/editar accesos')
  INTO permiso (codigo, descripcion) VALUES ('guardias:read', 'Listar guardias')
  INTO permiso (codigo, descripcion) VALUES ('guardias:write', 'Crear/editar guardias')
  INTO permiso (codigo, descripcion) VALUES ('operadores:read', 'Listar operadores')
  INTO permiso (codigo, descripcion) VALUES ('operadores:write', 'Crear/editar operadores')
  INTO permiso (codigo, descripcion) VALUES ('parqueos:read', 'Listar parqueos')
  INTO permiso (codigo, descripcion) VALUES ('parqueos:write', 'Crear/editar parqueos')
  INTO permiso (codigo, descripcion) VALUES ('buses:read', 'Listar buses')
  INTO permiso (codigo, descripcion) VALUES ('buses:write', 'Crear/editar buses')
  INTO permiso (codigo, descripcion) VALUES ('pilotos:read', 'Listar pilotos')
  INTO permiso (codigo, descripcion) VALUES ('pilotos:write', 'Crear/editar pilotos')
  INTO permiso (codigo, descripcion) VALUES ('asignaciones:read', 'Listar asignaciones')
  INTO permiso (codigo, descripcion) VALUES ('asignaciones:write', 'Crear/editar asignaciones')
  INTO permiso (codigo, descripcion) VALUES ('ocupacion:write', 'Registrar ocupación')
  INTO permiso (codigo, descripcion) VALUES ('alertas:read', 'Ver alertas')
  INTO permiso (codigo, descripcion) VALUES ('alertas:write', 'Marcar alertas')
  INTO permiso (codigo, descripcion) VALUES ('refuerzos:read', 'Ver órdenes de refuerzo')
  INTO permiso (codigo, descripcion) VALUES ('refuerzos:write', 'Gestionar órdenes de refuerzo')
  INTO permiso (codigo, descripcion) VALUES ('reportes:read', 'Ver reportes')
SELECT 1 FROM dual;

INSERT ALL
  INTO cat_estado_bus (codigo, nombre, ui_class, activo, orden) VALUES ('ListoParaAccion', 'Listo para Acción', 'bg-muni-green/10 text-muni-green', 1, 10)
  INTO cat_estado_bus (codigo, nombre, ui_class, activo, orden) VALUES ('Alistando', 'Alistando', 'bg-muni-orange/10 text-muni-orange', 1, 20)
  INTO cat_estado_bus (codigo, nombre, ui_class, activo, orden) VALUES ('EnRuta', 'En Ruta', 'bg-muni-blue/10 text-muni-blue', 1, 30)
  INTO cat_estado_bus (codigo, nombre, ui_class, activo, orden) VALUES ('EnEstacion', UNISTR('En Estaci\\00F3n'), 'bg-slate-200 text-slate-600', 1, 40)
  INTO cat_estado_bus (codigo, nombre, ui_class, activo, orden) VALUES ('EsperaProlongada', 'Espera Prolongada', 'bg-muni-orange/10 text-muni-orange', 1, 50)
  INTO cat_estado_bus (codigo, nombre, ui_class, activo, orden) VALUES ('Refuerzo', 'Refuerzo', 'bg-muni-cyan/10 text-muni-cyan', 1, 60)
  INTO cat_estado_bus (codigo, nombre, ui_class, activo, orden) VALUES ('Mantenimiento', 'Mantenimiento', 'bg-muni-red/10 text-muni-red', 1, 70)
  INTO cat_estado_bus (codigo, nombre, ui_class, activo, orden) VALUES ('FueraDeServicio', 'Fuera de Servicio', 'bg-slate-200 text-slate-500', 1, 80)
SELECT 1 FROM dual;

INSERT ALL
  INTO cat_estado_refuerzo (codigo, nombre, ui_class, activo, orden) VALUES ('pendiente', 'Pendiente', 'bg-muni-orange text-white', 1, 10)
  INTO cat_estado_refuerzo (codigo, nombre, ui_class, activo, orden) VALUES ('alistando', 'Alistando', 'bg-muni-orange text-white animate-pulse', 1, 20)
  INTO cat_estado_refuerzo (codigo, nombre, ui_class, activo, orden) VALUES ('despachado', 'Despachado', 'bg-muni-blue text-white', 1, 30)
  INTO cat_estado_refuerzo (codigo, nombre, ui_class, activo, orden) VALUES ('cancelado', 'Cancelado', 'bg-slate-200 text-slate-600', 1, 40)
  INTO cat_estado_refuerzo (codigo, nombre, ui_class, activo, orden) VALUES ('completado', 'Completado', 'bg-muni-green text-white', 1, 50)
SELECT 1 FROM dual;

INSERT ALL
  INTO cat_transicion_refuerzo (desde_estado, hacia_estado) VALUES ('pendiente', 'alistando')
  INTO cat_transicion_refuerzo (desde_estado, hacia_estado) VALUES ('pendiente', 'cancelado')
  INTO cat_transicion_refuerzo (desde_estado, hacia_estado) VALUES ('alistando', 'despachado')
  INTO cat_transicion_refuerzo (desde_estado, hacia_estado) VALUES ('alistando', 'cancelado')
  INTO cat_transicion_refuerzo (desde_estado, hacia_estado) VALUES ('despachado', 'completado')
SELECT 1 FROM dual;

INSERT ALL
  INTO cat_tipo_alerta (codigo, nombre, ui_class, activo) VALUES ('saturacion', UNISTR('Saturaci\\00F3n'), 'bg-muni-red/10 text-muni-red', 1)
  INTO cat_tipo_alerta (codigo, nombre, ui_class, activo) VALUES ('baja_ocupacion', UNISTR('Baja ocupaci\\00F3n'), 'bg-muni-orange/10 text-muni-orange', 1)
SELECT 1 FROM dual;

INSERT ALL
  INTO cat_turno_guardia (codigo, nombre, ui_class, activo, orden) VALUES ('matutino', 'Matutino', 'bg-muni-blue/10 text-muni-blue', 1, 10)
  INTO cat_turno_guardia (codigo, nombre, ui_class, activo, orden) VALUES ('vespertino', 'Vespertino', 'bg-muni-orange/10 text-muni-orange', 1, 20)
  INTO cat_turno_guardia (codigo, nombre, ui_class, activo, orden) VALUES ('nocturno', 'Nocturno', 'bg-slate-200 text-slate-700', 1, 30)
SELECT 1 FROM dual;

INSERT ALL
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('SATURATION_RATIO', 1.5, NULL, 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('LOW_OCCUPANCY_RATIO', 0.25, NULL, 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('LOW_OCCUPANCY_WAIT_MIN', 5, NULL, 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('LINEA_MIN_BUSES_PER_ESTACION', 1, NULL, 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('LINEA_MAX_BUSES_MULTIPLIER', 2, NULL, 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('ALERTA_TIPO_SATURACION', NULL, 'saturacion', 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('ALERTA_TIPO_BAJA_OCUPACION', NULL, 'baja_ocupacion', 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('REFUERZO_ESTADO_INICIAL', NULL, 'pendiente', 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('BUS_ESTADO_INICIAL', NULL, 'ListoParaAccion', 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('BUS_ESTADO_MANTENIMIENTO', NULL, 'Mantenimiento', 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('BUS_ESTADO_FUERA_SERVICIO', NULL, 'FueraDeServicio', 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('BUS_ESTADO_EN_ESTACION', NULL, 'EnEstacion', 1)
  INTO config_param (clave, valor_num, valor_text, activo) VALUES ('BUS_ESTADO_ESPERA_PROLONGADA', NULL, 'EsperaProlongada', 1)
SELECT 1 FROM dual;

INSERT ALL
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'dashboard:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'usuarios:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'usuarios:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'municipalidades:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'municipalidades:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'lineas:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'lineas:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'estaciones:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'estaciones:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'accesos:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'accesos:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'guardias:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'guardias:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'operadores:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'operadores:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'parqueos:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'parqueos:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'buses:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'buses:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'pilotos:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'pilotos:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'asignaciones:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'asignaciones:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'ocupacion:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'alertas:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'alertas:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'refuerzos:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'refuerzos:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'), (SELECT id FROM permiso WHERE codigo = 'reportes:read'))
SELECT 1 FROM dual;

INSERT ALL
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'dashboard:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'municipalidades:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'lineas:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'lineas:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'estaciones:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'estaciones:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'accesos:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'accesos:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'guardias:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'guardias:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'operadores:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'operadores:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'parqueos:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'parqueos:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'buses:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'buses:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'pilotos:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'pilotos:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'asignaciones:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'asignaciones:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'refuerzos:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'), (SELECT id FROM permiso WHERE codigo = 'refuerzos:write'))
SELECT 1 FROM dual;

INSERT ALL
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'OPERADOR'), (SELECT id FROM permiso WHERE codigo = 'dashboard:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'OPERADOR'), (SELECT id FROM permiso WHERE codigo = 'ocupacion:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'OPERADOR'), (SELECT id FROM permiso WHERE codigo = 'alertas:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'OPERADOR'), (SELECT id FROM permiso WHERE codigo = 'refuerzos:read'))
SELECT 1 FROM dual;

INSERT ALL
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPERVISOR_LINEA'), (SELECT id FROM permiso WHERE codigo = 'dashboard:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPERVISOR_LINEA'), (SELECT id FROM permiso WHERE codigo = 'buses:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPERVISOR_LINEA'), (SELECT id FROM permiso WHERE codigo = 'alertas:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPERVISOR_LINEA'), (SELECT id FROM permiso WHERE codigo = 'refuerzos:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPERVISOR_LINEA'), (SELECT id FROM permiso WHERE codigo = 'refuerzos:write'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'SUPERVISOR_LINEA'), (SELECT id FROM permiso WHERE codigo = 'reportes:read'))
SELECT 1 FROM dual;

INSERT ALL
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'AUDITOR_DIRECCION'), (SELECT id FROM permiso WHERE codigo = 'dashboard:read'))
  INTO rol_permiso (rol_id, permiso_id) VALUES ((SELECT id FROM rol WHERE codigo = 'AUDITOR_DIRECCION'), (SELECT id FROM permiso WHERE codigo = 'reportes:read'))
SELECT 1 FROM dual;

INSERT ALL
  INTO usuario (username, password_hash, rol_id, rol, nombre, activo) VALUES (
    'superadmin',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'SUPER_ADMIN'),
    (SELECT nombre FROM rol WHERE codigo = 'SUPER_ADMIN'),
    (SELECT nombre FROM rol WHERE codigo = 'SUPER_ADMIN'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, activo) VALUES (
    'adminemt',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'ADMIN_EMT'),
    (SELECT nombre FROM rol WHERE codigo = 'ADMIN_EMT'),
    (SELECT nombre FROM rol WHERE codigo = 'ADMIN_EMT'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, activo) VALUES (
    'operador',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, activo) VALUES (
    'supervisor',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'SUPERVISOR_LINEA'),
    (SELECT nombre FROM rol WHERE codigo = 'SUPERVISOR_LINEA'),
    (SELECT nombre FROM rol WHERE codigo = 'SUPERVISOR_LINEA'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, activo) VALUES (
    'auditor',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'AUDITOR_DIRECCION'),
    (SELECT nombre FROM rol WHERE codigo = 'AUDITOR_DIRECCION'),
    (SELECT nombre FROM rol WHERE codigo = 'AUDITOR_DIRECCION'),
    1
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO municipalidad (nombre, direccion, telefono) VALUES ('Municipalidad de Guatemala', '21 Calle 6-77, Zona 1', '2285-8000')
  INTO municipalidad (nombre, direccion, telefono) VALUES ('Municipalidad de Mixco', '4a Av. 7-12, Zona 1 de Mixco', '2433-2211')
SELECT 1 FROM dual;

INSERT ALL
  INTO linea (nombre, color, municipalidad_id) VALUES (UNISTR('L\\00EDnea 12'), 'muni-orange', (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO linea (nombre, color, municipalidad_id) VALUES (UNISTR('L\\00EDnea 13'), 'muni-green', (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO linea (nombre, color, municipalidad_id) VALUES (UNISTR('L\\00EDnea 1'), 'muni-blue', (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO linea (nombre, color, municipalidad_id) VALUES (UNISTR('L\\00EDnea 2'), 'muni-blue', (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO linea (nombre, color, municipalidad_id) VALUES ('Ruta 5', 'muni-orange', (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO linea (nombre, color, municipalidad_id) VALUES (UNISTR('L\\00EDnea 6'), 'muni-orange', (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO linea (nombre, color, municipalidad_id) VALUES (UNISTR('L\\00EDnea 7'), 'muni-green', (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO linea (nombre, color, municipalidad_id) VALUES (UNISTR('L\\00EDnea 18'), 'muni-blue', (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
SELECT 1 FROM dual;

INSERT ALL
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('San Sebasti\\00E1n'), 700, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Mercado Central', 400, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Correos', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Beatas de Bel\\00E9n'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Paseo de las Letras', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Centro C\\00EDvico'), 600, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Sur 2', 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('G\\00F3mez Carrillo'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('San Agust\\00EDn'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Parque Centenario', 350, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Sime\\00F3n Ca\\00F1as'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Hip\\00F3dromo del Norte'), 500, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('San Jos\\00E9 de la Monta\\00F1a'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Jocotenango', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Parque Col\\00F3n'), 500, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Matamoros', 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Cipreses (direcci\\00F3n Puente de la Penitenciaria)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Jardines de la Asunci\\00F3n (direcci\\00F3n Puente de la Penitenciaria)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Arrivillaga (direcci\\00F3n Puente de la Penitenciaria)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Vivibien', 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Mercado La Palmita', 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Palacio de los Deportes (direcci\\00F3n Puente de la Penitenciaria)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Puente de la Penitenciaria', 450, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Palacio de los Deportes (direcci\\00F3n Parque Col\\00F3n)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('La Palmita', 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Parque Navidad', 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Arrivillaga (direcci\\00F3n Parque Col\\00F3n)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Jardines de la Asunci\\00F3n (direcci\\00F3n Parque Col\\00F3n)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Cipreses (direcci\\00F3n Parque Col\\00F3n)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Centra Sur', 700, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Plaza Municipal', 450, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Plaza Barrios', 650, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Plaza El Amate', 350, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Don Bosco', 350, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Bol\\00EDvar (direcci\\00F3n Plaza Barrios)'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Bol\\00EDvar (direcci\\00F3n Centra Sur)'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Santa Cecilia', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Tr\\00E9bol'), 500, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Mariscal (direcci\\00F3n Centra Sur)'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Mariscal (direcci\\00F3n Plaza Barrios)'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Reformita (direcci\\00F3n Centra Sur)'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Reformita (direcci\\00F3n Plaza Barrios)'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('El Carmen', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Las Charcas (direcci\\00F3n Centra Sur)'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Las Charcas (direcci\\00F3n Plaza Barrios)'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Javier', 350, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Monte Mar\\00EDa'), 400, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Tipograf\\00EDa'), 450, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('El Calvario', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('4 Grados Sur', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Exposici\\00F3n'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Terminal', 500, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Industria', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('T\\00EDvoli'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Mont\\00FAfar'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Acueducto', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Fuerza A\\00E9rea'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Hangares', 350, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Plaza Berl\\00EDn'), 350, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Juan Pablo II', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Plaza Argentina', 350, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Los Arcos', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Plaza Espa\\00F1a'), 350, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('IGSS Zona 9', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Seis 26', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Torre del Reformador', 350, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Plaza de la Rep\\00FAblica'), 350, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Cant\\00F3n Exposici\\00F3n'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Banco de Guatemala', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('FEGUA', 600, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Francos y Monroy', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Col\\00F3n'), 400, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Cerro del Carmen', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Parroquia', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('IGSS Zona 6', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Centro Zona 6', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Academia', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Cipresales', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Proyectos 4-4', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Proyectos', 500, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Quintanal', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Corpus Christi', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Jos\\00E9 Mart\\00ED'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Santa Teresa', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Capuchinas', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('USAC Perif\\00E9rico'), 600, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Granai (direcci\\00F3n La Merced)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Granai (direcci\\00F3n USAC Perif\\00E9rico)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Rodolfo Robles (direcci\\00F3n La Merced)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Rodolfo Robles (direcci\\00F3n USAC Perif\\00E9rico)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('CEJUSA (direcci\\00F3n La Merced)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('CEJUSA (direcci\\00F3n USAC Perif\\00E9rico)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('San Jorge (direcci\\00F3n La Merced)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('San Jorge (direcci\\00F3n USAC Perif\\00E9rico)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Roosevelt (direcci\\00F3n La Merced)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Roosevelt (direcci\\00F3n USAC Perif\\00E9rico)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('San Juan (direcci\\00F3n La Merced)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('San Juan (direcci\\00F3n USAC Perif\\00E9rico)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Ciudad de Plata II (direcci\\00F3n La Merced)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Ciudad de Plata II (direcci\\00F3n USAC Perif\\00E9rico)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Villa Linda (direcci\\00F3n La Merced)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Villa Linda (direcci\\00F3n USAC Perif\\00E9rico)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('4 de Febrero (direcci\\00F3n La Merced)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('4 de Febrero (direcci\\00F3n USAC Perif\\00E9rico)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Bethania (direcci\\00F3n La Merced)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Bethania (direcci\\00F3n USAC Perif\\00E9rico)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Incienso (direcci\\00F3n La Merced)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Incienso (direcci\\00F3n USAC Perif\\00E9rico)'), 250, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('San Juan de Dios'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Pasaje Aycinena', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('La Merced', 500, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Cruz Roja', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Archivo General', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Santuario de Guadalupe', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Atl\\00E1ntida'), 550, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('San Mart\\00EDn (direcci\\00F3n Atl\\00E1ntida)'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Victorias', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Portales', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('San Rafael', 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES (UNISTR('Para\\00EDso'), 300, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
  INTO estacion (nombre, capacidad_max, municipalidad_id) VALUES ('Aguilar Batres', 400, (SELECT id FROM municipalidad WHERE nombre = 'Municipalidad de Guatemala'))
SELECT 1 FROM dual;

INSERT ALL
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_centra_sur',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    'Operador - Centra Sur',
    (SELECT id FROM estacion WHERE nombre = 'Centra Sur'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_monte_maria',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    UNISTR('Operador - Monte Mar\\00EDa'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Monte Mar\\00EDa')),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_javier',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    'Operador - Javier',
    (SELECT id FROM estacion WHERE nombre = 'Javier'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_aguilar_batres',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    'Operador - Aguilar Batres',
    (SELECT id FROM estacion WHERE nombre = 'Aguilar Batres'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_plaza_barrios',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    'Operador - Plaza Barrios',
    (SELECT id FROM estacion WHERE nombre = 'Plaza Barrios'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_tipografia',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    UNISTR('Operador - Tipograf\\00EDa'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Tipograf\\00EDa')),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_hangares',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    'Operador - Hangares',
    (SELECT id FROM estacion WHERE nombre = 'Hangares'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_san_sebastian',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    UNISTR('Operador - San Sebasti\\00E1n'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('San Sebasti\\00E1n')),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_hipodromo_norte',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    UNISTR('Operador - Hip\\00F3dromo del Norte'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Hip\\00F3dromo del Norte')),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_fegua',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    'Operador - FEGUA',
    (SELECT id FROM estacion WHERE nombre = 'FEGUA'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_proyectos',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    'Operador - Proyectos',
    (SELECT id FROM estacion WHERE nombre = 'Proyectos'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_usac_periferico',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    UNISTR('Operador - USAC Perif\\00E9rico'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('USAC Perif\\00E9rico')),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_la_merced',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    'Operador - La Merced',
    (SELECT id FROM estacion WHERE nombre = 'La Merced'),
    1
  )
  INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo) VALUES (
    'op_atlantida',
    '$2b$10$v0jmgrDR9xHU/IEX20h8Que7qFvfojt8LLlsJVIx2YPbHEPqGdq0G',
    (SELECT id FROM rol WHERE codigo = 'OPERADOR'),
    (SELECT nombre FROM rol WHERE codigo = 'OPERADOR'),
    UNISTR('Operador - Atl\\00E1ntida'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Atl\\00E1ntida')),
    1
  )
SELECT 1 FROM dual;

UPDATE usuario
   SET estacion_id = (SELECT id FROM estacion WHERE nombre = 'Centra Sur')
 WHERE username = 'operador';

INSERT ALL
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = 'Plaza Municipal'), 1, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = 'Plaza Barrios'), 2, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = 'Plaza El Amate'), 3, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = 'Don Bosco'), 4, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = UNISTR('Bol\\00EDvar (direcci\\00F3n Plaza Barrios)')), 5, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = UNISTR('Bol\\00EDvar (direcci\\00F3n Centra Sur)')), 6, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = 'Santa Cecilia'), 7, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = UNISTR('Tr\\00E9bol')), 8, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = UNISTR('Mariscal (direcci\\00F3n Centra Sur)')), 9, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = UNISTR('Mariscal (direcci\\00F3n Plaza Barrios)')), 10, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = UNISTR('Reformita (direcci\\00F3n Centra Sur)')), 11, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = UNISTR('Reformita (direcci\\00F3n Plaza Barrios)')), 12, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = 'El Carmen'), 13, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = UNISTR('Las Charcas (direcci\\00F3n Centra Sur)')), 14, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = UNISTR('Las Charcas (direcci\\00F3n Plaza Barrios)')), 15, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = 'Javier'), 16, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = UNISTR('Monte Mar\\00EDa')), 17, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')), (SELECT id FROM estacion WHERE nombre = 'Centra Sur'), 18, 0)
SELECT 1 FROM dual;

INSERT ALL
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = UNISTR('Tipograf\\00EDa')), 1, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'El Calvario'), 2, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = '4 Grados Sur'), 3, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = UNISTR('Exposici\\00F3n')), 4, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'Terminal'), 5, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'Industria'), 6, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = UNISTR('T\\00EDvoli')), 7, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = UNISTR('Mont\\00FAfar')), 8, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'Acueducto'), 9, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = UNISTR('Fuerza A\\00E9rea')), 10, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'Hangares'), 11, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = UNISTR('Plaza Berl\\00EDn')), 12, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'Juan Pablo II'), 13, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'Plaza Argentina'), 14, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'Los Arcos'), 15, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = UNISTR('Plaza Espa\\00F1a')), 16, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'IGSS Zona 9'), 17, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'Seis 26'), 18, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'Torre del Reformador'), 19, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = UNISTR('Plaza de la Rep\\00FAblica')), 20, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = UNISTR('Cant\\00F3n Exposici\\00F3n')), 21, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')), (SELECT id FROM estacion WHERE nombre = 'Banco de Guatemala'), 22, 0)
SELECT 1 FROM dual;

INSERT ALL
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 2')), (SELECT id FROM estacion WHERE nombre = UNISTR('San Sebasti\\00E1n')), 1, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 2')), (SELECT id FROM estacion WHERE nombre = UNISTR('Sime\\00F3n Ca\\00F1as')), 2, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 2')), (SELECT id FROM estacion WHERE nombre = UNISTR('Hip\\00F3dromo del Norte')), 3, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 2')), (SELECT id FROM estacion WHERE nombre = UNISTR('San Jos\\00E9 de la Monta\\00F1a')), 4, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 2')), (SELECT id FROM estacion WHERE nombre = 'Jocotenango'), 5, 0)
SELECT 1 FROM dual;

INSERT ALL
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Norte', (SELECT id FROM estacion WHERE nombre = 'Centra Sur'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Sur', (SELECT id FROM estacion WHERE nombre = 'Centra Sur'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Principal', (SELECT id FROM estacion WHERE nombre = UNISTR('Monte Mar\\00EDa')))
  INTO acceso (nombre, estacion_id) VALUES (UNISTR('Entrada \\00DAnica'), (SELECT id FROM estacion WHERE nombre = 'Javier'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Central', (SELECT id FROM estacion WHERE nombre = 'Aguilar Batres'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso 18 Calle', (SELECT id FROM estacion WHERE nombre = 'Plaza Barrios'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso 7ma Avenida', (SELECT id FROM estacion WHERE nombre = 'Plaza Barrios'))
SELECT 1 FROM dual;

INSERT ALL
  INTO parqueo (nombre, ubicacion, capacidad) VALUES ('Parqueo Centra Sur', 'Interior Centra Sur, Z.12', 100)
  INTO parqueo (nombre, ubicacion, capacidad) VALUES ('Parqueo Z.1', '18 Calle, Z.1', 50)
  INTO parqueo (nombre, ubicacion, capacidad) VALUES ('Parqueo Z.6', 'Cerca de Proyectos Z.6', 40)
SELECT 1 FROM dual;

INSERT ALL
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-001', 'P-123ABC', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    NULL,
    'EnRuta', 40
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-002', 'P-456DEF', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    (SELECT id FROM estacion WHERE nombre = 'Centra Sur'),
    'EnEstacion', 120
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-003', 'P-789GHI', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    NULL,
    'EnRuta', 20
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-004', 'P-321JKL', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 2')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('San Sebasti\\00E1n')),
    'EnRuta', 100
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-005', 'P-654MNO', 'Articulado 2022', 160,
    NULL,
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.6'),
    NULL,
    'Mantenimiento', 0
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-006', 'P-777AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Monte Mar\\00EDa')),
    'EnEstacion', 260
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-007', 'P-888BBB', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    (SELECT id FROM estacion WHERE nombre = 'Javier'),
    'EnEstacion', 30
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-008', 'P-999CCC', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    (SELECT id FROM estacion WHERE nombre = 'Plaza Barrios'),
    'EnEstacion', 120
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-009', 'P-111DDD', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Tipograf\\00EDa')),
    'EnEstacion', 15
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-010', 'P-222EEE', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 2')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Hip\\00F3dromo del Norte')),
    'EnEstacion', 60
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES (
    'Juan', UNISTR('P\\00E9rez'), '1234567890101', 'Tipo A', 'Mixco, Guatemala', '5555-0001'
  )
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES (
    'Carlos', UNISTR('L\\00F3pez'), '2345678901234', 'Tipo A', 'Villa Nueva, Guatemala', '5555-0002'
  )
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES (
    UNISTR('Mar\\00EDa'), UNISTR('Garc\\00EDa'), '3456789012345', 'Tipo A', 'Guatemala City, Z.10', '5555-0003'
  )
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES (
    'Roberto', UNISTR('S\\00E1nchez'), '4567890123456', 'Tipo A', 'San Miguel Petapa, Guatemala', '5555-0004'
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES (
    (SELECT id FROM piloto WHERE dpi = '1234567890101'),
    (SELECT id FROM bus WHERE numero_unidad = 'U-001'),
    1
  )
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES (
    (SELECT id FROM piloto WHERE dpi = '2345678901234'),
    (SELECT id FROM bus WHERE numero_unidad = 'U-002'),
    1
  )
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES (
    (SELECT id FROM piloto WHERE dpi = '3456789012345'),
    (SELECT id FROM bus WHERE numero_unidad = 'U-003'),
    1
  )
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES (
    (SELECT id FROM piloto WHERE dpi = '4567890123456'),
    (SELECT id FROM bus WHERE numero_unidad = 'U-004'),
    1
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO historial_educativo (piloto_id, nivel_estudio, institucion, anio_graduacion) VALUES (
    (SELECT id FROM piloto WHERE dpi = '1234567890101'),
    'Diversificado', 'Instituto Nacional Central', 2010
  )
  INTO historial_educativo (piloto_id, nivel_estudio, institucion, anio_graduacion) VALUES (
    (SELECT id FROM piloto WHERE dpi = '1234567890101'),
    UNISTR('Diplomado Conducci\\00F3n Pesada'), 'INTECAP', 2015
  )
  INTO historial_educativo (piloto_id, nivel_estudio, institucion, anio_graduacion) VALUES (
    (SELECT id FROM piloto WHERE dpi = '2345678901234'),
    'Diversificado', 'Colegio Don Bosco', 2012
  )
  INTO historial_educativo (piloto_id, nivel_estudio, institucion, anio_graduacion) VALUES (
    (SELECT id FROM piloto WHERE dpi = '3456789012345'),
    'Diversificado', 'Instituto Femenino', 2014
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    'Pedro', 'Alvarado', '5678901234567',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Norte' AND estacion_id = (SELECT id FROM estacion WHERE nombre = 'Centra Sur')),
    'matutino'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    'Luis', 'Mendoza', '6789012345678',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Sur' AND estacion_id = (SELECT id FROM estacion WHERE nombre = 'Centra Sur')),
    'vespertino'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    UNISTR('Jos\\00E9'), UNISTR('Ram\\00EDrez'), '7890123456789',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Principal' AND estacion_id = (SELECT id FROM estacion WHERE nombre = UNISTR('Monte Mar\\00EDa'))),
    'nocturno'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    'Miguel', UNISTR('Hern\\00E1ndez'), '8901234567890',
    (SELECT id FROM acceso WHERE nombre = UNISTR('Entrada \\00DAnica') AND estacion_id = (SELECT id FROM estacion WHERE nombre = 'Javier')),
    'matutino'
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('Sof\\00EDa'), UNISTR('Mart\\00EDnez'), '9012345678901',
    (SELECT id FROM estacion WHERE nombre = 'Centra Sur'),
    'PC-CENTRA-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('Andr\\00E9s'), 'Castillo', '0123456789012',
    (SELECT id FROM estacion WHERE nombre = UNISTR('Monte Mar\\00EDa')),
    'PC-MONTE-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    'Elena', 'Reyes', '1122334455667',
    (SELECT id FROM estacion WHERE nombre = 'Javier'),
    'PC-JAVIER-01'
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO registro_ocupacion (bus_id, estacion_id, usuario_id, ocupacion_actual, capacidad_pasajeros, ocupacion_pct) VALUES (
    (SELECT id FROM bus WHERE numero_unidad = 'U-006'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Monte Mar\\00EDa')),
    (SELECT id FROM usuario WHERE username = 'operador'),
    260,
    160,
    162.50
  )
  INTO registro_ocupacion (bus_id, estacion_id, usuario_id, ocupacion_actual, capacidad_pasajeros, ocupacion_pct) VALUES (
    (SELECT id FROM bus WHERE numero_unidad = 'U-009'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Tipograf\\00EDa')),
    (SELECT id FROM usuario WHERE username = 'operador'),
    15,
    150,
    10.00
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO alerta (tipo, mensaje, bus_id, estacion_id, leida) VALUES (
    (SELECT valor_text FROM config_param WHERE activo = 1 AND clave = 'ALERTA_TIPO_SATURACION'),
    UNISTR('ALERTA: Saturaci\\00F3n 162% en bus U-006. Se requiere despacho de refuerzo.'),
    (SELECT id FROM bus WHERE numero_unidad = 'U-006'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Monte Mar\\00EDa')),
    0
  )
  INTO alerta_saturacion (registro_ocupacion_id, bus_id, estacion_id, ocupacion_pct, mensaje, leida) VALUES (
    (SELECT id FROM (SELECT id FROM registro_ocupacion WHERE bus_id = (SELECT id FROM bus WHERE numero_unidad = 'U-006') ORDER BY id DESC) WHERE ROWNUM = 1),
    (SELECT id FROM bus WHERE numero_unidad = 'U-006'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Monte Mar\\00EDa')),
    162.50,
    UNISTR('ALERTA: Saturaci\\00F3n 162% en bus U-006. Se requiere despacho de refuerzo.'),
    0
  )
  INTO alerta (tipo, mensaje, bus_id, estacion_id, leida) VALUES (
    (SELECT valor_text FROM config_param WHERE activo = 1 AND clave = 'ALERTA_TIPO_BAJA_OCUPACION'),
    UNISTR('INFO: Baja ocupaci\\00F3n 10% en bus U-009. Espera adicional recomendada: 5 min.'),
    (SELECT id FROM bus WHERE numero_unidad = 'U-009'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Tipograf\\00EDa')),
    0
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO orden_refuerzo (bus_objetivo_id, linea_id, estacion_id, estado, updated_at) VALUES (
    (SELECT id FROM bus WHERE numero_unidad = 'U-006'),
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Monte Mar\\00EDa')),
    (SELECT valor_text FROM config_param WHERE activo = 1 AND clave = 'REFUERZO_ESTADO_INICIAL'),
    NULL
  )
  INTO orden_refuerzo (bus_objetivo_id, linea_id, estacion_id, estado, updated_at) VALUES (
    (SELECT id FROM bus WHERE numero_unidad = 'U-002'),
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM estacion WHERE nombre = 'Centra Sur'),
    'alistando',
    SYSTIMESTAMP
  )
  INTO orden_refuerzo (bus_objetivo_id, linea_id, estacion_id, estado, updated_at) VALUES (
    (SELECT id FROM bus WHERE numero_unidad = 'U-004'),
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 2')),
    (SELECT id FROM estacion WHERE nombre = UNISTR('San Sebasti\\00E1n')),
    'despachado',
    SYSTIMESTAMP
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')), (SELECT id FROM estacion WHERE nombre = UNISTR('San Sebasti\\00E1n')), 1, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')), (SELECT id FROM estacion WHERE nombre = 'Mercado Central'), 2, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')), (SELECT id FROM estacion WHERE nombre = 'Correos'), 3, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')), (SELECT id FROM estacion WHERE nombre = UNISTR('Beatas de Bel\\00E9n')), 4, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')), (SELECT id FROM estacion WHERE nombre = 'Paseo de las Letras'), 5, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')), (SELECT id FROM estacion WHERE nombre = UNISTR('Centro C\\00EDvico')), 6, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')), (SELECT id FROM estacion WHERE nombre = 'Sur 2'), 7, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')), (SELECT id FROM estacion WHERE nombre = UNISTR('G\\00F3mez Carrillo')), 8, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')), (SELECT id FROM estacion WHERE nombre = UNISTR('San Agust\\00EDn')), 9, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')), (SELECT id FROM estacion WHERE nombre = 'Parque Centenario'), 10, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = UNISTR('Parque Col\\00F3n')), 1, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = 'Matamoros'), 2, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = UNISTR('Cipreses (direcci\\00F3n Puente de la Penitenciaria)')), 3, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = UNISTR('Jardines de la Asunci\\00F3n (direcci\\00F3n Puente de la Penitenciaria)')), 4, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = UNISTR('Arrivillaga (direcci\\00F3n Puente de la Penitenciaria)')), 5, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = 'Vivibien'), 6, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = 'Mercado La Palmita'), 7, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = UNISTR('Palacio de los Deportes (direcci\\00F3n Puente de la Penitenciaria)')), 8, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = 'Puente de la Penitenciaria'), 9, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = UNISTR('Palacio de los Deportes (direcci\\00F3n Parque Col\\00F3n)')), 10, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = 'La Palmita'), 11, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = 'Parque Navidad'), 12, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = UNISTR('Arrivillaga (direcci\\00F3n Parque Col\\00F3n)')), 13, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = UNISTR('Jardines de la Asunci\\00F3n (direcci\\00F3n Parque Col\\00F3n)')), 14, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = 'Ruta 5'), (SELECT id FROM estacion WHERE nombre = UNISTR('Cipreses (direcci\\00F3n Parque Col\\00F3n)')), 15, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'FEGUA'), 1, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Francos y Monroy'), 2, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = UNISTR('Col\\00F3n')), 3, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Cerro del Carmen'), 4, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Parroquia'), 5, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'IGSS Zona 6'), 6, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Centro Zona 6'), 7, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Academia'), 8, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Cipresales'), 9, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Proyectos 4-4'), 10, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Proyectos'), 11, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Quintanal'), 12, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Corpus Christi'), 13, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = UNISTR('Jos\\00E9 Mart\\00ED')), 14, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Santa Teresa'), 15, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')), (SELECT id FROM estacion WHERE nombre = 'Capuchinas'), 16, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('USAC Perif\\00E9rico')), 1, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Granai (direcci\\00F3n La Merced)')), 2, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Granai (direcci\\00F3n USAC Perif\\00E9rico)')), 3, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Rodolfo Robles (direcci\\00F3n La Merced)')), 4, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Rodolfo Robles (direcci\\00F3n USAC Perif\\00E9rico)')), 5, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('CEJUSA (direcci\\00F3n La Merced)')), 6, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('CEJUSA (direcci\\00F3n USAC Perif\\00E9rico)')), 7, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('San Jorge (direcci\\00F3n La Merced)')), 8, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('San Jorge (direcci\\00F3n USAC Perif\\00E9rico)')), 9, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Roosevelt (direcci\\00F3n La Merced)')), 10, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Roosevelt (direcci\\00F3n USAC Perif\\00E9rico)')), 11, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('San Juan (direcci\\00F3n La Merced)')), 12, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('San Juan (direcci\\00F3n USAC Perif\\00E9rico)')), 13, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Ciudad de Plata II (direcci\\00F3n La Merced)')), 14, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Ciudad de Plata II (direcci\\00F3n USAC Perif\\00E9rico)')), 15, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Villa Linda (direcci\\00F3n La Merced)')), 16, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Villa Linda (direcci\\00F3n USAC Perif\\00E9rico)')), 17, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('4 de Febrero (direcci\\00F3n La Merced)')), 18, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('4 de Febrero (direcci\\00F3n USAC Perif\\00E9rico)')), 19, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Bethania (direcci\\00F3n La Merced)')), 20, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Bethania (direcci\\00F3n USAC Perif\\00E9rico)')), 21, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Incienso (direcci\\00F3n La Merced)')), 22, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('Incienso (direcci\\00F3n USAC Perif\\00E9rico)')), 23, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = UNISTR('San Juan de Dios')), 24, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = 'Pasaje Aycinena'), 25, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = 'La Merced'), 26, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = 'Cruz Roja'), 27, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = 'Archivo General'), 28, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')), (SELECT id FROM estacion WHERE nombre = 'Santuario de Guadalupe'), 29, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')), (SELECT id FROM estacion WHERE nombre = 'FEGUA'), 1, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')), (SELECT id FROM estacion WHERE nombre = 'Francos y Monroy'), 2, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')), (SELECT id FROM estacion WHERE nombre = UNISTR('Col\\00F3n')), 3, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')), (SELECT id FROM estacion WHERE nombre = 'Cerro del Carmen'), 4, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')), (SELECT id FROM estacion WHERE nombre = UNISTR('San Mart\\00EDn (direcci\\00F3n Atl\\00E1ntida)')), 5, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')), (SELECT id FROM estacion WHERE nombre = 'Victorias'), 6, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')), (SELECT id FROM estacion WHERE nombre = 'Portales'), 7, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')), (SELECT id FROM estacion WHERE nombre = UNISTR('Atl\\00E1ntida')), 8, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')), (SELECT id FROM estacion WHERE nombre = 'San Rafael'), 9, 0)
  INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km) VALUES ((SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')), (SELECT id FROM estacion WHERE nombre = UNISTR('Para\\00EDso')), 10, 0)
SELECT 1 FROM dual;

INSERT ALL
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Principal', (SELECT id FROM estacion WHERE nombre = 'FEGUA'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Oriente', (SELECT id FROM estacion WHERE nombre = 'FEGUA'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Principal', (SELECT id FROM estacion WHERE nombre = 'Proyectos'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Poniente', (SELECT id FROM estacion WHERE nombre = 'Proyectos'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Norte', (SELECT id FROM estacion WHERE nombre = UNISTR('USAC Perif\\00E9rico')))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Sur', (SELECT id FROM estacion WHERE nombre = UNISTR('USAC Perif\\00E9rico')))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Principal', (SELECT id FROM estacion WHERE nombre = 'La Merced'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Plaza', (SELECT id FROM estacion WHERE nombre = 'La Merced'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Norte', (SELECT id FROM estacion WHERE nombre = UNISTR('Atl\\00E1ntida')))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Sur', (SELECT id FROM estacion WHERE nombre = UNISTR('Atl\\00E1ntida')))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Principal', (SELECT id FROM estacion WHERE nombre = 'Hangares'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Talleres', (SELECT id FROM estacion WHERE nombre = 'Hangares'))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Norte', (SELECT id FROM estacion WHERE nombre = UNISTR('San Sebasti\\00E1n')))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Sur', (SELECT id FROM estacion WHERE nombre = UNISTR('San Sebasti\\00E1n')))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Principal', (SELECT id FROM estacion WHERE nombre = UNISTR('Hip\\00F3dromo del Norte')))
  INTO acceso (nombre, estacion_id) VALUES ('Acceso Secundario', (SELECT id FROM estacion WHERE nombre = UNISTR('Hip\\00F3dromo del Norte')))
SELECT 1 FROM dual;

INSERT ALL
  INTO parqueo (nombre, ubicacion, capacidad) VALUES ('Parqueo FEGUA', 'Cercanías FEGUA, Z.1', 60)
  INTO parqueo (nombre, ubicacion, capacidad) VALUES ('Parqueo USAC', UNISTR('Perif\\00E9rico USAC, Z.11'), 80)
SELECT 1 FROM dual;

INSERT ALL
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-011', 'P-011AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    (SELECT id FROM estacion WHERE nombre = 'FEGUA'),
    'EnEstacion', 90
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-012', 'P-012AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    (SELECT id FROM estacion WHERE nombre = 'La Merced'),
    'EnEstacion', 20
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-013', 'P-013AAA', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    NULL,
    'EnRuta', 70
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-014', 'P-014AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo USAC'),
    (SELECT id FROM estacion WHERE nombre = 'Proyectos'),
    'EnEstacion', 210
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-015', 'P-015AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo USAC'),
    NULL,
    'EnRuta', 50
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-016', 'P-016AAA', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo FEGUA'),
    (SELECT id FROM estacion WHERE nombre = 'Hangares'),
    'EnEstacion', 10
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-017', 'P-017AAA', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo FEGUA'),
    (SELECT id FROM estacion WHERE nombre = 'FEGUA'),
    'EnEstacion', 150
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-018', 'P-018AAA', 'Articulado 2022', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    NULL,
    'EnRuta', 40
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-019', 'P-019AAA', 'Articulado 2022', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('USAC Perif\\00E9rico')),
    'EnEstacion', 120
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-020', 'P-020AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    (SELECT id FROM estacion WHERE nombre = 'Centra Sur'),
    'EnEstacion', 30
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-021', 'P-021AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    NULL,
    'EnRuta', 80
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-022', 'P-022AAA', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    (SELECT id FROM estacion WHERE nombre = 'Hangares'),
    'EnEstacion', 30
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-023', 'P-023AAA', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    NULL,
    'EnRuta', 25
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-024', 'P-024AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 2')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Hip\\00F3dromo del Norte')),
    'EnEstacion', 140
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-025', 'P-025AAA', 'Articulado 2022', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 2')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    NULL,
    'EnRuta', 30
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-026', 'P-026AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo USAC'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('USAC Perif\\00E9rico')),
    'EnEstacion', 40
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-027', 'P-027AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo USAC'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Atl\\00E1ntida')),
    'EnEstacion', 55
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-028', 'P-028AAA', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo FEGUA'),
    (SELECT id FROM estacion WHERE nombre = 'Proyectos'),
    'EnEstacion', 5
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-029', 'P-029AAA', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Hip\\00F3dromo del Norte')),
    'EnEstacion', 10
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-030', 'P-030AAA', 'Articulado 2022', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    NULL,
    'EnRuta', 65
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-031', 'P-031AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    (SELECT id FROM estacion WHERE nombre = 'Plaza Barrios'),
    'EnEstacion', 155
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-032', 'P-032AAA', 'Articulado 2022', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 1')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    (SELECT id FROM estacion WHERE nombre = 'Plaza Barrios'),
    'EnEstacion', 70
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-033', 'P-033AAA', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Tipograf\\00EDa')),
    'EnEstacion', 80
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-034', 'P-034AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 7')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo FEGUA'),
    NULL,
    'EnRuta', 20
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-035', 'P-035AAA', 'Articulado 2022', 160,
    NULL,
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.6'),
    NULL,
    'FueraDeServicio', 0
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-036', 'P-036AAA', 'Articulado 2022', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo USAC'),
    NULL,
    'EnRuta', 95
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-037', 'P-037AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Monte Mar\\00EDa')),
    'EnEstacion', 12
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-038', 'P-038AAA', 'Scania 2023', 150,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 2')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('San Sebasti\\00E1n')),
    'EnEstacion', 5
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-039', 'P-039AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 18')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Centra Sur'),
    (SELECT id FROM estacion WHERE nombre = 'Centra Sur'),
    'EnEstacion', 60
  )
  INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual) VALUES (
    'U-040', 'P-040AAA', 'Articulado 2024', 160,
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 13')),
    (SELECT id FROM parqueo WHERE nombre = 'Parqueo Z.1'),
    NULL,
    'EnRuta', 35
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Ana', UNISTR('G\\00F3mez'), '5000000000001', 'Tipo A', 'Guatemala City, Z.1', '5555-0101')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Diego', UNISTR('L\\00F3pez'), '5000000000002', 'Tipo A', 'Guatemala City, Z.2', '5555-0102')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES (UNISTR('Luc\\00EDa'), UNISTR('Hern\\00E1ndez'), '5000000000003', 'Tipo A', 'Guatemala City, Z.3', '5555-0103')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Jorge', UNISTR('M\\00E9ndez'), '5000000000004', 'Tipo A', 'Guatemala City, Z.4', '5555-0104')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Paola', UNISTR('Ram\\00EDrez'), '5000000000005', 'Tipo A', 'Guatemala City, Z.5', '5555-0105')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Sergio', UNISTR('Castro'), '5000000000006', 'Tipo A', 'Guatemala City, Z.6', '5555-0106')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES (UNISTR('No\\00E9'), UNISTR('P\\00E9rez'), '5000000000007', 'Tipo A', 'Guatemala City, Z.7', '5555-0107')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Karla', UNISTR('S\\00E1nchez'), '5000000000008', 'Tipo A', 'Guatemala City, Z.8', '5555-0108')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Mario', UNISTR('V\\00E1squez'), '5000000000009', 'Tipo A', 'Guatemala City, Z.9', '5555-0109')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES (UNISTR('Ra\\00FAl'), UNISTR('D\\00EDaz'), '5000000000010', 'Tipo A', 'Guatemala City, Z.10', '5555-0110')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Carmen', UNISTR('Flores'), '5000000000011', 'Tipo A', 'Guatemala City, Z.11', '5555-0111')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Hugo', UNISTR('Aguilar'), '5000000000012', 'Tipo A', 'Guatemala City, Z.12', '5555-0112')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Teresa', UNISTR('Morales'), '5000000000013', 'Tipo A', 'Guatemala City, Z.13', '5555-0113')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Kevin', UNISTR('Ruiz'), '5000000000014', 'Tipo A', 'Guatemala City, Z.14', '5555-0114')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Diana', UNISTR('Ortega'), '5000000000015', 'Tipo A', 'Guatemala City, Z.15', '5555-0115')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Oscar', UNISTR('N\\00FA\\00F1ez'), '5000000000016', 'Tipo A', 'Guatemala City, Z.16', '5555-0116')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES (UNISTR('Iv\\00E1n'), UNISTR('Cabrera'), '5000000000017', 'Tipo A', 'Guatemala City, Z.17', '5555-0117')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Patricia', UNISTR('Soto'), '5000000000018', 'Tipo A', 'Guatemala City, Z.18', '5555-0118')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Fernando', UNISTR('Rojas'), '5000000000019', 'Tipo A', 'Mixco, Guatemala', '5555-0119')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Marta', UNISTR('Ch\\00E1vez'), '5000000000020', 'Tipo A', 'Villa Nueva, Guatemala', '5555-0120')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Gustavo', UNISTR('Silva'), '5000000000021', 'Tipo A', 'Chinautla, Guatemala', '5555-0121')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES (UNISTR('\\00C1lvaro'), UNISTR('Torres'), '5000000000022', 'Tipo A', 'San Miguel Petapa', '5555-0122')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Rocio', UNISTR('Pineda'), '5000000000023', 'Tipo A', 'Guatemala City, Z.5', '5555-0123')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Samuel', UNISTR('Villatoro'), '5000000000024', 'Tipo A', 'Guatemala City, Z.6', '5555-0124')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Julio', UNISTR('Escobar'), '5000000000025', 'Tipo A', 'Guatemala City, Z.7', '5555-0125')
  INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono) VALUES ('Monica', UNISTR('C\\00E1rcamo'), '5000000000026', 'Tipo A', 'Guatemala City, Z.8', '5555-0126')
SELECT 1 FROM dual;

INSERT ALL
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000001'), (SELECT id FROM bus WHERE numero_unidad = 'U-006'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000002'), (SELECT id FROM bus WHERE numero_unidad = 'U-007'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000003'), (SELECT id FROM bus WHERE numero_unidad = 'U-008'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000004'), (SELECT id FROM bus WHERE numero_unidad = 'U-009'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000005'), (SELECT id FROM bus WHERE numero_unidad = 'U-010'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000006'), (SELECT id FROM bus WHERE numero_unidad = 'U-011'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000007'), (SELECT id FROM bus WHERE numero_unidad = 'U-012'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000008'), (SELECT id FROM bus WHERE numero_unidad = 'U-013'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000009'), (SELECT id FROM bus WHERE numero_unidad = 'U-014'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000010'), (SELECT id FROM bus WHERE numero_unidad = 'U-015'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000011'), (SELECT id FROM bus WHERE numero_unidad = 'U-016'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000012'), (SELECT id FROM bus WHERE numero_unidad = 'U-017'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000013'), (SELECT id FROM bus WHERE numero_unidad = 'U-018'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000014'), (SELECT id FROM bus WHERE numero_unidad = 'U-019'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000015'), (SELECT id FROM bus WHERE numero_unidad = 'U-020'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000016'), (SELECT id FROM bus WHERE numero_unidad = 'U-021'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000017'), (SELECT id FROM bus WHERE numero_unidad = 'U-022'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000018'), (SELECT id FROM bus WHERE numero_unidad = 'U-023'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000019'), (SELECT id FROM bus WHERE numero_unidad = 'U-024'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000020'), (SELECT id FROM bus WHERE numero_unidad = 'U-025'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000021'), (SELECT id FROM bus WHERE numero_unidad = 'U-026'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000022'), (SELECT id FROM bus WHERE numero_unidad = 'U-027'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000023'), (SELECT id FROM bus WHERE numero_unidad = 'U-028'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000024'), (SELECT id FROM bus WHERE numero_unidad = 'U-029'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000025'), (SELECT id FROM bus WHERE numero_unidad = 'U-030'), 1)
  INTO asignacion_piloto_bus (piloto_id, bus_id, activo) VALUES ((SELECT id FROM piloto WHERE dpi = '5000000000026'), (SELECT id FROM bus WHERE numero_unidad = 'U-031'), 1)
SELECT 1 FROM dual;

INSERT ALL
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    'Mario', UNISTR('P\\00E9rez'), '6000000000001',
    (SELECT id FROM estacion WHERE nombre = 'Aguilar Batres'),
    'PC-AGUILAR-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('Carla'), UNISTR('G\\00F3mez'), '6000000000002',
    (SELECT id FROM estacion WHERE nombre = 'Plaza Barrios'),
    'PC-PLAZA-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('H\\00E9ctor'), UNISTR('Morales'), '6000000000003',
    (SELECT id FROM estacion WHERE nombre = UNISTR('Tipograf\\00EDa')),
    'PC-TIPO-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('Daniela'), UNISTR('Soto'), '6000000000004',
    (SELECT id FROM estacion WHERE nombre = 'Hangares'),
    'PC-HANG-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('Luis'), UNISTR('Ruiz'), '6000000000005',
    (SELECT id FROM estacion WHERE nombre = UNISTR('San Sebasti\\00E1n')),
    'PC-SSEB-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('Paula'), UNISTR('D\\00EDaz'), '6000000000006',
    (SELECT id FROM estacion WHERE nombre = UNISTR('Hip\\00F3dromo del Norte')),
    'PC-HIPO-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('Javier'), UNISTR('Cruz'), '6000000000007',
    (SELECT id FROM estacion WHERE nombre = 'FEGUA'),
    'PC-FEGUA-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('Sandra'), UNISTR('Pineda'), '6000000000008',
    (SELECT id FROM estacion WHERE nombre = 'Proyectos'),
    'PC-PROY-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('Kevin'), UNISTR('Herrera'), '6000000000009',
    (SELECT id FROM estacion WHERE nombre = UNISTR('USAC Perif\\00E9rico')),
    'PC-USAC-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('Rosa'), UNISTR('Lopez'), '6000000000010',
    (SELECT id FROM estacion WHERE nombre = 'La Merced'),
    'PC-MER-01'
  )
  INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre) VALUES (
    UNISTR('Andres'), UNISTR('Vega'), '6000000000011',
    (SELECT id FROM estacion WHERE nombre = UNISTR('Atl\\00E1ntida')),
    'PC-ATL-01'
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    'Kevin', UNISTR('Sosa'), '7000000000001',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Principal' AND estacion_id = (SELECT id FROM estacion WHERE nombre = 'FEGUA') AND ROWNUM = 1),
    'matutino'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    UNISTR('Mar\\00EDa'), UNISTR('Paz'), '7000000000002',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Oriente' AND estacion_id = (SELECT id FROM estacion WHERE nombre = 'FEGUA') AND ROWNUM = 1),
    'vespertino'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    'Raul', UNISTR('G\\00E1lvez'), '7000000000003',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Principal' AND estacion_id = (SELECT id FROM estacion WHERE nombre = 'Proyectos') AND ROWNUM = 1),
    'nocturno'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    'Miriam', UNISTR('Lopez'), '7000000000004',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Poniente' AND estacion_id = (SELECT id FROM estacion WHERE nombre = 'Proyectos') AND ROWNUM = 1),
    'matutino'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    'Luis', UNISTR('Cortez'), '7000000000005',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Norte' AND estacion_id = (SELECT id FROM estacion WHERE nombre = UNISTR('USAC Perif\\00E9rico')) AND ROWNUM = 1),
    'vespertino'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    UNISTR('Jos\\00E9'), UNISTR('Maldonado'), '7000000000006',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Sur' AND estacion_id = (SELECT id FROM estacion WHERE nombre = UNISTR('USAC Perif\\00E9rico')) AND ROWNUM = 1),
    'nocturno'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    UNISTR('Sof\\00EDa'), UNISTR('Valdez'), '7000000000007',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Principal' AND estacion_id = (SELECT id FROM estacion WHERE nombre = 'La Merced') AND ROWNUM = 1),
    'matutino'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    UNISTR('Ana'), UNISTR('Mej\\00EDa'), '7000000000008',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Norte' AND estacion_id = (SELECT id FROM estacion WHERE nombre = UNISTR('Atl\\00E1ntida')) AND ROWNUM = 1),
    'vespertino'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    'Hector', UNISTR('P\\00E9rez'), '7000000000009',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Principal' AND estacion_id = (SELECT id FROM estacion WHERE nombre = 'Hangares') AND ROWNUM = 1),
    'nocturno'
  )
  INTO guardia (nombre, apellido, dpi, acceso_id, turno) VALUES (
    'Brenda', UNISTR('Ruiz'), '7000000000010',
    (SELECT id FROM acceso WHERE nombre = 'Acceso Principal' AND estacion_id = (SELECT id FROM estacion WHERE nombre = UNISTR('Hip\\00F3dromo del Norte')) AND ROWNUM = 1),
    'matutino'
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO registro_ocupacion (bus_id, estacion_id, usuario_id, ocupacion_actual, capacidad_pasajeros, ocupacion_pct) VALUES (
    (SELECT id FROM bus WHERE numero_unidad = 'U-014'),
    (SELECT id FROM estacion WHERE nombre = 'Proyectos'),
    (SELECT id FROM usuario WHERE username = 'operador'),
    210,
    160,
    131.25
  )
  INTO registro_ocupacion (bus_id, estacion_id, usuario_id, ocupacion_actual, capacidad_pasajeros, ocupacion_pct) VALUES (
    (SELECT id FROM bus WHERE numero_unidad = 'U-031'),
    (SELECT id FROM estacion WHERE nombre = 'Plaza Barrios'),
    (SELECT id FROM usuario WHERE username = 'operador'),
    155,
    160,
    96.88
  )
  INTO registro_ocupacion (bus_id, estacion_id, usuario_id, ocupacion_actual, capacidad_pasajeros, ocupacion_pct) VALUES (
    (SELECT id FROM bus WHERE numero_unidad = 'U-016'),
    (SELECT id FROM estacion WHERE nombre = 'Hangares'),
    (SELECT id FROM usuario WHERE username = 'operador'),
    10,
    150,
    6.67
  )
  INTO registro_ocupacion (bus_id, estacion_id, usuario_id, ocupacion_actual, capacidad_pasajeros, ocupacion_pct) VALUES (
    (SELECT id FROM bus WHERE numero_unidad = 'U-024'),
    (SELECT id FROM estacion WHERE nombre = UNISTR('Hip\\00F3dromo del Norte')),
    (SELECT id FROM usuario WHERE username = 'operador'),
    140,
    150,
    93.33
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO alerta (tipo, mensaje, bus_id, estacion_id, leida) VALUES (
    (SELECT valor_text FROM config_param WHERE activo = 1 AND clave = 'ALERTA_TIPO_SATURACION'),
    UNISTR('ALERTA: Saturaci\\00F3n 131% en bus U-014. Se requiere despacho de refuerzo.'),
    (SELECT id FROM bus WHERE numero_unidad = 'U-014'),
    (SELECT id FROM estacion WHERE nombre = 'Proyectos'),
    0
  )
  INTO alerta_saturacion (registro_ocupacion_id, bus_id, estacion_id, ocupacion_pct, mensaje, leida) VALUES (
    (SELECT id FROM (SELECT id FROM registro_ocupacion WHERE bus_id = (SELECT id FROM bus WHERE numero_unidad = 'U-014') ORDER BY id DESC) WHERE ROWNUM = 1),
    (SELECT id FROM bus WHERE numero_unidad = 'U-014'),
    (SELECT id FROM estacion WHERE nombre = 'Proyectos'),
    131.25,
    UNISTR('ALERTA: Saturaci\\00F3n 131% en bus U-014. Se requiere despacho de refuerzo.'),
    0
  )
  INTO alerta (tipo, mensaje, bus_id, estacion_id, leida) VALUES (
    (SELECT valor_text FROM config_param WHERE activo = 1 AND clave = 'ALERTA_TIPO_BAJA_OCUPACION'),
    UNISTR('INFO: Baja ocupaci\\00F3n 7% en bus U-016. Espera adicional recomendada: 5 min.'),
    (SELECT id FROM bus WHERE numero_unidad = 'U-016'),
    (SELECT id FROM estacion WHERE nombre = 'Hangares'),
    0
  )
SELECT 1 FROM dual;

INSERT ALL
  INTO orden_refuerzo (bus_objetivo_id, linea_id, estacion_id, estado, updated_at) VALUES (
    (SELECT id FROM bus WHERE numero_unidad = 'U-014'),
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 6')),
    (SELECT id FROM estacion WHERE nombre = 'Proyectos'),
    (SELECT valor_text FROM config_param WHERE activo = 1 AND clave = 'REFUERZO_ESTADO_INICIAL'),
    NULL
  )
  INTO orden_refuerzo (bus_objetivo_id, linea_id, estacion_id, estado, updated_at) VALUES (
    (SELECT id FROM bus WHERE numero_unidad = 'U-031'),
    (SELECT id FROM linea WHERE nombre = UNISTR('L\\00EDnea 12')),
    (SELECT id FROM estacion WHERE nombre = 'Plaza Barrios'),
    'alistando',
    SYSTIMESTAMP
  )
SELECT 1 FROM dual;

DECLARE
  FUNCTION decode_escapes(p_in NVARCHAR2) RETURN NVARCHAR2 IS
    s NVARCHAR2(4000) := p_in;
    pos NUMBER;
    hex VARCHAR2(4);
  BEGIN
    IF s IS NULL THEN
      RETURN s;
    END IF;

    s := REPLACE(s, UNISTR('\FFFD'), '');

    LOOP
      pos := REGEXP_INSTR(s, '\\u[0-9A-Fa-f]{4}');
      EXIT WHEN pos = 0;
      hex := SUBSTR(s, pos + 2, 4);
      s := SUBSTR(s, 1, pos - 1) || UNISTR('\' || hex) || SUBSTR(s, pos + 6);
    END LOOP;

    LOOP
      pos := REGEXP_INSTR(s, '\\[0-9A-Fa-f]{4}');
      EXIT WHEN pos = 0;
      hex := SUBSTR(s, pos + 1, 4);
      s := SUBSTR(s, 1, pos - 1) || UNISTR('\' || hex) || SUBSTR(s, pos + 5);
    END LOOP;

    RETURN s;
  END;
BEGIN
  DECLARE
    v1 NVARCHAR2(4000);
    v2 NVARCHAR2(4000);
    v3 NVARCHAR2(4000);
  BEGIN
    FOR r IN (
      SELECT rowid AS rid, nombre, direccion
      FROM municipalidad
      WHERE REGEXP_LIKE(nombre, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(nombre, UNISTR('\FFFD')) > 0
         OR (direccion IS NOT NULL AND (REGEXP_LIKE(direccion, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(direccion, UNISTR('\FFFD')) > 0))
    ) LOOP
      v1 := decode_escapes(r.nombre);
      v2 := decode_escapes(r.direccion);
      UPDATE municipalidad SET nombre = v1, direccion = v2 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, nombre
      FROM linea
      WHERE REGEXP_LIKE(nombre, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(nombre, UNISTR('\FFFD')) > 0
    ) LOOP
      v1 := decode_escapes(r.nombre);
      UPDATE linea SET nombre = v1 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, nombre
      FROM estacion
      WHERE REGEXP_LIKE(nombre, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(nombre, UNISTR('\FFFD')) > 0
    ) LOOP
      v1 := decode_escapes(r.nombre);
      UPDATE estacion SET nombre = v1 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, nombre
      FROM acceso
      WHERE REGEXP_LIKE(nombre, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(nombre, UNISTR('\FFFD')) > 0
    ) LOOP
      v1 := decode_escapes(r.nombre);
      UPDATE acceso SET nombre = v1 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, nombre, ubicacion
      FROM parqueo
      WHERE REGEXP_LIKE(nombre, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(nombre, UNISTR('\FFFD')) > 0
         OR (ubicacion IS NOT NULL AND (REGEXP_LIKE(ubicacion, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(ubicacion, UNISTR('\FFFD')) > 0))
    ) LOOP
      v1 := decode_escapes(r.nombre);
      v2 := decode_escapes(r.ubicacion);
      UPDATE parqueo SET nombre = v1, ubicacion = v2 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, rol, nombre
      FROM usuario
      WHERE REGEXP_LIKE(rol, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(rol, UNISTR('\FFFD')) > 0
         OR (nombre IS NOT NULL AND (REGEXP_LIKE(nombre, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(nombre, UNISTR('\FFFD')) > 0))
    ) LOOP
      v1 := decode_escapes(r.rol);
      v2 := decode_escapes(r.nombre);
      UPDATE usuario SET rol = v1, nombre = v2 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, nombre
      FROM rol
      WHERE REGEXP_LIKE(nombre, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(nombre, UNISTR('\FFFD')) > 0
    ) LOOP
      v1 := decode_escapes(r.nombre);
      UPDATE rol SET nombre = v1 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, descripcion
      FROM permiso
      WHERE descripcion IS NOT NULL AND (REGEXP_LIKE(descripcion, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(descripcion, UNISTR('\FFFD')) > 0)
    ) LOOP
      v1 := decode_escapes(r.descripcion);
      UPDATE permiso SET descripcion = v1 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, nombre, apellido, direccion_residencia
      FROM piloto
      WHERE REGEXP_LIKE(nombre, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(nombre, UNISTR('\FFFD')) > 0
         OR REGEXP_LIKE(apellido, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(apellido, UNISTR('\FFFD')) > 0
         OR (direccion_residencia IS NOT NULL AND (REGEXP_LIKE(direccion_residencia, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(direccion_residencia, UNISTR('\FFFD')) > 0))
    ) LOOP
      v1 := decode_escapes(r.nombre);
      v2 := decode_escapes(r.apellido);
      v3 := decode_escapes(r.direccion_residencia);
      UPDATE piloto SET nombre = v1, apellido = v2, direccion_residencia = v3 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, nivel_estudio, institucion
      FROM historial_educativo
      WHERE (nivel_estudio IS NOT NULL AND (REGEXP_LIKE(nivel_estudio, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(nivel_estudio, UNISTR('\FFFD')) > 0))
         OR (institucion IS NOT NULL AND (REGEXP_LIKE(institucion, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(institucion, UNISTR('\FFFD')) > 0))
    ) LOOP
      v1 := decode_escapes(r.nivel_estudio);
      v2 := decode_escapes(r.institucion);
      UPDATE historial_educativo SET nivel_estudio = v1, institucion = v2 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, nombre, apellido
      FROM guardia
      WHERE REGEXP_LIKE(nombre, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(nombre, UNISTR('\FFFD')) > 0
         OR REGEXP_LIKE(apellido, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(apellido, UNISTR('\FFFD')) > 0
    ) LOOP
      v1 := decode_escapes(r.nombre);
      v2 := decode_escapes(r.apellido);
      UPDATE guardia SET nombre = v1, apellido = v2 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, nombre, apellido, pc_nombre
      FROM operador
      WHERE REGEXP_LIKE(nombre, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(nombre, UNISTR('\FFFD')) > 0
         OR REGEXP_LIKE(apellido, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(apellido, UNISTR('\FFFD')) > 0
         OR (pc_nombre IS NOT NULL AND (REGEXP_LIKE(pc_nombre, '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}') OR INSTR(pc_nombre, UNISTR('\FFFD')) > 0))
    ) LOOP
      v1 := decode_escapes(r.nombre);
      v2 := decode_escapes(r.apellido);
      v3 := decode_escapes(r.pc_nombre);
      UPDATE operador SET nombre = v1, apellido = v2, pc_nombre = v3 WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, DBMS_LOB.SUBSTR(mensaje, 4000, 1) AS msg
      FROM alerta
      WHERE mensaje IS NOT NULL AND (
        REGEXP_LIKE(DBMS_LOB.SUBSTR(mensaje, 4000, 1), '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}')
        OR INSTR(DBMS_LOB.SUBSTR(mensaje, 4000, 1), UNISTR('\FFFD')) > 0
      )
    ) LOOP
      v1 := decode_escapes(r.msg);
      UPDATE alerta SET mensaje = TO_CLOB(v1) WHERE rowid = r.rid;
    END LOOP;

    FOR r IN (
      SELECT rowid AS rid, DBMS_LOB.SUBSTR(mensaje, 4000, 1) AS msg
      FROM alerta_saturacion
      WHERE mensaje IS NOT NULL AND (
        REGEXP_LIKE(DBMS_LOB.SUBSTR(mensaje, 4000, 1), '\\u[0-9A-Fa-f]{4}|\\[0-9A-Fa-f]{4}')
        OR INSTR(DBMS_LOB.SUBSTR(mensaje, 4000, 1), UNISTR('\FFFD')) > 0
      )
    ) LOOP
      v1 := decode_escapes(r.msg);
      UPDATE alerta_saturacion SET mensaje = TO_CLOB(v1) WHERE rowid = r.rid;
    END LOOP;
  END;
END;
/

COMMIT;
