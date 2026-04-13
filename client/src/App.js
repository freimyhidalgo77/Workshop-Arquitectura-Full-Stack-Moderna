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


  const cargarDocentes = asyc() => {
    try {
      const response = await fetch('http://localhost:3001/docentes');
      const data = await response.json();
      setRegistros(data);

    }catch(error){
      alert('error al cargar los docentes');
    }
  };

  const LimpiarFormulario  = () => {
    setNombre("");
    setCorreo("");
    setTelefono("");
    setTitulo("");
    setAreaAcademica("");
    setDedicacion("");
    setAniosExperiencia(0);
  };


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
