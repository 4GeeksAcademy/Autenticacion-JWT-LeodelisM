import React, { useState } from "react";
import useGlobalReducer from '../hooks/useGlobalReducer';

console.log("useGlobalReducer:", useGlobalReducer);


export const TodoList = () => {
  const {store, dispatch} = useGlobalReducer();
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [prioridad, setPrioridad] = useState("");
  
  // Tareas del estado global (store)
  const tareas = store.tareas || [];

  // Función para manejar cambios en el input de texto
  const handleTextoChange = (e) => {
    setNuevaTarea(e.target.value);
  };

  // Función para manejar cambios en el select de prioridad
  const handlePrioridadChange = (e) => {
    setPrioridad(e.target.value);
  };

  // Función para agregar una nueva tarea
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (nuevaTarea.trim() === "" || prioridad === "") return;
    
    // Crear objeto de la nueva tarea
    const nuevaTareaObj = {
      id: Date.now().toString(),
      texto: nuevaTarea,
      prioridad: prioridad,
      completada: false
    };
    
    // Dispatch de la acción para agregar tarea
    dispatch({
      type: 'add_tarea',
      payload: nuevaTareaObj
    });
    
    // Limpiar el formulario
    setNuevaTarea("");
    setPrioridad("");
  };

  // Función para eliminar una tarea
  const handleEliminar = (id) => {
    dispatch({
      type: 'delete_tarea',
      payload: id
    });
  };

  // Función para editar una tarea (esto necesitaría un estado adicional para modo edición)
  const handleEditar = (id) => {
    // Por ahora solo alertamos - luego implementaremos la edición
    alert(`Editar tarea con ID: ${id}`);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white text-center">
              <h3>Lista de Tareas</h3>
            </div>
            <div className="card-body">
              {/* Formulario */}
              <form className="mb-4" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Escribe una nueva tarea"
                      value={nuevaTarea}
                      onChange={handleTextoChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    {/* Select para prioridades */}
                    <select 
                      className="form-select"
                      value={prioridad}
                      onChange={handlePrioridadChange}
                      required
                    >
                      <option value="">Selecciona una prioridad</option>
                      <option value="importante">Importante</option>
                      <option value="urgente">Urgente</option>
                      <option value="programar">Programar</option>
                      <option value="delegar">Delegar</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-primary w-100">Agregar</button>
                  </div>
                </div>
              </form>
              
              {/* Lista de tareas */}
              <div className="mt-4">
                {tareas.length > 0 ? (
                  <ul className="list-group">
                    {tareas.map((tarea) => (
                      <li key={tarea.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <span>{tarea.texto}</span>
                          <span className={`badge ${tarea.prioridad === 'importante' ? 'bg-primary' : 
                                           tarea.prioridad === 'urgente' ? 'bg-danger' : 
                                           tarea.prioridad === 'programar' ? 'bg-warning' : 
                                           'bg-info'} ms-2`}>
                            {tarea.prioridad}
                          </span>
                        </div>
                        <div>
                          <button 
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleEditar(tarea.id)}
                          >
                            Editar
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEliminar(tarea.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center mt-4">
                    <p className="text-muted">No hay tareas pendientes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};