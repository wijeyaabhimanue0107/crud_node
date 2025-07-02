// const Pool = require("pg").Pool;
import {Pool} from 'pg';
export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'node-crud',
    password: '11223344',
    port: 5432
});
