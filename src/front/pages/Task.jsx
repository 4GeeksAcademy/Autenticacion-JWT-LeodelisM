import React, { useState, useEffect } from "react";
import useGlobalReducer from '../hooks/useGlobalReducer';
import apiClient from '../api';

export const Task = () => {
  const {store, dispatch} = useGlobalReducer();
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Tareas del estado global (store)
  const tareas = store.tareas
 
  useEffect(() => {
    renderTask();
  }, []);

async function renderTask() {
    setLoading(true);
    setError(null);

    try {
        const taskData = await apiClient.getTasks();

        if (taskData) {
            dispatch({
                type: "set_tasks",
                payload: taskData
            });

        } else {
            throw new Error("No se encontraron tareas");
        }

    } catch (error) {
        console.log("Error al cargar tareas:", error);
        setError(error.message || "No se pudieron la lista de tareas");
        
    } finally {
        setLoading(false);
    }
}
  
  // Función para manejar cambios en el input de texto
  const handleTextoChange = (e) => {
    setNuevaTarea(e.target.value);
  };

  // Función para manejar cambios en el select de prioridad
  const handlePrioridadChange = (e) => {
    setPrioridad(e.target.value);
  };

  // Función para agregar una nueva tarea
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (nuevaTarea.trim() === "" || prioridad === "") return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Llamada a la API para crear una tarea
      const nuevaTareaObj = {
        description: nuevaTarea,
        priority: prioridad
      };
      
      const response = await apiClient.createTask(nuevaTareaObj);
      console.log("Tarea creada:", response); // Para depuración
      
      // Actualizar el estado con la nueva tarea
      dispatch({
        type: 'add_tarea',
        payload: response
      });
      
      // Limpiar el formulario
      setNuevaTarea("");
      setPrioridad("");
    } catch (err) {
      console.error("Error al crear tarea:", err);
      setError("No se pudo crear la tarea");
    } finally {
      setLoading(false);
    }
  };


  // Función para eliminar una tarea
  const handleEliminar = async (taskId) => {
    try {
      // Usamos await para esperar que la petición termine
      await apiClient.deleteTask(taskId);
  
      // Actualizamos el estado con dispatch
      dispatch({
        type: "delete_tarea",
        payload: taskId  // Aquí usamos taskId en lugar de id
      });
  
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-custom text-white text-center">
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
                    <button type="submit" 
                            className="btn btn-secondary w-100">Agregar</button>
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
                          <span>{tarea.description}</span>
                          <span className={`badge ${tarea.priority === 'importante' ? 'bg-primary' : 
                                           tarea.priority === 'urgente' ? 'bg-danger' : 
                                           tarea.priority === 'programar' ? 'bg-warning' : 
                                           'bg-info'} ms-2`}>
                            {tarea.priority}
                          </span>
                        </div>
                        <div>
                          <button 
                            className="btn btn btn-info btn-sm me-2"
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