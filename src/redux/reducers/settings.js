import types from '../types';

const initial_state = {
    isTabBarVisible: true,

};

export default function (state = initial_state, action) {
    switch (action.type) {
        case types.SET_TAB_BAR_VISIBLITY: {
            const data = action.payload;
            return {
                ...state,
                isTabBarVisible: data,
            };
        }


        default: {
            return { ...state };
        }
    }
}
