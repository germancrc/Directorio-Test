import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

// Obtener las variables de entorno
const hostname = process.env.DB_HOST;
const database = process.env.DB_NAME;
const port = process.env.DB_PORT;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

// Crear el pool de conexiones
const pool = mysql.createPool({
  host: hostname,
  user: username,
  password: password,
  database: database,
  port: port,
});

// Probar la conexión
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the database!');
    connection.release(); // Liberar la conexión
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();

// Exportar el pool para usarlo en otros archivos
export default pool;