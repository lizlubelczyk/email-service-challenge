import { Router, Request, Response } from 'express';
import emailController from "./EmailController";
import {auth} from "express-oauth2-jwt-bearer";
import swaggerJSDoc from "swagger-jsdoc";

const router = Router();

/**
 * @swagger
 * /api/mail/send:
 *   post:
 *     summary: Send an email
 *     description: Sends an email to the specified recipient.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - body
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 description: Recipient's email address
 *                 example: "recipient@example.com"
 *               subject:
 *                 type: string
 *                 description: Subject of the email
 *                 example: "Subject of the email"
 *               body:
 *                 type: string
 *                 description: Body content of the email
 *                 example: "Body of the email"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       429:
 *         description: Too many requests (email limit reached)
 *       500:
 *         description: Internal server error
 */


const jwtCheck = auth({
    audience: 'https://email-service/',
    issuerBaseURL: 'https://dev-c4pw18jpzniw8r8y.us.auth0.com/',
    tokenSigningAlg: 'RS256'
})

router.post('/send', jwtCheck, (req: Request, res: Response) => {
    emailController.sendEmail(req, res).then(r => r);
})

export default router;
