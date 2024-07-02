import { CustomError, UserEntity } from "../../domain";



export class UserMapper {

    static userEntityFromObject(object:{[key:string]:any}){

        const {id,_id, name,email,password,roles=[]} = object;

        if(!_id || !id){
            throw CustomError.badRequest("Mising id");
        }

        if(!name)throw CustomError.badRequest("Mising name");
        if(!email)throw CustomError.badRequest("Mising email");
        if(!password)throw CustomError.badRequest("Mising password");
        if(!roles)throw CustomError.badRequest("Mising roles");
        
        return new UserEntity(
            _id || id,
            name,
            email,
            password,
            roles
        );
    }




}