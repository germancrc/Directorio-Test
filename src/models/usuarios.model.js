import pool from '../database/connection.js';

// Obtener todos los usuarios de una tabla dinámica
export const getUsuarios = async (codigoPropiedad) => {
    try {
        // Generar el nombre de la tabla dinámicamente
        const tableName = `usuarios_${codigoPropiedad}`;
        const query = `SELECT * FROM ${tableName}`;

        console.log("Consulta SQL:", query); // Depuración

        const [rows] = await pool.query(query);

        if (!rows.length) {
            console.log(`No se encontraron registros en la tabla ${tableName}.`);
        }

        return {
            // Excluir 'password' del encabezado
            headers: ["id_colab", "nombre", "username", "email", "propiedad", "role", "estado", "modified_at"],
            // Excluir 'password' del mapeo de datos
            usuariosConfig: rows.map(row => [
                row.id_colab != null ? row.id_colab.toString() : '',
                row.nombre || '',
                row.username || '',
                row.email || '',
                row.propiedad || '',
                row.role || '', 
                row.estado || '', 
                row.modified_at || ''
            ])
        };
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
};



// Crear un nuevo usuario
export const createUsuario = async (usuario) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO usuarios_hrpuj (id_colab, nombre, username, email, password, role, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [usuario.id_colab, usuario.nombre, usuario.username, usuario.email, usuario.password, usuario.role, usuario.modified_at || new Date()]
        );
        return result;
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        throw error;
    }
};

// Actualizar un usuario existente
export const updateUsuario = async (usuario) => {
    try {
        const [result] = await pool.query(
            'UPDATE usuarios_hrpuj SET nombre = ?, username = ?, email = ?, password = ?, role = ?, modified_at = ? WHERE id_colab = ?',
            [usuario.nombre, usuario.username, usuario.email, usuario.password, usuario.role, usuario.modified_at || new Date(), usuario.id_colab]
        );
        return result;
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        throw error;
    }
};

// Eliminar un usuario
export const deleteUsuario = async (id_colab) => {
    try {
        const [result] = await pool.query('DELETE FROM usuarios_hrpuj WHERE id_colab = ?', [id_colab]);
        return result;
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        throw error;
    }
};


//////////////////////////para el resumen

export const getTotalesUsuarios = async (codigoPropiedad) => {
    try {
      // Generar el nombre de la tabla dinámicamente
      const tableName = `usuarios_${codigoPropiedad}`;
  
      // Consulta total de usuarios
      const [totalUsuarios] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
      console.log("Total de Usuarios:", totalUsuarios);
  
      // Consulta total de usuarios activos
      const [totalUserActivos] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName} WHERE estado = 'activo'`);
      console.log("Total de Usuarios Activos:", totalUserActivos);
  
      // Consulta total de usuarios inactivos
      const [totalUserInactivos] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName} WHERE estado = 'inactivo'`);
      console.log("Total de Usuarios Inactivos:", totalUserInactivos);
  
      return {
        totalUsuarios: totalUsuarios[0].total,
        totalUserActivos: totalUserActivos[0].total,
        totalUserInactivos: totalUserInactivos[0].total,
      };
    } catch (error) {
      console.error("Error al obtener los totales de usuarios:", error.message);
      throw error;
    }
  };
  
