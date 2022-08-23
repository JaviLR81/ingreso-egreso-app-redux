import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  cargando: boolean = false;
  loadingSubs!: Subscription;
  tipo: string = 'ingreso';

  ingresoEgresoForm: FormGroup = this.fb.group({
    descripcion: ['', Validators.required],
    monto:       ['', Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.loadingSubs = this.store.select('ui')
      .subscribe( ({isLoading}) => this.cargando = isLoading)
  }

  ngOnDestroy(){
    this.loadingSubs.unsubscribe();
  }

  guardar(){

    this.store.dispatch( ui.isLoading() );

    if(this.ingresoEgresoForm.invalid) return;

    const { descripcion, monto } = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo );
    console.log("~ ingresoEgreso to send", ingresoEgreso)

    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
      .then( (ref) => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire('Registro creado', descripcion, 'success');
        console.log('exito!', ref)
        this.ingresoEgresoForm.reset();
      })
      .catch( (err) => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire('Error', err.message, 'error');
        console.warn(err)
      });
  }

}
