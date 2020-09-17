import {createStore} from "redux";
import {Reducer, initialState} from "./reducers";

export const ConfigureStore = () => {
    const store = createStore(
        Reducer,
        initialState
    );
    return store;
}