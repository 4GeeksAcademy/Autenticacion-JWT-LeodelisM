export const initialStore = () => {
  return {
    tareas: [
      {
        id: "",
        texto: "",
        prioridad: "",
        completada: false
      }   
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_tarea":
      const nuevaTarea = action.payload;

      return {
        ...store,
        tareas: [...store.tareas, nuevaTarea],
      };

    case "delete_tarea":
      const idEliminar = action.payload;

      return {
        ...store,
        tareas: store.tareas.filter((tarea) => tarea.id !== idEliminar),
      };

    case "edit_tarea":
      const tareaEditada = action.payload;

      return {
        ...store,
        tareas: store.tareas.map((tarea) =>
          tarea.id === tareaEditada.id ? tareaEditada : tarea
        ),
      };

    case "toggle_estado_tarea":
      const idToggle = action.payload;

      return {
        ...store,
        tareas: store.tareas.map((tarea) =>
          tarea.id === idToggle
            ? { ...tarea, completada: !tarea.completada }
            : tarea
        ),
      };

    default:
      throw Error("Unknown action.");
  }
}
