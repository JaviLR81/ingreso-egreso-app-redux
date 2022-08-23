import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  uiSubscription!: Subscription;
  registroForm: FormGroup = this.fb.group({
      'nombre'  : ['someName', Validators.required],
      'correo'  : ["email"+Math.random().toPrecision(2)+"@gmail.com", [Validators.required, Validators.email]],
      'password': ['123456', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui')
      .subscribe( ({isLoading}) => this.loading = isLoading  )
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    if(this.registroForm.invalid) return;

    this.store.dispatch( ui.isLoading() )

    const { nombre, correo, password } = this.registroForm.value;

    this.authService.crearUsuario(nombre, correo, password)
      .then( credenciales => {

        this.store.dispatch( ui.stopLoading() )

        console.log('credenciales', credenciales);
        this.router.navigateByUrl('/');
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading() )

        console.log("~ err", err)

        Swal.fire(
          'Oops',
          err.message,
          'error'
        )

      })
  }

}
