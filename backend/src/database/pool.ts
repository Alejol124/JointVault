import { Pool } from "pg";
import { appConfig } from "../config/env.js";
const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT } = appConfig;

const pool = new Pool({
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    host: PGHOST,
    port: PGPORT,

    //Optional settings for production
    max: 10, // Maximum number of clients in te pool
    idleTimeoutMillis: 30000, // Maximum time a client can be idle before being closed 
    connectionTimeoutMillis: 5000,  // Maximum time to wait for a connection before throwing an error
})

// Handler error for pool connections. This is important to avoid unhandled promise rejections and to log any unexpected errors that occur on idle clients.
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
})


export default pool;