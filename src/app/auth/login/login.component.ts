import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

import * as ui from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  uiSubscription!: Subscription;

  loginForm: FormGroup = this.fb.group({
    'email': ['javi@gmail.com', [Validators.required, Validators.email]],
    'password': ['123456', [Validators.required]],
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui')
      .subscribe(ui => {
        this.loading = ui.isLoading
      })
  }

  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }

  loginUsuario(){
    if(this.loginForm.invalid) return;

    this.store.dispatch( ui.isLoading() );

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .then( resp => {

        this.store.dispatch( ui.stopLoading() );

        this.router.navigate(['/']);
      })
      .catch(err => {

        this.store.dispatch( ui.stopLoading() );

        console.log("error en el logueo")
        console.log("~ err", err)

        Swal.fire(
          'Oops',
          err.message,
          'error'
        )

      })

  }

}
