import { Request,Response } from "express"



export class AuthController {

    //DI
    constructor(){}

    /**!! las buenas practicas de express dicen que es mejor no usar un async en los controladores */
    registerUser = (req:Request, res:Response)=>{
        res.json("Register user Controler")
    }


    loginUser = (req:Request, res:Response)=>{
        res.json("Login user Controler")
    }

}