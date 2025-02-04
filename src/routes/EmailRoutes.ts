import { Router, Request, Response } from 'express';
import emailController from "../controllers/EmailController";

const router = Router();

router.get('/hello', (req: Request, res: Response) => {
    res.json({ message: 'Hello, !' });
});

router.post('/send', (req: Request, res: Response) => {
    emailController.sendEmail(req, res).then(r => r);
})

export default router;
