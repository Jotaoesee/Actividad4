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
// Para crear perfil en postman poner metodo post y de url: 
// https://us-central1-actividad4pspad.cloudfunctions.net/api/perfiles/crear_perfil?nombre=Pedro&email=pedro@example.com&edad=28&tarjeta_credito=4111111111111111&caducidad=10/28&cvv=123
// Sustituir los valores por los deseados

// ===================== Endpoint para obtener perfil por UID =====================
app.get("/perfiles/perfil", async (req, res) => {
    try {
        let { uid } = req.query;
        
        // 🔹 Eliminar espacios en blanco
        uid = uid ? uid.trim() : null;

        console.log(`🔹 UID recibido: "${uid}"`); 

        if (!uid) {
            return res.status(400).json({ error: "El UID es obligatorio" });
        }

        const perfilRef = await db.collection("perfiles").doc(uid).get();

        if (!perfilRef.exists) {
            console.log(`❌ Perfil no encontrado para UID: "${uid}"`); 
            return res.status(404).json({ message: "Perfil no encontrado" });
        }

        res.json(perfilRef.data());
    } catch (error) {
        console.error("❌ Error en /perfiles/perfil:", error);
        res.status(500).json({ error: error.message });
    }
});
// Para obtener perfil en postman poner metodo get y de url:
//https://us-central1-actividad4pspad.cloudfunctions.net/api/perfiles/perfil?uid=UidUsuario
//Sustituir UidUsuario por el uid del usuario deseado


// ===================== Endpoint para obtener perfiles con filtro de edad =====================
app.get("/perfiles/perfiles", async (req, res) => {
    try {
        const { edad_min } = req.query;

        if (!edad_min) {
            return res.status(400).json({ error: "El parámetro edad_min es obligatorio" });
        }

        const perfilesSnapshot = await db.collection("perfiles").where("edad", ">", parseInt(edad_min)).get();

        if (perfilesSnapshot.empty) {
            return res.status(404).json({ message: "No se encontraron perfiles con la edad mínima especificada" });
        }

        const perfiles = perfilesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(perfiles);
    } catch (error) {
        console.error("❌ Error en /perfiles/perfiles:", error);
        res.status(500).json({ error: error.message });
    }
});
// Para obtener perfiles en postman poner metodo get y de url:
//https://us-central1-actividad4pspad.cloudfunctions.net/api/perfiles/perfiles?edad_min=30
//Sustituir edad_min por la edad deseada

// ===================== Endpoint para crear producto =====================
app.post("/productos/crear_producto", async (req, res) => {
    const { nombre, precio } = req.query;

    if (!nombre || !precio) {
        return res.status(400).json({ error: "El nombre y el precio son obligatorios" });
    }

    const productoRef = await db.collection("productos").add({
        nombre,
        precio: parseFloat(precio)
    });

    res.json({ id: productoRef.id, message: "Producto creado exitosamente" });
});
// Para crear producto en postman poner metodo post y de url:
//https://us-central1-actividad4pspad.cloudfunctions.net/api/productos/crear_producto?nombre=teclado&precio=50
//Sustituir nombre y precio por los valores deseados

// ===================== Endpoint para pagar un producto con Stripe =====================
app.post("/productos/pagar_producto", async (req, res) => {
    try {
        const { uid_producto, uid_usuario, paymentMethodId } = req.query;

        // Verificar usuario en Firestore
        const usuarioRef = await db.collection("perfiles").doc(uid_usuario).get();
        if (!usuarioRef.exists) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const usuario = usuarioRef.data();

        // Verificar producto en Firestore
        const productoRef = await db.collection("productos").doc(uid_producto).get();
        if (!productoRef.exists) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        const producto = productoRef.data();

        // Verificar que el usuario tenga un cliente en Stripe
        if (!usuario.stripeCustomerId) {
            return res.status(400).json({ error: "El usuario no tiene un cliente en Stripe" });
        }

        // Crear el pago con el método de pago especificado
        const paymentIntent = await stripe.paymentIntents.create({
            amount: producto.precio * 100, 
            currency: "usd",
            customer: usuario.stripeCustomerId,
            payment_method: paymentMethodId, 
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never" 
            }
        });

        // Guardar recibo en Firestore
        const recibo = {
            uid_producto,
            nombre_producto: producto.nombre,
            precio: producto.precio,
            status: paymentIntent.status,
            fecha: new Date().toISOString()
        };

        await db.collection("perfiles").doc(uid_usuario).collection("recibos").add(recibo);
        res.json({ message: "Pago realizado", recibo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Para pagar producto en postman poner metodo post y de url:
//https://us-central1-actividad4pspad.cloudfunctions.net/api/productos/pagar_producto?uid_producto=teA42YxNVwZsBtSNfktV&uid_usuario=R5TCEn0WK27p1sUV6HKT&paymentMethodId=pm_card_visa
//Sustituir uid_producto, uid_usuario por los valores deseados    

// Exportar API de Express como una función de Firebase
exports.api = functions.https.onRequest(app);
