"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const pg_1 = require("pg");
const EmailRoutes_1 = __importDefault(require("./email/EmailRoutes.js"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const client = new pg_1.Client({
    user: 'new_user',
    host: 'localhost',
    database: 'emil-service',
    password: 'new_password',
    port: 5432,
});
client.connect((err) => {
    if (err) {
        console.error('connection error', err.stack);
    }
    else {
        console.log('connected');
    }
});
const jwtCheck = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: 'https://email-service/',
    issuerBaseURL: 'https://dev-c4pw18jpzniw8r8y.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});
app.use(jwtCheck);
app.use('/api', EmailRoutes_1.default);
app.get('/authorized', (req, res) => {
    res.send('Secured Resource');
});
app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
