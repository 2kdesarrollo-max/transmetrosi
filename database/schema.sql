BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE rol_permiso CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE permiso CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE config_param CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE cat_transicion_refuerzo CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE cat_tipo_alerta CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE cat_turno_guardia CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE cat_estado_refuerzo CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE cat_estado_bus CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE rol CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE orden_refuerzo CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE alerta_saturacion CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE alerta CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE registro_ocupacion CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE asignacion_piloto_bus CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE historial_educativo CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE historial_educativo_piloto CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE piloto CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE refresh_token CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE bitacora_auditoria CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE operador CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE guardia CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE acceso CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE bus CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE parqueo_linea CASCADE CONSTRAINTS PURGE';
  EXECUTE IMMEDIATE 'DROP TABLE parqueo CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE linea_estacion CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE estacion CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE linea CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE municipalidad CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE usuario CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE usuario_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE municipalidad_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE linea_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE estacion_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE acceso_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE guardia_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE operador_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE parqueo_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE bus_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE piloto_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE historial_educativo_piloto_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE historial_educativo_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE alerta_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE alerta_saturacion_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE orden_refuerzo_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE asignacion_piloto_bus_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE registro_ocupacion_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE bitacora_auditoria_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE refresh_token_id_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/

CREATE TABLE usuario (
  id NUMBER(10) NOT NULL,
  username VARCHAR2(50) NOT NULL,
  password_hash VARCHAR2(100) NOT NULL,
  rol NVARCHAR2(60) NOT NULL,
  rol_id NUMBER(10),
  nombre NVARCHAR2(150),
  estacion_id NUMBER(10),
  activo NUMBER(1) DEFAULT 1 NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_usuario PRIMARY KEY (id),
  CONSTRAINT uq_usuario_username UNIQUE (username),
  CONSTRAINT chk_usuario_activo CHECK (activo IN (0, 1))
);

CREATE SEQUENCE usuario_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER usuario_bi
BEFORE INSERT ON usuario
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT usuario_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE municipalidad (
  id NUMBER(10) NOT NULL,
  nombre NVARCHAR2(100) NOT NULL,
  direccion NVARCHAR2(255),
  telefono VARCHAR2(20),
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_municipalidad PRIMARY KEY (id),
  CONSTRAINT uq_municipalidad_nombre UNIQUE (nombre)
);

CREATE SEQUENCE municipalidad_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER municipalidad_bi
BEFORE INSERT ON municipalidad
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT municipalidad_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE linea (
  id NUMBER(10) NOT NULL,
  nombre NVARCHAR2(50) NOT NULL,
  color VARCHAR2(50),
  municipalidad_id NUMBER(10) NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_linea PRIMARY KEY (id),
  CONSTRAINT uq_linea_nombre UNIQUE (nombre),
  CONSTRAINT fk_linea_municipalidad FOREIGN KEY (municipalidad_id) REFERENCES municipalidad(id)
);

CREATE SEQUENCE linea_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER linea_bi
BEFORE INSERT ON linea
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT linea_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE estacion (
  id NUMBER(10) NOT NULL,
  nombre NVARCHAR2(100) NOT NULL,
  capacidad_max NUMBER(10) NOT NULL,
  municipalidad_id NUMBER(10) NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_estacion PRIMARY KEY (id),
  CONSTRAINT uq_estacion_nombre UNIQUE (nombre),
  CONSTRAINT chk_estacion_capacidad CHECK (capacidad_max > 0),
  CONSTRAINT fk_estacion_municipalidad FOREIGN KEY (municipalidad_id) REFERENCES municipalidad(id)
);

ALTER TABLE usuario
  ADD CONSTRAINT fk_usuario_estacion FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE SET NULL;

CREATE SEQUENCE estacion_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER estacion_bi
BEFORE INSERT ON estacion
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT estacion_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE linea_estacion (
  linea_id NUMBER(10) NOT NULL,
  estacion_id NUMBER(10) NOT NULL,
  orden NUMBER(10) NOT NULL,
  distancia_siguiente_km NUMBER(5, 2) DEFAULT 0 NOT NULL,
  CONSTRAINT pk_linea_estacion PRIMARY KEY (linea_id, estacion_id),
  CONSTRAINT uq_linea_estacion_orden UNIQUE (linea_id, orden),
  CONSTRAINT chk_linea_estacion_orden CHECK (orden > 0),
  CONSTRAINT chk_linea_estacion_dist CHECK (distancia_siguiente_km >= 0),
  CONSTRAINT fk_le_linea FOREIGN KEY (linea_id) REFERENCES linea(id) ON DELETE CASCADE,
  CONSTRAINT fk_le_estacion FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE CASCADE
);

CREATE TABLE acceso (
  id NUMBER(10) NOT NULL,
  nombre NVARCHAR2(80) NOT NULL,
  estacion_id NUMBER(10) NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_acceso PRIMARY KEY (id),
  CONSTRAINT fk_acceso_estacion FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE CASCADE
);

CREATE SEQUENCE acceso_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER acceso_bi
BEFORE INSERT ON acceso
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT acceso_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE parqueo (
  id NUMBER(10) NOT NULL,
  nombre NVARCHAR2(100) NOT NULL,
  ubicacion NVARCHAR2(255),
  capacidad NUMBER(10) NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_parqueo PRIMARY KEY (id),
  CONSTRAINT uq_parqueo_nombre UNIQUE (nombre),
  CONSTRAINT chk_parqueo_capacidad CHECK (capacidad > 0)
);

CREATE TABLE parqueo_linea (
  parqueo_id NUMBER(10) NOT NULL,
  linea_id NUMBER(10) NOT NULL,
  CONSTRAINT pk_parqueo_linea PRIMARY KEY (parqueo_id, linea_id),
  CONSTRAINT fk_pl_parqueo FOREIGN KEY (parqueo_id) REFERENCES parqueo(id) ON DELETE CASCADE,
  CONSTRAINT fk_pl_linea FOREIGN KEY (linea_id) REFERENCES linea(id) ON DELETE CASCADE
);

CREATE SEQUENCE parqueo_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER parqueo_bi
BEFORE INSERT ON parqueo
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT parqueo_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE bus (
  id NUMBER(10) NOT NULL,
  numero_unidad VARCHAR2(20) NOT NULL,
  placa VARCHAR2(15) NOT NULL,
  modelo VARCHAR2(50),
  capacidad_pasajeros NUMBER(10) NOT NULL,
  linea_id NUMBER(10),
  parqueo_id NUMBER(10) NOT NULL,
  estacion_actual_id NUMBER(10),
  estado VARCHAR2(30) DEFAULT 'ListoParaAccion' NOT NULL,
  ocupacion_actual NUMBER(10) DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_bus PRIMARY KEY (id),
  CONSTRAINT uq_bus_numero_unidad UNIQUE (numero_unidad),
  CONSTRAINT uq_bus_placa UNIQUE (placa),
  CONSTRAINT chk_bus_capacidad CHECK (capacidad_pasajeros > 0),
  CONSTRAINT chk_bus_ocupacion CHECK (ocupacion_actual >= 0),
  CONSTRAINT fk_bus_linea FOREIGN KEY (linea_id) REFERENCES linea(id) ON DELETE SET NULL,
  CONSTRAINT fk_bus_parqueo FOREIGN KEY (parqueo_id) REFERENCES parqueo(id),
  CONSTRAINT fk_bus_estacion_actual FOREIGN KEY (estacion_actual_id) REFERENCES estacion(id) ON DELETE SET NULL
);

CREATE SEQUENCE bus_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER bus_bi
BEFORE INSERT ON bus
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT bus_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE piloto (
  id NUMBER(10) NOT NULL,
  nombre NVARCHAR2(100) NOT NULL,
  apellido NVARCHAR2(100) NOT NULL,
  dpi VARCHAR2(20) NOT NULL,
  licencia VARCHAR2(20) NOT NULL,
  direccion_residencia NVARCHAR2(255),
  telefono VARCHAR2(20),
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_piloto PRIMARY KEY (id),
  CONSTRAINT uq_piloto_dpi UNIQUE (dpi)
);

CREATE SEQUENCE piloto_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER piloto_bi
BEFORE INSERT ON piloto
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT piloto_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE historial_educativo (
  id NUMBER(10) NOT NULL,
  piloto_id NUMBER(10) NOT NULL,
  nivel_estudio NVARCHAR2(100),
  institucion NVARCHAR2(150),
  anio_graduacion NUMBER(4),
  CONSTRAINT pk_historial_educativo PRIMARY KEY (id),
  CONSTRAINT fk_he_piloto FOREIGN KEY (piloto_id) REFERENCES piloto(id) ON DELETE CASCADE
);

CREATE SEQUENCE historial_educativo_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER historial_educativo_bi
BEFORE INSERT ON historial_educativo
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT historial_educativo_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE asignacion_piloto_bus (
  id NUMBER(10) NOT NULL,
  piloto_id NUMBER(10) NOT NULL,
  bus_id NUMBER(10) NOT NULL,
  activo NUMBER(1) DEFAULT 1 NOT NULL,
  fecha_inicio TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_asignacion_piloto_bus PRIMARY KEY (id),
  CONSTRAINT chk_asignacion_activo CHECK (activo IN (0, 1)),
  CONSTRAINT fk_apb_piloto FOREIGN KEY (piloto_id) REFERENCES piloto(id) ON DELETE CASCADE,
  CONSTRAINT fk_apb_bus FOREIGN KEY (bus_id) REFERENCES bus(id) ON DELETE CASCADE
);

CREATE SEQUENCE asignacion_piloto_bus_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER asignacion_piloto_bus_bi
BEFORE INSERT ON asignacion_piloto_bus
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT asignacion_piloto_bus_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE UNIQUE INDEX uq_apb_bus_activo ON asignacion_piloto_bus (DECODE(activo, 1, bus_id, NULL));
CREATE UNIQUE INDEX uq_apb_piloto_activo ON asignacion_piloto_bus (DECODE(activo, 1, piloto_id, NULL));

CREATE TABLE registro_ocupacion (
  id NUMBER(10) NOT NULL,
  bus_id NUMBER(10) NOT NULL,
  estacion_id NUMBER(10),
  usuario_id NUMBER(10),
  ocupacion_actual NUMBER(10) NOT NULL,
  capacidad_pasajeros NUMBER(10) NOT NULL,
  ocupacion_pct NUMBER(6, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_registro_ocupacion PRIMARY KEY (id),
  CONSTRAINT chk_registro_ocupacion_ocupacion CHECK (ocupacion_actual >= 0),
  CONSTRAINT chk_registro_ocupacion_capacidad CHECK (capacidad_pasajeros > 0),
  CONSTRAINT chk_registro_ocupacion_pct CHECK (ocupacion_pct >= 0),
  CONSTRAINT fk_ro_bus FOREIGN KEY (bus_id) REFERENCES bus(id) ON DELETE CASCADE,
  CONSTRAINT fk_ro_estacion FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE SET NULL,
  CONSTRAINT fk_ro_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL
);

CREATE SEQUENCE registro_ocupacion_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER registro_ocupacion_bi
BEFORE INSERT ON registro_ocupacion
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT registro_ocupacion_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE guardia (
  id NUMBER(10) NOT NULL,
  nombre NVARCHAR2(100) NOT NULL,
  apellido NVARCHAR2(100) NOT NULL,
  dpi VARCHAR2(20) NOT NULL,
  acceso_id NUMBER(10) NOT NULL,
  turno VARCHAR2(20) NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_guardia PRIMARY KEY (id),
  CONSTRAINT uq_guardia_dpi UNIQUE (dpi),
  CONSTRAINT fk_guardia_acceso FOREIGN KEY (acceso_id) REFERENCES acceso(id) ON DELETE CASCADE
);

CREATE SEQUENCE guardia_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER guardia_bi
BEFORE INSERT ON guardia
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT guardia_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE operador (
  id NUMBER(10) NOT NULL,
  nombre NVARCHAR2(100) NOT NULL,
  apellido NVARCHAR2(100) NOT NULL,
  dpi VARCHAR2(20) NOT NULL,
  estacion_id NUMBER(10) NOT NULL,
  pc_nombre NVARCHAR2(50),
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_operador PRIMARY KEY (id),
  CONSTRAINT uq_operador_dpi UNIQUE (dpi),
  CONSTRAINT uq_operador_estacion UNIQUE (estacion_id),
  CONSTRAINT fk_operador_estacion FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE CASCADE
);

CREATE SEQUENCE operador_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER operador_bi
BEFORE INSERT ON operador
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT operador_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE alerta (
  id NUMBER(10) NOT NULL,
  tipo VARCHAR2(30) NOT NULL,
  mensaje CLOB NOT NULL,
  bus_id NUMBER(10),
  estacion_id NUMBER(10),
  leida NUMBER(1) DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_alerta PRIMARY KEY (id),
  CONSTRAINT chk_alerta_leida CHECK (leida IN (0, 1)),
  CONSTRAINT fk_alerta_bus FOREIGN KEY (bus_id) REFERENCES bus(id) ON DELETE SET NULL,
  CONSTRAINT fk_alerta_estacion FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE SET NULL
);

CREATE TABLE alerta_saturacion (
  id NUMBER(10) NOT NULL,
  registro_ocupacion_id NUMBER(10),
  bus_id NUMBER(10),
  estacion_id NUMBER(10),
  ocupacion_pct NUMBER(6, 2),
  mensaje CLOB NOT NULL,
  leida NUMBER(1) DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_alerta_saturacion PRIMARY KEY (id),
  CONSTRAINT chk_alerta_saturacion_leida CHECK (leida IN (0, 1)),
  CONSTRAINT fk_as_ro FOREIGN KEY (registro_ocupacion_id) REFERENCES registro_ocupacion(id) ON DELETE SET NULL,
  CONSTRAINT fk_as_bus FOREIGN KEY (bus_id) REFERENCES bus(id) ON DELETE SET NULL,
  CONSTRAINT fk_as_estacion FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE SET NULL
);

CREATE SEQUENCE alerta_saturacion_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER alerta_saturacion_bi
BEFORE INSERT ON alerta_saturacion
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT alerta_saturacion_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE SEQUENCE alerta_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER alerta_bi
BEFORE INSERT ON alerta
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT alerta_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE orden_refuerzo (
  id NUMBER(10) NOT NULL,
  bus_objetivo_id NUMBER(10),
  linea_id NUMBER(10),
  estacion_id NUMBER(10),
  estado VARCHAR2(20) NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  CONSTRAINT pk_orden_refuerzo PRIMARY KEY (id),
  CONSTRAINT fk_or_bus_objetivo FOREIGN KEY (bus_objetivo_id) REFERENCES bus(id) ON DELETE SET NULL,
  CONSTRAINT fk_or_linea FOREIGN KEY (linea_id) REFERENCES linea(id) ON DELETE SET NULL,
  CONSTRAINT fk_or_estacion FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE SET NULL
);

CREATE SEQUENCE orden_refuerzo_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER orden_refuerzo_bi
BEFORE INSERT ON orden_refuerzo
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT orden_refuerzo_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE bitacora_auditoria (
  id NUMBER(10) NOT NULL,
  usuario_id NUMBER(10),
  rol VARCHAR2(30),
  accion VARCHAR2(50) NOT NULL,
  recurso VARCHAR2(50) NOT NULL,
  recurso_id NUMBER(10),
  detalle_json CLOB,
  ip VARCHAR2(64),
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_bitacora_auditoria PRIMARY KEY (id),
  CONSTRAINT fk_ba_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL,
  CONSTRAINT chk_ba_detalle_json CHECK (detalle_json IS JSON)
);

CREATE SEQUENCE bitacora_auditoria_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER bitacora_auditoria_bi
BEFORE INSERT ON bitacora_auditoria
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT bitacora_auditoria_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE refresh_token (
  id NUMBER(10) NOT NULL,
  usuario_id NUMBER(10) NOT NULL,
  token_hash VARCHAR2(100) NOT NULL,
  revoked NUMBER(1) DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  CONSTRAINT pk_refresh_token PRIMARY KEY (id),
  CONSTRAINT chk_refresh_token_revoked CHECK (revoked IN (0, 1)),
  CONSTRAINT fk_refresh_token_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE SEQUENCE refresh_token_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER refresh_token_bi
BEFORE INSERT ON refresh_token
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT refresh_token_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE rol (
  id NUMBER(10) NOT NULL,
  codigo VARCHAR2(30) NOT NULL,
  nombre NVARCHAR2(50) NOT NULL,
  activo NUMBER(1) DEFAULT 1 NOT NULL,
  CONSTRAINT pk_rol PRIMARY KEY (id),
  CONSTRAINT uq_rol_codigo UNIQUE (codigo),
  CONSTRAINT uq_rol_nombre UNIQUE (nombre),
  CONSTRAINT chk_rol_activo CHECK (activo IN (0, 1))
);

CREATE SEQUENCE rol_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER rol_bi
BEFORE INSERT ON rol
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT rol_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

ALTER TABLE usuario
  ADD CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES rol(id) ON DELETE SET NULL;

CREATE TABLE permiso (
  id NUMBER(10) NOT NULL,
  codigo VARCHAR2(50) NOT NULL,
  descripcion NVARCHAR2(150),
  CONSTRAINT pk_permiso PRIMARY KEY (id),
  CONSTRAINT uq_permiso_codigo UNIQUE (codigo)
);

CREATE SEQUENCE permiso_id_seq START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER permiso_bi
BEFORE INSERT ON permiso
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT permiso_id_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

CREATE TABLE rol_permiso (
  rol_id NUMBER(10) NOT NULL,
  permiso_id NUMBER(10) NOT NULL,
  CONSTRAINT pk_rol_permiso PRIMARY KEY (rol_id, permiso_id),
  CONSTRAINT fk_rp_rol FOREIGN KEY (rol_id) REFERENCES rol(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_permiso FOREIGN KEY (permiso_id) REFERENCES permiso(id) ON DELETE CASCADE
);

CREATE TABLE config_param (
  clave VARCHAR2(60) NOT NULL,
  valor_num NUMBER(18, 6),
  valor_text VARCHAR2(200),
  activo NUMBER(1) DEFAULT 1 NOT NULL,
  CONSTRAINT pk_config_param PRIMARY KEY (clave),
  CONSTRAINT chk_config_param_activo CHECK (activo IN (0, 1))
);

CREATE TABLE cat_estado_bus (
  codigo VARCHAR2(30) NOT NULL,
  nombre NVARCHAR2(60) NOT NULL,
  ui_class VARCHAR2(120),
  activo NUMBER(1) DEFAULT 1 NOT NULL,
  orden NUMBER(10) DEFAULT 0 NOT NULL,
  CONSTRAINT pk_cat_estado_bus PRIMARY KEY (codigo),
  CONSTRAINT chk_cat_estado_bus_activo CHECK (activo IN (0, 1))
);

CREATE TABLE cat_estado_refuerzo (
  codigo VARCHAR2(20) NOT NULL,
  nombre NVARCHAR2(60) NOT NULL,
  ui_class VARCHAR2(120),
  activo NUMBER(1) DEFAULT 1 NOT NULL,
  orden NUMBER(10) DEFAULT 0 NOT NULL,
  CONSTRAINT pk_cat_estado_refuerzo PRIMARY KEY (codigo),
  CONSTRAINT chk_cat_estado_refuerzo_activo CHECK (activo IN (0, 1))
);

CREATE TABLE cat_tipo_alerta (
  codigo VARCHAR2(30) NOT NULL,
  nombre NVARCHAR2(60) NOT NULL,
  ui_class VARCHAR2(120),
  activo NUMBER(1) DEFAULT 1 NOT NULL,
  CONSTRAINT pk_cat_tipo_alerta PRIMARY KEY (codigo),
  CONSTRAINT chk_cat_tipo_alerta_activo CHECK (activo IN (0, 1))
);

CREATE TABLE cat_turno_guardia (
  codigo VARCHAR2(20) NOT NULL,
  nombre NVARCHAR2(60) NOT NULL,
  ui_class VARCHAR2(120),
  activo NUMBER(1) DEFAULT 1 NOT NULL,
  orden NUMBER(10) DEFAULT 0 NOT NULL,
  CONSTRAINT pk_cat_turno_guardia PRIMARY KEY (codigo),
  CONSTRAINT chk_cat_turno_guardia_activo CHECK (activo IN (0, 1))
);

CREATE TABLE cat_transicion_refuerzo (
  desde_estado VARCHAR2(20) NOT NULL,
  hacia_estado VARCHAR2(20) NOT NULL,
  CONSTRAINT pk_cat_transicion_refuerzo PRIMARY KEY (desde_estado, hacia_estado),
  CONSTRAINT fk_ctr_desde FOREIGN KEY (desde_estado) REFERENCES cat_estado_refuerzo(codigo) ON DELETE CASCADE,
  CONSTRAINT fk_ctr_hacia FOREIGN KEY (hacia_estado) REFERENCES cat_estado_refuerzo(codigo) ON DELETE CASCADE
);

CREATE OR REPLACE TRIGGER bus_estado_biu
BEFORE INSERT OR UPDATE OF estado ON bus
FOR EACH ROW
DECLARE
  v_dummy NUMBER;
BEGIN
  SELECT 1 INTO v_dummy
  FROM cat_estado_bus
  WHERE codigo = :NEW.estado AND activo = 1;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RAISE_APPLICATION_ERROR(-20001, 'BUS_ESTADO_INVALIDO');
END;
/

CREATE OR REPLACE TRIGGER orden_refuerzo_estado_biu
BEFORE INSERT OR UPDATE OF estado ON orden_refuerzo
FOR EACH ROW
DECLARE
  v_dummy NUMBER;
  v_default VARCHAR2(20);
BEGIN
  IF :NEW.estado IS NULL THEN
    BEGIN
      SELECT valor_text INTO v_default
      FROM config_param
      WHERE clave = 'REFUERZO_ESTADO_INICIAL' AND activo = 1;
      :NEW.estado := v_default;
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        NULL;
    END;
  END IF;

  IF :NEW.estado IS NULL THEN
    BEGIN
      SELECT codigo INTO v_default
      FROM (
        SELECT codigo
        FROM cat_estado_refuerzo
        WHERE activo = 1
        ORDER BY orden
      )
      WHERE ROWNUM = 1;
      :NEW.estado := v_default;
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        NULL;
    END;
  END IF;

  SELECT 1 INTO v_dummy
  FROM cat_estado_refuerzo
  WHERE codigo = :NEW.estado AND activo = 1;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RAISE_APPLICATION_ERROR(-20002, 'REFUERZO_ESTADO_INVALIDO');
END;
/

CREATE OR REPLACE TRIGGER alerta_tipo_biu
BEFORE INSERT OR UPDATE OF tipo ON alerta
FOR EACH ROW
DECLARE
  v_dummy NUMBER;
BEGIN
  SELECT 1 INTO v_dummy
  FROM cat_tipo_alerta
  WHERE codigo = :NEW.tipo AND activo = 1;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RAISE_APPLICATION_ERROR(-20003, 'ALERTA_TIPO_INVALIDO');
END;
/

CREATE OR REPLACE TRIGGER guardia_turno_biu
BEFORE INSERT OR UPDATE OF turno ON guardia
FOR EACH ROW
DECLARE
  v_dummy NUMBER;
BEGIN
  SELECT 1 INTO v_dummy
  FROM cat_turno_guardia
  WHERE codigo = :NEW.turno AND activo = 1;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RAISE_APPLICATION_ERROR(-20004, 'GUARDIA_TURNO_INVALIDO');
END;
/

CREATE OR REPLACE VIEW v_reporte_estaciones AS
SELECT
  e.id AS estacion_id,
  e.nombre AS estacion_nombre,
  m.nombre AS municipalidad_nombre,
  o.id AS operador_id,
  (o.nombre || ' ' || o.apellido) AS operador_nombre,
  o.pc_nombre AS operador_pc_nombre,
  (SELECT COUNT(*) FROM acceso a WHERE a.estacion_id = e.id) AS accesos_count,
  (SELECT COUNT(*) FROM guardia g JOIN acceso a2 ON a2.id = g.acceso_id WHERE a2.estacion_id = e.id) AS guardias_count
FROM estacion e
JOIN municipalidad m ON m.id = e.municipalidad_id
LEFT JOIN operador o ON o.estacion_id = e.id;

CREATE OR REPLACE VIEW v_reporte_lineas AS
SELECT
  l.id AS linea_id,
  l.nombre AS linea_nombre,
  l.color,
  m.nombre AS municipalidad_nombre,
  (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) AS estaciones_count,
  (SELECT NVL(SUM(le.distancia_siguiente_km), 0) FROM linea_estacion le WHERE le.linea_id = l.id) AS distancia_total_km,
  (SELECT COUNT(*) FROM bus b WHERE b.linea_id = l.id) AS buses_count
FROM linea l
JOIN municipalidad m ON m.id = l.municipalidad_id;

CREATE OR REPLACE VIEW v_reporte_buses_por_linea AS
SELECT
  l.id AS linea_id,
  l.nombre AS linea_nombre,
  (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) AS estaciones_count,
  (SELECT COUNT(*) FROM bus b WHERE b.linea_id = l.id) AS buses_count,
  (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) *
    NVL((SELECT valor_num FROM config_param WHERE clave = 'LINEA_MIN_BUSES_PER_ESTACION' AND activo = 1), 1) AS min_buses,
  (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) *
    NVL((SELECT valor_num FROM config_param WHERE clave = 'LINEA_MAX_BUSES_MULTIPLIER' AND activo = 1), 2) AS max_buses,
  CASE
    WHEN (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) > 0
     AND (SELECT COUNT(*) FROM bus b WHERE b.linea_id = l.id) BETWEEN
        (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) *
          NVL((SELECT valor_num FROM config_param WHERE clave = 'LINEA_MIN_BUSES_PER_ESTACION' AND activo = 1), 1)
        AND (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) *
          NVL((SELECT valor_num FROM config_param WHERE clave = 'LINEA_MAX_BUSES_MULTIPLIER' AND activo = 1), 2)
    THEN 1 ELSE 0
  END AS cumple_regla
FROM linea l;
