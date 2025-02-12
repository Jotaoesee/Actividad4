const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51QqCx7DzvfiQtQhxAogrZaGS6or1LwpT6QZHj88z2Tvg4hNUEvfZH3KYaFDon86NvaZdmt3AyddGTxWt7ULeDkeu006CLLRYLA");

// Inicialización de Firebase Admin y Firestore
admin.initializeApp();
const db = admin.firestore();

// Configuración de Express y CORS
const app = express();
app.use(cors({ origin: true }));

// ===================== Endpoint de prueba =====================
app.get("/", (req, res) => {
    res.json({ message: "API funcionando correctamente" });
});

// ===================== Endpoint para crear perfil (con query params) =====================
app.post("/perfiles/crear_perfil", async (req, res) => {
    try {
        // Leer datos de la URL en lugar del body
        const { nombre, email, edad, tarjeta_credito, caducidad, cvv } = req.query;  

        if (!nombre || !email || !edad || !tarjeta_credito || !caducidad || !cvv) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Crear usuario en Firestore
        const perfilRef = await db.collection("perfiles").add({
            nombre,
            email,
            edad: parseInt(edad),
            tarjeta_credito,
            caducidad,
            cvv
        });

        // 🔹 Crear cliente en Stripe y guardar el ID
        const customer = await stripe.customers.create({
            name: nombre,
            email: email
        });

        await perfilRef.update({ stripeCustomerId: customer.id });

        res.json({ id: perfilRef.id, stripeCustomerId: customer.id, message: "Perfil creado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exportar API de Express como una función de Firebase
exports.api = functions.https.onRequest(app);
