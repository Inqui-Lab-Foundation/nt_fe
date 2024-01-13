/* eslint-disable indent */
import {
    SCHOOL_LOGIN_USER,
    SCHOOL_LOGIN_USER_SUCCESS,
    SCHOOL_LOGIN_USER_ERROR,
    GET_SCHOOL_BY_ID
} from '../../../redux/actions.js';
const INIT_STATE = {
    currentUser: {},
    loading: false,
    error: '',
    school: ''
};
export default (state = INIT_STATE, action) => {
    const newState = { ...state };
    switch (action.type) {
        case SCHOOL_LOGIN_USER:
            return { ...state, loading: true, error: '' };
        case SCHOOL_LOGIN_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                currentUser: action.payload,
                error: ''
            };
        case SCHOOL_LOGIN_USER_ERROR:
            return {
                ...state,
                loading: false,
                currentUser: null,
                error: action.payload.message
            };
        case GET_SCHOOL_BY_ID:
            return {
                ...state,
                school: action.payload
            };
        default:
            return newState;
    }
};
