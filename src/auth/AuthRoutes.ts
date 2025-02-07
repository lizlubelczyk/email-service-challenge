import {Router} from "express";
import authController from "./AuthController";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post('/login', (req, res) => {
    authController.login(req, res).then((r: any) => r);
})

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/register', (req, res) => {
    authController.register(req, res).then((r: any) => r);
})
export default router;