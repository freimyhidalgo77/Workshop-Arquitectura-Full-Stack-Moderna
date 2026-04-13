import { useState, useEffect, useInsertionEffect } from 'react';
import './App.css';

function App() {

  //memoria del formulario
  //crear los estados

  const[nombre, setNombre] = useState("");
  const[correo, setCorreo] = useState("");
  const[telefono, setTelefono] = useState("");
  const[titulo, setTitulo] = useState("");
  const[areaAcademica, setAreaAcademica] = useState("");
  const[dedicacion, setDedicacion] = useState("");
  const[aniosExperiencia, setAniosExperiencia] = useState(0);

  const[resgitros, setRegistros] = useState([]);
  const[editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    cargarDocentes();

  },[]);


  const cargarDocentes = async() => {
    try {
      const response = await fetch('http://localhost:3001/docentes');
      const data = await response.json();
      setRegistros(data);

    }catch(error){
      alert('error al cargar los docentes');
    }

  };

  const limpiarFormulario  = () => {
    setNombre('');
    setCorreo('');
    setTelefono('');
    setTitulo('');
    setAreaAcademica('');
    setDedicacion('');
    setAniosExperiencia(0);
  };

  const registrarDatos = async(e) => {

    e.preventDefault();

    const payload = {
      nombre,
      correo,
      telefono,
      titulo,
      area_academica: areaAcademica,
      dedicacion,
      anios_experiencia: aniosExperiencia
    };
  

  if(editIndex !== null){

    //Camino de actualizar
    try {
      const docente = resgitros[editIndex];
      const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(payload)

      });

      if(response.ok){
        const nuevoRegistros = [...resgitros];
        nuevoRegistros[editIndex] = {
          ...docente,
          nombre,
          correo,
          telefono,
          titulo,
          area_academica: areaAcademica,
          dedicacion,
          anios_experiencia: aniosExperiencia,
        };
        setRegistros(nuevoRegistros);
        setEditIndex(null);
        alert('docente actualizado correctamente');
      } else {
        const err = await response.json().catch(() => ({}));
        alert (err.error || 'error al actualizar el docente');


      }
    }catch(error){

    }

  } else {

  try {

  //Camino de guardar  
  const response = await fetch('http://localhost:3001/docentes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if(response.ok) {
    setRegistros([...resgitros, data]);
    alert('Docentes guardado correctamente');
  } else {
    alert(data.error || 'Error al guardar el docente')

  }

    }catch(error){
         alert('Error de conexion al guardar');
        }
      }

 limpiarFormulario();
  
};


const eliminarRegistro = async(idx) => {
  const docente = resgitros[idx];

  try {
    const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
      method: 'DELETE'
    });

    if(response.ok){
      setRegistros(resgitros.filter((_, index) => index !== idx));
      if(editIndex === idx){
        setEditIndex(null);
        limpiarFormulario();
      }
      alert('Docente eliminado correctamente');
    }else{
      alert('Error al eliminar el docente');
    }


  }catch(error){
    alert('error de conexion al eliminar el docente');  
  }

};

const editarRegistro = (idx) => {
   const reg = registraciones[idx];
   setNombre(reg.nombre);
   setCorreo(reg.correo);
   setTelefono(reg.telefono);
   setTitulo(reg.titulo);
   setAreaAcademica(reg.area_academica);
   setDedicacion(reg.dedicacion);
   setAniosExperiencia(reg.anios_experiencia);
   setEditIndex(idx);
}
  
  return (
    

  );
}

export default App;
