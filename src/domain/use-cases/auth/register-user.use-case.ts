import { JwtAdapter } from "../../../config";
import { RegisterUserDto } from "../../dtos/auth/register-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";

interface RegisterUserUseCase {
    execute( RegisterUserDto: RegisterUserDto): Promise<any>
}

interface UserToken {
    token: string;
    user:{
        id:string,
        name:string,
        email:string
    }
}

type SignToken = (payload: Object, duration?: string)=> Promise<string | null>

export class RegisterUser implements RegisterUserUseCase{

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken:SignToken = JwtAdapter.generateToken
    ){}
    
    async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
        //Crear el usuario
        const user = await this.authRepository.register(registerUserDto);
        //Token
        const token = await this.signToken({id:user.id}, '1d')
        if(!token) throw CustomError.internalServer("Error Token");

        return {
            token: token,
            user:{
                id: user.id,
                name:user.name,
                email: user.email
            }
        }
    }
    
}