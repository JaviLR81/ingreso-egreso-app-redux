import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required]],
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  loginUsuario(){
    if(this.loginForm.invalid) return;

    Swal.fire({
      title: 'Auto close alert!',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .then( resp => {
        console.log("~ resp", resp)
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch(err => {
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
