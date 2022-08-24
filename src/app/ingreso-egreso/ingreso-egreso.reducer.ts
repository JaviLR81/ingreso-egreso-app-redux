import { createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { setItems, unsetItems } from './ingreso-egreso.actions';

export interface State {
    items: IngresoEgreso[];
    // items: any[];
}

export interface AppStateWithIngreso extends AppState {
  ingresosEgresos: State
}

export const initialState: State = {
   items: [],
}

const _ingresoEgresoReducer = createReducer(initialState,
    on(setItems, (state, {items}) => ({ ...state, items: [...items]})),
    on(unsetItems, (state) => ({ ...state, items: []})),
);

export function ingresoEgresoReducer(state:any, action:any) {
    return _ingresoEgresoReducer(state, action);
}
