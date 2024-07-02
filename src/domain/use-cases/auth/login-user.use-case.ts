import { CustomError } from "../..";
import { JwtAdapter } from "../../../config";
import { LoginUserDto } from "../../dtos/auth/login-user.dto";
import { AuthRepository } from "../../repositories/auth.repository";



interface UserToken {
    token: string;
    user:{
        id:string,
        name:string,
        email:string
    }
}

type SignToken = (payload: Object, duration?: string)=> Promise<string | null>

interface LoginUserUseCase {
    execute( loginUserDto: LoginUserDto): Promise<any>
}

export class LoginUser implements LoginUserUseCase{

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken:SignToken = JwtAdapter.generateToken
    ){}


    async execute(loginUserDto: LoginUserDto): Promise<any> {
        
        const user = await this.authRepository.login(loginUserDto);

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