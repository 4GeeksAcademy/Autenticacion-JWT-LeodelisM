const TOKEN_KEY = "token";
const USER_KEY = "user"; 

export const initialStore = () => {
  return {
    tareas: [],
    token: localStorage.getItem(TOKEN_KEY),
    user: JSON.parse(localStorage.getItem(USER_KEY)) || null,
  };
};
  

export default function storeReducer(store, action = {}) {

  switch (action.type) {
   
    case "set_token":
      const token = action.payload.token;
      const user = action.payload.user;
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user)); // Guardar usuario en localStorage
      
        return {
          ...store,
          token,
          user,
        };

      case "logout":
        localStorage.removeItem(TOKEN_KEY);
       
        return {
          ...store,
          token: "",
        };
    
    case "set_tasks":
    const tasks = action.payload;

      return {
        ...store,
        tareas: tasks
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

      case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
