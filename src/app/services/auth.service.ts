import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubs!: Subscription;
  private _user!: Usuario;

  get user(){
    return this._user;
  }

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {

  }

  initAuthListener(){
    this.auth.authState
      .subscribe( fuser => {

        // console.log("~ fuser uid", fuser?.uid)

        if(fuser){

          this.userSubs = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
            .subscribe( firestoreUser => {

              // console.log(firestoreUser)
              const user = Usuario.fromFirebase(firestoreUser);
              this._user = user;

              this.store.dispatch( authActions.setUser({ user: user }) );
            })
        } else {
          // no existe
          // llamar unset del user
          this._user = null as any;

          if(this.userSubs != null){
            this.userSubs.unsubscribe();
          }

          this.store.dispatch( authActions.unsetUser() );
          this.store.dispatch( ingresoEgresoActions.unsetItems() );
        }


      })
  }

  crearUsuario(nombre: string, email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password)
    .then( ({user}) => {
      const newUser = new Usuario(user?.uid!, nombre, user?.email!);
      return this.firestore.doc(`${user?.uid}/usuario`).set({...newUser});
    })
  }

  login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState
      .pipe(
        map( fuser => fuser !== null )
      );
  }

}
