import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import iDB from "idb-instance"
import keyMirror from 'keymirror'

const consts = keyMirror({
  'SET': null,
  'RESET': null
});

const initialState = {};

function CachedPropertyStore(state = initialState, action) {
  switch (action.type) {
    case consts.SET:
      if (state[action.name] !== action.value) {
        let a = {};
        a[action.name] = action.value;
        return Object.assign({}, state, a);
      }
      return state;
    case consts.RESET:
      return initialState;
    default:
      return state;
  }
}

function dbSet(name, value) {
  return iDB.setCachedProperty(name, value);
}

function storeSet(name, value) {
  return {type: consts.SET, name, value}
}

function setThroughDB(name, value) {
  return function (dispatch) {
    return dbSet(name, value).then(
      () => dispatch(storeSet(name, value)));
  };
}

const setAction = (name, value) => {
  appStore.dispatch(setThroughDB(name, value))
};

const appStore = createStore(CachedPropertyStore, applyMiddleware(thunk));
export default appStore;

// Now we are able to launch actions like -
// appStore.dispatch(setThroughDB("backup_recommended", true)) || setAction("backup_recommended", true)
// 
//




