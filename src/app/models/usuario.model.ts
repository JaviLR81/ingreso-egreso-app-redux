
export class Usuario {

  static fromFirebase({ email, uid, nombre }: any){
    return new Usuario(uid, nombre, email);
  }

  constructor(
    private uid: string,
    private nombre: string,
    private email: string,
  ){
  }
}
