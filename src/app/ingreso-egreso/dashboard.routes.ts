import { Routes } from "@angular/router";
import { DetalleComponent } from "./detalle/detalle.component";
import { EstadisticaComponent } from "./estadistica/estadistica.component";
import { IngresoEgresoComponent } from "./ingreso-egreso.component";


export const dashboardRoutes: Routes = [
  {
    path: '',
    component: EstadisticaComponent
  },
  {
    path: 'ingreso-egreso',
    component: IngresoEgresoComponent
  },
  {
    path: 'detalle',
    component: DetalleComponent
  },
];
