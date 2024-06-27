import { Router } from "express";
import { AuthRoutes } from "./auth/auth.routes";



export class AppRoutes{

    static get routes() : Router{
        const router = Router(); 

        //DEFINIR TODAS MIS RUTAS PRINCIPALES

        router.use('/api/auth', AuthRoutes.routes);
        //examples
        //router.use('api/user');

        return router;
    }

}