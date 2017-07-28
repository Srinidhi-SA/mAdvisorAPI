import { applyMiddleware, createStore } from "redux"

//import logger from "redux-logger"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"

import reducer from "./reducers"

//const middleware = applyMiddleware(promise(), thunk, logger())
const middleware = applyMiddleware(promise(), thunk)


const store= createStore(reducer, middleware)

store.subscribe(()=>{
  console.log("store updated", store.getState());
});

export default store;
