import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosSub!: Subscription;
  ingresosEgresos: any[] = [];

  constructor(private store: Store<AppStateWithIngreso>, private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresosSub = this.store.select('ingresosEgresos')
      .subscribe( ({items}) => {
        this.ingresosEgresos = items;
      })
    }

    ngOnDestroy(): void {
      this.ingresosSub.unsubscribe();
    }

  borrar(ingresoEgreso: any){

    this.ingresoEgresoService.borrarIngresoEgreso(ingresoEgreso.uid)
      .then(() => Swal.fire('Borrado', 'Item borrado', 'success'))
      .catch( err =>  Swal.fire('Error', err.message, 'error'));
  }

}
