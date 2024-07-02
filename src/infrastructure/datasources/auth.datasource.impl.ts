// SE PUEDE NOMBRAR EL ARCHIVO SEGUN LA FUENTE DE INFORMACIÓN 
// ORACLE.AUTH.DATASOURCE - MONGO.AUTH.DATASOURCE

import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDataSource, CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { UserMapper } from "../mappers/user.mapper";


type HashFunction = (password: string)=> string;
type CompareFunction = (password: string, hashed:string )=> boolean;

//DATA SOURCE QUE APUNTA A MONGO
export class AuthDataSourceImpl implements AuthDataSource {

    constructor(
        private readonly hashPassword: HashFunction=BcryptAdapter.hash,
        private readonly comparePassword: CompareFunction=BcryptAdapter.compare
    ){}


    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const {email,password} = loginUserDto;

        try {
            const exist = await UserModel.findOne({email:email});
            if(!exist) throw CustomError.badRequest("Invalid Crendetilas");

            //verificar si la contraseña es la misma 
            const isMatching = this.comparePassword(password,exist.password)
            if(!isMatching)throw CustomError.badRequest("Invalid Crendetilas"); 

            return UserMapper.userEntityFromObject(exist);

        } catch (error) {
            if(error instanceof CustomError){
                throw error;
            }
            throw CustomError.internalServer();
        }
    }

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const {name,email,password} = registerUserDto;

        try {
            //1. verificar si el correo existe
            const exist = await UserModel.findOne({ email: email});
            if( exist ) throw CustomError.badRequest('Invalid Credentials');

            const user = await UserModel.create({
                name,
                email,
                password: this.hashPassword( password )
            });

            await user.save();

            //3. Mapear la respuesta a nuestra entidad
            return UserMapper.userEntityFromObject(user);

        } catch (error) {
            if(error instanceof CustomError){
                throw error;
            }
            throw CustomError.internalServer();
        }
    }

}