import {Router, Request, Response} from "express";
import {auth} from "express-oauth2-jwt-bearer";
import statsController from "./StatsController";

const router = Router();

const jwtCheck = auth({
    audience: process.env.AUTH0_API_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER,
    tokenSigningAlg: 'RS256'
})

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Retrieve system statistics
 *     description: Fetches various system statistics. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usersCount:
 *                   type: integer
 *                   description: Total number of registered users
 *                   example: 1200
 *                 activeUsers:
 *                   type: integer
 *                   description: Number of currently active users
 *                   example: 350
 *       403:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */


router.get('',jwtCheck, (req: Request, res: Response) => {
    statsController.getStats(req, res).then(r => r);
});

export default router;