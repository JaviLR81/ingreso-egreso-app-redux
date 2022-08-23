import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string = '';
  nombreSubs!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {

    this.nombreSubs = this.store.select('user')
    .pipe(
      filter( user => user.user != null)
    )
      .subscribe( ({user}) => {
        this.nombre = user.nombre;
      })
  }

  ngOnDestroy(): void {
    this.nombreSubs.unsubscribe();
  }

  logout(){
    this.authService.logout()
      .then( resp => {
        this.router.navigateByUrl('/login');
      });
  }

}
