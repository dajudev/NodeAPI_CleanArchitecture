import { Validators } from "../../../config/validators";


export class LoginUserDto{

    private constructor(
        public email: string,
        public password: string,
    ){}


    /**
     * Funcion encargada de verificar el objeto usuario y logearlo
     * @param object 
     * @returns 
     */
    static create(object: {[key: string] : any}) : [string?, LoginUserDto?]{

        const {email , password} = object;
        if(!email) return ['Missing email', undefined];
        if(!Validators.email.test(email)) return ['Email invalid', undefined];
        if(!password) return ['Missing password', undefined];
        
        return [undefined,new LoginUserDto(email,password)];
    }


}