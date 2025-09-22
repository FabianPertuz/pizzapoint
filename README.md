# 🍕 Pizza y Punto

Sistema de gestión para cadena de pizzerías construido con Node.js y MongoDB.

## 🚀 Características

- Gestión de pedidos con transacciones
- Control de inventario automático
- Asignación inteligente de repartidores
- Reportes avanzados con Aggregation Framework

## 📦 Instalación

1. Clona el repositorio
2. Instala dependencias:
bash

npm install

Configura MongoDB local o remoto

Configura variables de entorno en .env

npm start


start


## 📊 Comandos disponibles

Realizar pedidos completos

Generar reportes de ventas

Analizar ingredientes más utilizados

Ver promedios de precios por categoría

## 🔄 Transacciones

El sistema utiliza transacciones de MongoDB para garantizar:

Consistencia en el inventario

Asignación segura de repartidores

Rollback automático en caso de errores

## 🏗️ Estructura de la base de datos

ingredientes: Control de stock

pizzas: Menú y recetas

pedidos: Registro de ventas

repartidores: Gestión de delivery

clientes: Información de clientes

