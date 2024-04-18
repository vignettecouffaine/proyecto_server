const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());    

mongoose.connect(process.env.MONGOD_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB"));
db.once("open", () => {
    console.log("Conectado a la base de datos MongoDB");
});

const UsuarioSchema = new mongoose.Schema({
    Nombre: String,
    Email: String,
    Pass: String,
    Edad: Number,
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener todos los usuarios", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.post("/usuarios", async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error("Error al crear un nuevo usuario", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ Email: email, Pass: password });
        if (!usuario) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }
        // Si las credenciales son válidas, puedes devolver un token de autenticación u otro tipo de identificador de sesión
        // Por simplicidad, aquí devolvemos solo un mensaje de éxito
        res.json({ message: "Inicio de sesión exitoso" });
    } catch (error) {
        console.error("Error al iniciar sesión", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.put("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, req.body, { new: true });
        if (!usuarioActualizado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(usuarioActualizado);
    } catch (error) {
        console.error("Error al actualizar el usuario", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.delete("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);
        if (!usuarioEliminado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(usuarioEliminado);
    } catch (error) {
        console.error("Error al eliminar el usuario", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log("Servidor en funcionamiento en el puerto", PORT);
});
