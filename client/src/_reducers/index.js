// 하나의 리듀서만 사용해야 하기에
import { combineReducers } from 'redux';
import user from './user_reducer';

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
