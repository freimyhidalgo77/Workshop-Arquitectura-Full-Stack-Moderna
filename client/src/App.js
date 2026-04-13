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

  const[registros, setRegistros] = useState([]);
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
      const docente = registros[editIndex];
      const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(payload)

      });

      if(response.ok){
        const nuevoRegistros = [...registros];
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
    setRegistros([...registros, data]);
    alert('Docente guardado correctamente');
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
  const docente = registros[idx];

  try {
    const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
      method: 'DELETE'
    });

    if(response.ok){
      setRegistros(registros.filter((_, index) => index !== idx));
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
   const reg = registros[idx];
   setNombre(reg.nombre);
   setCorreo(reg.correo);
   setTelefono(reg.telefono);
   setTitulo(reg.titulo);
   setAreaAcademica(reg.area_academica);
   setDedicacion(reg.dedicacion);
   setAniosExperiencia(reg.anios_experiencia);
   setEditIndex(idx);
};

  
return (
    <div className="container">
      <h1>Gestión de Docentes</h1>

      {/* Formulario de Registro */}
      <div className="form-section">
        <h2>{editIndex !== null ? 'Editar Docente' : 'Nuevo Registro'}</h2>
        <form onSubmit={registrarDatos}>
          <div className="form-group">
            <label>Nombre:</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Correo:</label>
            <input 
              type="email" 
              value={correo} 
              onChange={(e) => setCorreo(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input 
              type="tel" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Título:</label>
            <input 
              type="text" 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Área Académica:</label>
            <input 
              type="text" 
              value={areaAcademica} 
              onChange={(e) => setAreaAcademica(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Dedicación:</label>
            <select value={dedicacion} onChange={(e) => setDedicacion(e.target.value)}>
              <option value="">Seleccione...</option>
              <option value="Tiempo Completo">Tiempo Completo</option>
              <option value="Medio Tiempo">Medio Tiempo</option>
              <option value="Por Horas">Por Horas</option>
            </select>
          </div>

          <div className="form-group">
            <label>Años de Experiencia:</label>
            <input 
              type="number" 
              value={aniosExperiencia} 
              onChange={(e) => setAniosExperiencia(parseInt(e.target.value))} 
            />
          </div>

          <div className="button-group">
            <button type="submit">
              {editIndex !== null ? 'Actualizar' : 'Guardar'}
            </button>
            {editIndex !== null && (
              <button type="button" onClick={limpiarFormulario}>Cancelar</button>
            )}
          </div>
        </form>
      </div>

      <hr />

      {/* Tabla de Registros */}
      <div className="list-section">
        <h2>Listado de Docentes</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Título</th>
              <th>Área</th>
              <th>Exp.</th>
              <th>Dedicacion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((docente, index) => (
              <tr key={docente.id || index}>
                <td>{docente.nombre}</td>
                <td>{docente.correo}</td>
                <td>{docente.titulo}</td>
                <td>{docente.area_academica}</td>
                <td>{docente.anios_experiencia}</td>
                 <td>{docente.dedicacion}</td>
                <td>
                  <button onClick={() => editarRegistro(index)}>Editar</button>
                  <button onClick={() => eliminarRegistro(index)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
