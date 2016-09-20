import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { connect, Provider } from 'react-redux'
import Rx from 'rxjs'
import { merge } from 'rxjs/observable/merge';
import { createEpicMiddleware, combineEpics } from 'redux-observable'
//import { Router, Route, Link, hashHistory } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'

console.clear();

// redux/modules/ping.js
const PING = 'PING';
const PONG = 'PONG';

const ping = () => ({ type: PING });

const pingEpic = action$ =>
  action$.ofType(PING)
    .delay(1000) // Asynchronously wait 1000ms then continue
    .mapTo({ type: PONG });

const pingReducer = (state = { isPinging: false }, action) => {
  switch (action.type) {
    case PING:
      return { isPinging: true };
    case PONG:
      return { isPinging: false };
    default:
      return state;
  }
};


// components/App.js
// ReactのView
// react-reduxのconnectを用意、isPingingとApp(View)をバインド
const pingApp = ({ isPinging, ping }) => (
  <div>
    <h1>is pinging: {isPinging.toString()}</h1>
    <RaisedButton label="PING" onClick={ping} />
  </div>
);

const PingApp = connect(
  ({ isPinging }) => ({ isPinging }),
  { ping }
)(pingApp);



////// counter

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

const incrementEpic = (action$, store) =>
  action$.ofType(INCREMENT)
    .map(increment)
    .mapTo({ type: ''}); // stop

const decrementEpic = (action$, store) =>
  action$.ofType(DECREMENT)
    .map(decrement)
    .mapTo({ type: ''}); // stop



const counterEpic = (action$, store) => merge(
  incrementEpic(action$, store),
  decrementEpic(action$, store)
);


const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + 1 };
    case DECREMENT:
      return { count: state.count - 1 };
    default:
      return state;
  }
};


// ReactのView
// react-reduxのconnectを用意、countとApp(View)をバインド
const counterApp = ({ count, decrement, increment }) => (
  <div>
    <h1>count: {count.toString()}</h1>
    <RaisedButton label="-" onClick={decrement} />
    <RaisedButton label="+" onClick={increment} />
  </div>
);

const CounterApp = connect(
  ({ count }) => ({ count }),
  { increment, decrement}
)(counterApp);




// redux/configureStore.js
// ReduxのStoreを用意
// redux-observableのcreateEpicMiddlewareでRxJSのobservableをapplyする
const pingEpicMiddleware = createEpicMiddleware(pingEpic);

const counterEpicMiddleware = createEpicMiddleware(counterEpic);


// Store
// see https://github.com/reactjs/redux/blob/master/docs/introduction/ThreePrinciples.md
const pingStore = createStore(pingReducer,
  applyMiddleware(pingEpicMiddleware)
);

const counterStore = createStore(counterReducer,
  applyMiddleware(counterEpicMiddleware)
);


// index.js
window.onload = () => {
  ReactDOM.render(
    <div>
      <MuiThemeProvider>
        <Provider store={pingStore}>
          <PingApp />
        </Provider>
      </MuiThemeProvider>
      <MuiThemeProvider>
        <Provider store={counterStore}>
          <CounterApp />
        </Provider>
      </MuiThemeProvider>
    </div>,
    document.getElementById('root')
  );
}


