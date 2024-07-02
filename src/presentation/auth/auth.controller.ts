import { Request,Response } from "express"
import { AuthRepository, CustomError, LoginUser, LoginUserDto, RegisterUser, RegisterUserDto } from "../../domain"
import { UserModel } from "../../data/mongodb";


export class AuthController {

    //DI
    constructor(
        private readonly authRepository: AuthRepository, 
    ){}

    private handleError = (error:unknown, res:Response)=>{
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error:error.message});
        }else{
            console.log(error);
            return res.status(500).json({error: 'Internal Server Error'});
        }
    }

    /**!! las buenas practicas de express dicen que es mejor no usar un async en los controladores */
    registerUser = (req:Request, res:Response)=>{
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if(error)return res.status(400).json({error});

        new RegisterUser(this.authRepository).execute(registerUserDto!)
        .then(data => res.json(data))
        .catch(err => this.handleError(err,res))
    }


    loginUser = (req:Request, res:Response)=>{
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if(error)return res.status(400).json({error});

        new LoginUser(this.authRepository).execute(loginUserDto!)
        .then(data => res.json(data))
        .catch(err => this.handleError(err,res))
    }

    getUsers = (req:Request, res:Response)=>{
        UserModel.find()
        .then(users=>{
            res.json({
                users,
                //user: req.body.user
            });
            
        })
        .catch(()=>res.status(500).json({error: "Internal server error"}));
    }

}