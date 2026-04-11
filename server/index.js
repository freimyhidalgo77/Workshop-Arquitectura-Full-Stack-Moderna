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


//Ruta 3: POST empleado
app.post('/docentes', (req, res) => {
    const {nombres, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia} = req.body;

    if(!nombres?.trim() || !correo?.trim() || !telefono?.trim() || !titulo?.trim() || !area_academica?.trim() || !dedicacion?.trim() || !anios_experiencia){
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

     const anios = Number(anios_experiencia);

     if(Number.isNaN(anios) || anios < 0){
        return res.status(400).json({ error: 'Años de experiencia del docente invalidos' });
     }

     const sql = 'INSERT INTO docentes (nombres, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia) values (?, ?, ?, ?, ?, ?, ?)';

     db.query(sql, [nombres, correo, telefono, titulo, area_academica, dedicacion, anios], (err, results) => {
        if (err) {
            //500 error interno del servidor, fallo la bd
            return res.status(500).json({ error: 'Error al guardar el docente' });
        }

        res.json({ 
            id: results.insertId, 
            nombres, correo, 
            telefono, titulo, 
            area_academica, 
            dedicacion, 
            anios_experiencia: anios 

           });
        });
    });


    //Ruta 4 update docente
app.put('/docentes:/id', (req, res) => {

    const { id } = req.params;
    const {nombres, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia} = req.body;

    if(!nombres?.trim() || !correo?.trim() || !telefono?.trim() || !titulo?.trim() || !area_academica?.trim() || !dedicacion?.trim() || !anios_experiencia){
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

     const anios = Number(anios_experiencia);

     if(Number.isNaN(anios) || anios < 0){
        return res.status(400).json({ error: 'Años de experiencia del docente invalidos' });
     }

    const sql = 'Update docentes set nombres = ?, correo = ?, telefono = ?, titulo = ?, area_academica = ?, dedicacion = ?, anios_experiencia = ? where id = ?';

     db.query(sql, [nombres, correo, telefono, titulo, area_academica, dedicacion, anios, id], (err) => {
        if (err) {
            //500 error interno del servidor, fallo la bd
            return res.status(500).json({ error: 'Error al actualizar al docente' });
        }

   res.json({message: 'Docente actualizado correctamente'});

   });
});


//Ruta 5: Delete docente
    //Ruta 4 update docente
app.delete('/docentes:/id', (req, res) => {

    const { id } = req.params;
    const sql = 'Delete from docentes where id = ?';

     db.query(sql, [id], (err) => {
        if (err) {
            //500 error interno del servidor, fallo la bd
            return res.status(500).json({ error: 'Error al actualizar al docente' });
        }

   res.json({message: 'Docente eliminado correctamente'});

   });
});


app.listen(3001, () => {
    console.log('Servidor backend corriendo desde el puerto 3001');
});

    



