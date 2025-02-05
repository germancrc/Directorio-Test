import pool from './connection.js'; // Ajusta la ruta si es necesario

const testQuery = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        console.log('Resultados de la consulta:');
        console.table(rows); // Muestra los resultados en formato tabla
    } catch (error) {
        console.error('Error al realizar la consulta:', error.message);
    } finally {
        await pool.end(); // Cierra la conexión al finalizar
    }
};

testQuery();
