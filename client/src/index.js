import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom';
import {Map} from 'immutable';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import './index.css';
import {createStore} from "redux";
import {
    Models as PlannerModels,
    reducer as PlannerReducer,
} from 'react-planner'; //react-planner

const Planner = lazy(() => import('../src/pages/planner'));
const FourOFour = lazy(() => import('../src/pages/FourOFour'));

//define state
let AppState = Map({
    'react-planner': new PlannerModels.State()
});

//define reducer
let reducer = (state, action) => {
    state = state || AppState;
    state = state.update('react-planner', plannerState => PlannerReducer(plannerState, action));
    return state;
};

//init store
let store = createStore(
    reducer,
    null,
    window.devToolsExtension ?
        window.devToolsExtension({
            features: {
                pause: true,     // start/pause recording of dispatched actions
                lock: true,     // lock/unlock dispatching actions and side effects
                persist: true,     // persist states on page reloading
                export: true,     // export history of actions in a file
                import: 'custom', // import history of actions from a file
                jump: true,     // jump back and forth (time travelling)
                skip: true,     // skip (cancel) actions
                reorder: true,     // drag and drop actions in the history list
                dispatch: true,     // dispatch custom actions or action creators
                test: true      // generate tests for the selected actions
            },
            maxAge: 999999
        }) :
        f => f
);
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Suspense fallback={<div className="spinner-border"/>}>
                <Routes>
                    {/* home path */}
                    <Route exact path='/' element={<Planner/>}/>
                    {/* Unknown path */}
                    <Route path="*" element={<FourOFour/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
reportWebVitals();

