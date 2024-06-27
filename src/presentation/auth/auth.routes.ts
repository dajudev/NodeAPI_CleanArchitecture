import { Router } from "express";
import { AuthController } from "./controller";


export class AuthRoutes{

    static get routes() : Router{
        
        const router = Router(); 
        const controller = new AuthController();

        router.post('/login', controller.loginUser);
        router.post('/signup', controller.registerUser);
        

        return router;
    }

}