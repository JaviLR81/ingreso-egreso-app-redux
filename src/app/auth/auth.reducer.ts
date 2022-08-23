import { Action, createReducer, on } from '@ngrx/store';
import { setUser, unsetUser } from './auth.actions';

import { Usuario } from '../models/usuario.model';

export interface State {
    user: Usuario;
}

export const initialState: State = {
   user: null as any,
}

export const authReducer = createReducer<State, Action>(initialState,
    on(setUser,   (state, {user}) => ({ ...state, user: {...user} as any})),
    on(unsetUser, (state)         => ({ ...state, user: null as any})),
);
