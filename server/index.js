//Servidor APi

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());

app.use(express.json());

//Ruta 1: GET de empleados
app.get('/docentes', (req, res) => {
    const sql = 'SELECT * FROM docentes';

    db.query(sql, (err, results) => {
        if (err) {
            //500 error interno del servidor, fallo la bd
            return res.status(500).json({ error: 'Error al obtener los docentes' });
        }

        res.json(results);
   });
})

//Ruta 2: GET empleados by Id
app.get('/docentes:/id', (req, res) => {
    const sql = 'SELECT * FROM docentes where id = ?';
    const {id} = req.params;

    db.query(sql, (err, [id], results) => {
        if (err) {
            //500 error interno del servidor, fallo la bd
            return res.status(500).json({ error: 'Error al obtener el docente' });
        }

        res.json(results);
   });

   if(!results.length){
    //404 no encontrado
    return res.status(404).json({ error: 'Docente no encontrado' });
   }

   res.json(results[0]);

});
