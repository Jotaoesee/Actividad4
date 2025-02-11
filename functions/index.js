const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_TU_CLAVE_SECRETA_STRIPE");

// Inicialización de Firebase Admin y Firestore
admin.initializeApp();
const db = admin.firestore();

// Configuración de Express y CORS
const app = express();
app.use(cors({ origin: true }));

// Exportar API de Express como una función de Firebase
exports.api = functions.https.onRequest(app);
