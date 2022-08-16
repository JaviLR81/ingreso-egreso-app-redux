import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup = this.fb.group({
      'nombre'  : ['', Validators.required],
      'correo'  : ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  crearUsuario(){
    if(this.registroForm.invalid) return;

    Swal.fire({
      title: 'Auto close alert!',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    const { nombre, correo, password } = this.registroForm.value;

    this.authService.crearUsuario(nombre, correo, password)
      .then( credenciales => {
        console.log('credenciales', credenciales);
        Swal.close();
        this.router.navigateByUrl('/');
      })
      .catch( err => {
        console.log("~ err", err)

        Swal.fire(
          'Oops',
          err.message,
          'error'
        )

      })
  }

}
