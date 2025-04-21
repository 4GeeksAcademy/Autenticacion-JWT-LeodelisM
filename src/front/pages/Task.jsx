import React, { useState, useEffect } from "react";
import apiClient from '../api';

export const Task = () => {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar las tareas desde localStorage al iniciar
    const tareasGuardadas = localStorage.getItem('tareas');
    
    if (tareasGuardadas) {
      // Si hay tareas en localStorage, las usamos
      setTareas(JSON.parse(tareasGuardadas));
    } else {
      // Si no hay tareas en localStorage, se cargan desde la API (GET)
      cargarTareasDesdeAPI();
    }
  }, []);

  // Función para cargar tareas desde la API (GET/ getTasks)
  const cargarTareasDesdeAPI = async () => {
    setLoading(true);
    setError(null);

    try {
      const taskData = await apiClient.getTasks();

      if (taskData) {
        // Las tareas se guardan en el estado local
        setTareas(taskData);
        
        // Y también se guardan en localStorage
        localStorage.setItem('tareas', JSON.stringify(taskData));
      } else {
        throw new Error("No se encontraron tareas");
      }
    } catch (error) {
      setError(error.message || "No se pudieron cargar la lista de tareas");
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar cambios en el input de texto
  const handleTextoChange = (e) => {
    setNuevaTarea(e.target.value);
  };

  // Función para manejar cambios en el select de prioridad
  // urgente - importante - programar - delegar
  const handlePrioridadChange = (e) => {
    setPrioridad(e.target.value);
  };

  // Función para agregar una nueva tarea API (POST/ createTask)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica para no enviar los campos vacíos
    if (nuevaTarea.trim() === "" || prioridad === "") return;

    setLoading(true);
    setError(null);

    try {
      // Llamada a la API para crear una tarea, se crea el objeto de acuerdo con los campos en el models.py
      const nuevaTareaObj = {
        description: nuevaTarea,
        priority: prioridad
      };

      const response = await apiClient.createTask(nuevaTareaObj);

      // Actualizar el estado local con la nueva tarea
      const tareasActualizadas = [...tareas, response];
      setTareas(tareasActualizadas);
      
      // Guardar en localStorage
      localStorage.setItem('tareas', JSON.stringify(tareasActualizadas));

      // Limpiar el formulario
      setNuevaTarea("");
      setPrioridad("");
    } catch (err) {
      setError("No se pudo crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar el estado de la tarea (Completar/Reactivar)
  const handleCambiarEstado = async (id, completado) => {
    try {
      // Aquí no hay un endpoint
      // Actualizar las tareas localmente
      const tareasActualizadas = tareas.map(tarea => {
        if (tarea.id === id) {
          return {
            ...tarea,
            is_done: completado
          };
        }
        return tarea;
      });
      
      // Actualizamos el estado local
      setTareas(tareasActualizadas);
      
      // Guardamos en localStorage
      localStorage.setItem('tareas', JSON.stringify(tareasActualizadas));
      
    } catch (error) {
      console.error("Error al cambiar el estado de la tarea:", error);
    }
  };

  // Función para eliminar una tarea
  const handleEliminar = async (taskId) => {
    try {
      try {
        await apiClient.deleteTask(taskId);
      } catch (apiError) {
      }
  
      // Filtramos la tarea eliminada del array local
      const tareasFiltradas = tareas.filter(tarea => tarea.id !== taskId);
      
      // Actualizar el estado local
      setTareas(tareasFiltradas);
      
      // Guardar en localStorage
      localStorage.setItem('tareas', JSON.stringify(tareasFiltradas));
        
    } catch (error) {
      console.error('Error general al eliminar la tarea:', error);
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
                          <span style={{
                            textDecoration: tarea.is_done ? 'line-through' : 'none',
                            color: tarea.is_done ? '#6c757d' : 'black'
                          }}>{tarea.description}</span>
                          <span className={`badge ${tarea.priority === 'importante' ? 'bg-primary' : 
                                           tarea.priority === 'urgente' ? 'bg-danger' : 
                                           tarea.priority === 'programar' ? 'bg-warning' : 
                                           'bg-info'} ms-2`}>
                            {tarea.priority}
                          </span>
                        </div>
                        <div className="btn-group gap-1"> 
                          {tarea.is_done ? 
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() => handleCambiarEstado(tarea.id, false)}
                            >
                              Reactivar
                            </button> : 
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleCambiarEstado(tarea.id, true)}
                            >
                              Completar
                            </button>
                          }

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
  )};