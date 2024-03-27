import axios from 'axios';

import {
    SCHOOL_LOGIN_USER,
    SCHOOL_LOGIN_USER_SUCCESS,
    SCHOOL_LOGIN_USER_ERROR,
    GET_SCHOOL_BY_ID
} from '../../../redux/actions.js';
import { URL, KEY } from '../../../constants/defaultValues.js';
import {
    setCurrentUser,
    getNormalHeaders,
    openNotificationWithIcon
} from '../../../helpers/Utils.js';
import { encryptGlobal } from '../../../constants/encryptDecrypt.js';
export const schoolLoginUserSuccess = (user) => async (dispatch) => {
    dispatch({
        type: SCHOOL_LOGIN_USER_SUCCESS,
        payload: user
    });
};
export const schoolLoginUserError = (message) => async (dispatch) => {
    dispatch({
        type: SCHOOL_LOGIN_USER_ERROR,
        payload: { message }
    });
};
export const getSchoolByIdSuccess = (user) => async (dispatch) => {
    dispatch({
        type: GET_SCHOOL_BY_ID,
        payload: user
    });
};
export const schoolLoginUser = (data, history, module) => async (dispatch) => {
    try {
        const loginData = {
            ...data
        };
        dispatch({ type: SCHOOL_LOGIN_USER });
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);

        const result = await axios
            .post(`${URL.schoolLogin}`, loginData, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const item = result.data;
            setCurrentUser(item);
            localStorage.setItem('module', module);
            localStorage.setItem('time', new Date().toString());

            dispatch(schoolLoginUserSuccess(result));
            history.push('/institution/dashboard');
        } else {
            if (result && result.status === 403) {
                openNotificationWithIcon(
                    'error',
                    'User is ditected as inactive'
                );
            } else {
                openNotificationWithIcon(
                    'error',
                    'Invalid Username or Password'
                );
            }
        }
    } catch (error) {
        console.log(error);
        dispatch(schoolLoginUserError({}));
    }
};
export const getSchoolByID = (id) => async (dispatch) => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const schId = encryptGlobal(JSON.stringify(id));
        const result = await axios
            .get(`${URL.getSchoolById}${schId}`, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const item = result.data.data[0];
            // console.log(item);
            dispatch(getSchoolByIdSuccess(item));
        } else {
            openNotificationWithIcon('error', 'Something went wrong');
        }
    } catch (error) {
        dispatch(getSchoolByIdSuccess(''));
    }
};
export const schoolLoginUserLogOut = (history) => async () => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .get(`${URL.schoolLogOut}`, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            setCurrentUser();
            // localStorage.removeItem('headerOption');
            history.push('/institution');
        }
    } catch (error) {
        console.log('error');
    }
};
