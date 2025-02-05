import {Router} from "express";
import authController from "../controllers/AuthController";

const router = Router();

router.get('/hello', (req, res) => {
    res.json({message: 'Hello, world!'});
});

router.post('/login', (req, res) => {
    authController.login(req, res).then((r: any) => r);
})

router.post('/register', (req, res) => {
    authController.register(req, res).then((r: any) => r);
})
export default router;