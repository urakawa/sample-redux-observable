import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { connect, Provider } from 'react-redux'
import Rx from 'rxjs'
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

// redux/configureStore.js
// ReduxのStoreを用意
// redux-observableのcreateEpicMiddlewareでRxJSのobservableをapplyする
const pingEpicMiddleware = createEpicMiddleware(pingEpic);


// Store
// storeはひとつだけにしておくのがよいらしい
// see https://github.com/reactjs/redux/blob/master/docs/introduction/ThreePrinciples.md
const store = createStore(pingReducer,
  applyMiddleware(pingEpicMiddleware)
);

// index.js
window.onload = () => {
  ReactDOM.render(
    <MuiThemeProvider>
      <Provider store={store}>
        <PingApp />
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
  );
}


