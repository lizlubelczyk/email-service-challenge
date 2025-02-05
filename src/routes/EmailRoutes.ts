import { Router, Request, Response } from 'express';
import emailController from "../controllers/EmailController";
import {auth} from "express-oauth2-jwt-bearer";

const router = Router();

const jwtCheck = auth({
    audience: 'https://email-service/',
    issuerBaseURL: 'https://dev-c4pw18jpzniw8r8y.us.auth0.com/',
    tokenSigningAlg: 'RS256'
})

router.get('/hello', jwtCheck, (req: Request, res: Response) => {
    res.json({ message: 'Hello, !' });
});

router.post('/send', jwtCheck, (req: Request, res: Response) => {
    emailController.sendEmail(req, res).then(r => r);
})

export default router;
