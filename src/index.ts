import express, { Request, Response } from 'express';
import EmailRoutes from "./email/EmailRoutes";
import AuthRoutes from "./auth/AuthRoutes";

const app = express();
import pkg from 'pg';
import StatsRoutes from "./stats/StatsRoutes";
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
