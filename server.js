// const express = require('express');
// const mysql = require('mysql');
// const app = express ();

// app.listen(4000, () => {
//     console.log("Server prendido");
// });

// const connection = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password: '',
//     database:'gamers',

// });

// connection.connect((err) => {
//     if (err){
//         console.error('Error de conexion ', err);
//         return;
//     }

//     console.log('Conexion realizada!');

//     connection.query("SELECT * FROM juegos", (err, rows) => {
//         if (err){
//             console.error('Error de conexion ', err);
//             return;
//         }
        
//     });

// })

// app.get("/obtenerJuegos", (request, response) => {
//     connection.query("SELECT * FROM juegos", (err, rows) => {
//         if (err) {
//             console.error('Error de conexión ', err);
//             response.status(500).send('Error de conexión a la base de datos');
//             return;
//         }
//         response.json(rows);
//     });
// });

// app.use(express.json());

// app.post("/agregarJuego", (request, response) => {
//     const { Id, Titulo, Plataforma, Desarrollador, Precio, Stock } = request.body;

//     connection.query(
//         "INSERT INTO juegos (Id, Titulo, Plataforma, Desarrollador, Precio, Stock) VALUES (?, ?, ?, ?, ?, ?)",
//         [Id, Titulo, Plataforma, Desarrollador, Precio, Stock],
//         (err, result) => {
//             if (err) {
//                 console.error('Error de conexión ', err);
//                 response.status(500).send('Error de conexión a la base de datos');
//                 return;
//             }
//             if (result.affectedRows === 1) {
//                 response.status(200).send('Juego añadido correctamente');
//             } else {
//                 response.status(500).send('Error al añadir el juego');
//             }
//         }
//     );
// });

// app.put("/actualizarJuego/:id", (request, response) => {
//     const juegoId = request.params.id;
//     const datosActualizados = request.body;

//     // Verificar si los campos necesarios están presentes en la solicitud
//     if (!datosActualizados.Titulo || !datosActualizados.Plataforma || !datosActualizados.Desarrollador || !datosActualizados.Precio || !datosActualizados.Stock) {
//         response.status(400).send('Faltan campos obligatorios');
//         return;
//     }

//     connection.query(
//         "UPDATE juegos SET Titulo = ?, Plataforma = ?, Desarrollador = ?, Precio = ?, Stock = ? WHERE Id = ?",
//         [datosActualizados.Titulo, datosActualizados.Plataforma, datosActualizados.Desarrollador, datosActualizados.Precio, datosActualizados.Stock, juegoId],
//         (err, result) => {
//             if (err) {
//                 console.error('Error de conexión ', err);
//                 response.status(500).send('Error de conexión a la base de datos');
//                 return;
//             }

//             if (result.affectedRows === 0) {
//                 response.status(404).send('Juego no encontrado');
//             } else {
//                 response.status(200).send('Juego actualizado correctamente');
//             }
//         }
//     );
// });

// // Manejar solicitud DELETE para eliminar un juego existente
// app.delete("/eliminarJuego/:id", (request, response) => {
//     const juegoId = request.params.id;

//     connection.query("DELETE FROM juegos WHERE Id = ?", [juegoId], (err, result) => {
//         if (err) {
//             console.error('Error de conexión ', err);
//             response.status(500).send('Error de conexión a la base de datos');
//             return;
//         }

//         if (result.affectedRows === 0) {
//             response.status(404).send('Juego no encontrado');
//         } else {
//             response.status(200).send('Juego eliminado correctamente');
//         }
//     });
// });

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors()); // Habilitar CORS para todas las rutas

app.listen(4000, () => {
    console.log("Servidor encendido en el puerto 4000");
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gamers',
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión', err);
        return;
    }

    console.log('Conexión realizada a la base de datos');

    connection.query("SELECT * FROM juegos", (err, rows) => {
        if (err) {
            console.error('Error al ejecutar la consulta', err);
            return;
        }
        console.log('Filas de juegos:', rows);
    });
});

app.use(express.json());

app.get("/obtenerJuegos", (request, response) => {
    connection.query("SELECT * FROM juegos", (err, rows) => {
        if (err) {
            console.error('Error de conexión', err);
            response.status(500).send('Error de conexión a la base de datos');
            return;
        }
        response.json(rows);
    });
});

app.post("/agregarJuego", (request, response) => {
    const { Id, Titulo, Plataforma, Desarrollador, Precio, Stock } = request.body;

    connection.query(
        "INSERT INTO juegos (Id, Titulo, Plataforma, Desarrollador, Precio, Stock) VALUES (?, ?, ?, ?, ?, ?)",
        [Id, Titulo, Plataforma, Desarrollador, Precio, Stock],
        (err, result) => {
            if (err) {
                console.error('Error de conexión', err);
                response.status(500).send('Error de conexión a la base de datos');
                return;
            }
            if (result.affectedRows === 1) {
                response.status(200).send('Juego añadido correctamente');
            } else {
                response.status(500).send('Error al añadir el juego');
            }
        }
    );
});

app.put("/actualizarJuego/:id", (request, response) => {
    const juegoId = request.params.id;
    const datosActualizados = request.body;

    // Verificar si los campos necesarios están presentes en la solicitud
    if (!datosActualizados.Titulo || !datosActualizados.Plataforma || !datosActualizados.Desarrollador || !datosActualizados.Precio || !datosActualizados.Stock) {
        response.status(400).send('Faltan campos obligatorios');
        return;
    }

    connection.query(
        "UPDATE juegos SET Titulo = ?, Plataforma = ?, Desarrollador = ?, Precio = ?, Stock = ? WHERE Id = ?",
        [datosActualizados.Titulo, datosActualizados.Plataforma, datosActualizados.Desarrollador, datosActualizados.Precio, datosActualizados.Stock, juegoId],
        (err, result) => {
            if (err) {
                console.error('Error de conexión', err);
                response.status(500).send('Error de conexión a la base de datos');
                return;
            }

            if (result.affectedRows === 0) {
                response.status(404).send('Juego no encontrado');
            } else {
                response.status(200).send('Juego actualizado correctamente');
            }
        }
    );
});

// Manejar solicitud DELETE para eliminar un juego existente
app.delete("/eliminarJuego/:id", (request, response) => {
    const juegoId = request.params.id;

    connection.query("DELETE FROM juegos WHERE Id = ?", [juegoId], (err, result) => {
        if (err) {
            console.error('Error de conexión', err);
            response.status(500).send('Error de conexión a la base de datos');
            return;
        }

        if (result.affectedRows === 0) {
            response.status(404).send('Juego no encontrado');
        } else {
            response.status(200).send('Juego eliminado correctamente');
        }
    });
});



