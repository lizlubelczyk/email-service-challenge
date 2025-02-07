import express, { Request, Response } from 'express';
import EmailRoutes from "./routes/EmailRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import {auth} from "express-oauth2-jwt-bearer";

const app = express();
import pkg from 'pg';
import StatsRoutes from "./routes/StatsRoutes";
const { Client } = pkg;

app.use(express.json());
app.use('/api/mail', EmailRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/stats', StatsRoutes);


const client = new Client({
    user: 'new_user',
    host: 'localhost',
    database: 'emil-service',
    password: 'new_password',
    port: 5432,
});

client.connect((err: Error) => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected');
        client.query('SELECT NOW()', (err, res) => {
            if (err) {
                console.error('Error executing query', err.stack);
            } else {
                console.log('Connection is working:', res.rows[0]);
            }
        });
    }
});


export default app;
