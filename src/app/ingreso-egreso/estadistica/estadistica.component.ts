import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';

import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.css']
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ingresosEgresosSubs!: Subscription;

  ingresos: number = 0;
  egresos: number = 0;

  totalEgresos : number = 0;
  totalIngresos: number = 0;

  // Doughnut
  public doughnutChartLabels: string[] = [ 'Ingresos', 'Egresos' ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: []
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
   this.ingresosEgresosSubs =  this.store.select('ingresosEgresos')
    .subscribe(({items}) => {
      this.generarEstadistica(items)
    })
  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubs.unsubscribe();
  }

  generarEstadistica(items: IngresoEgreso[]){

    this.totalIngresos = 0;
    this.totalEgresos  = 0;
    this.ingresos      = 0;
    this.egresos       = 0;

    this.totalIngresos = items
                        .filter( item => item.tipo === 'ingreso' )
                        .reduce( (acumulador, number) => {
                          this.ingresos++;
                          return acumulador + number.monto
                        }, 0)

    console.log("~ ingresos", this.ingresos)
    console.log("~ totalIngresos", this.totalIngresos)

    this.totalEgresos = items
                  .filter( item => item.tipo === 'egreso' )
                  .reduce( (acumulador, number) => {
                    this.egresos++;
                    return acumulador + number.monto
                  }, 0)

    console.log("~ egresos", this.egresos)
    console.log("~ totalEgresos", this.totalEgresos)

    this.doughnutChartData =  {
                          labels: this.doughnutChartLabels,
                          datasets: [{ data: [this.totalIngresos, this.totalEgresos] } ]
                        };


  }

}
