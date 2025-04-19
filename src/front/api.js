const TOKEN_KEY = "token";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

function getToken() {
  const token = localStorage.getItem('token');

  return token;
}

async function login(email, password) {
  try {
    // Validación
    if (!email || !password) {
      throw new Error("Email y contraseña son requeridos");
    }

    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // Verificar que el token existe en la respuesta
    if (!result.token) {
      throw new Error("La respuesta del servidor no contiene un token");
    }

    return {
      token: result.token,
      user: result.user,
    };

    
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error.message);
    throw error;
  }
}

async function signUp(name, email, password) {
  const response = await fetch(`${backendUrl}/api/auth/signup`, {
    method: "post",
    body: JSON.stringify({ name, email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

export default {
  login,
  signUp,
  getToken,
  createTask,
  getTasks,
  deleteTask,
};


async function createTask(taskData) {
  try {
    // Obtener el token
    const token = getToken();
    
    // Verificar si el token existe
    if (!token) {
      throw new Error("No hay token disponible");
    }
    
    // Validación
    if (!taskData.description || !taskData.priority) {
      throw new Error("Tarea y prioridad son requeridos");
    } 

    const response = await fetch(`${backendUrl}/api/tasks`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    
    // Manejar la respuesta
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.msg || `Error HTTP: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error al crear tarea:", error.message);
    throw error;
  }
}

async function getTasks() {
  try {
    const token = getToken(); 
    
    if (!token) {
      throw new Error("No hay token disponible");
    }
    
    const response = await fetch(`${backendUrl}/api/tasks`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error("No se pudieron cargar las tareas");
    }
    
    const data = await response.json();
    return data.task || data || [];
    
  } catch (error) {
    console.log("Error al cargar las tareas:", error);
    throw error;
  }
}

// Función asíncrona para eliminar una tarea
async function deleteTask(taskId) {
 
  try {
    // Obtén el token de autenticación (asumiendo que lo guardas en localStorage)
    const token = localStorage.getItem('token');
    
    // Realiza la petición DELETE
    const response = await fetch(`https://probable-zebra-5gx5qv9wg9wg349j5-3001.app.github.dev/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Error al eliminar la tarea');
    }
    
    // Procesa la respuesta exitosa
    const data = await response.json();
    
    // Muestra mensaje de éxito (opcional)
    alert('Tarea eliminada con éxito');
    
    return data;
  } catch (error) {
    // Maneja cualquier error
    console.error('Error al eliminar la tarea:', error);
    alert(`Error: ${error.message}`);
    throw error;
  }
};

