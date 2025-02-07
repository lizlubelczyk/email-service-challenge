import {Router, Request, Response} from "express";
import {auth} from "express-oauth2-jwt-bearer";
import statsController from "../controllers/StatsController";

const router = Router();

const jwtCheck = auth({
    audience: process.env.AUTH0_API_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER,
    tokenSigningAlg: 'RS256'
})

router.get('', jwtCheck, (req: Request, res: Response) => {
    statsController.getStats(req, res).then(r => r);
});

export default router;