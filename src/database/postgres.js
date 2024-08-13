import pg from 'pg'
import {databaseConfig} from '../config/database.config.js'


const pool = new pg.Pool({
    user: databaseConfig.user,
    host: databaseConfig.host,
    database: databaseConfig.database,
    password: databaseConfig.password,
    port: databaseConfig.port
})

export async function fetchData(query, ...params) {
    const client = await pool.connect()
    try {
        const {rows} = await client.query(query, params?.length ? params : [])
        return rows
    } catch (error) {
        console.error(error)
    } finally {
        client.release()
    }
}