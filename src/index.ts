import express, { Request, Response } from 'express';
import EmailRoutes from "./routes/EmailRoutes";
import {auth} from "express-oauth2-jwt-bearer";

const app = express();
import pkg from 'pg';
const { Client } = pkg;

app.use('/api/mail', EmailRoutes);


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

const jwtCheck = auth({
    audience: 'https://email-service/',
    issuerBaseURL: 'https://dev-c4pw18jpzniw8r8y.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

app.use(jwtCheck);
app.get('/authorized', (req: Request, res: Response) => {
    res.send('Secured Resource');
});

export default app;
