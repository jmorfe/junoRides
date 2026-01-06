
import store from '../store';
import types from '../types';
const { dispatch } = store;


export function setVisiblityOfTabBar(data = true) {
    dispatch({
        type: types.SET_TAB_BAR_VISIBLITY,
        payload: data,
    });
}