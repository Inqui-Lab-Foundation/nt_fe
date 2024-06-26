/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Label } from 'reactstrap';
import axios from 'axios';
import '../Student/Pages/SignUp.scss';
import { InputBox } from '../stories/InputBox/InputBox';
import CryptoJS from 'crypto-js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getCurrentUser, openNotificationWithIcon } from '../helpers/Utils';
import { useTranslation } from 'react-i18next';
import 'sweetalert2/src/sweetalert2.scss';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

const ChangePSWModal = (props) => {
    // here we can change the password //
    const currentUser = getCurrentUser('current_user');
    const { t } = useTranslation();
    const [error, SetError] = useState('');
    const [responce, SetResponce] = useState('');
    const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        },

        validationSchema: Yup.object({
            oldPassword: Yup.string().required(t('login.error_required')),
            newPassword: Yup.string()
                .required(t('login.error_required'))
                .matches(
                    passwordRegex,
                    'Password must contains minimum 8 characters, including one letter, one number, and one special character.'
                ),
            confirmPassword: Yup.string()
                .required(t('login.error_required'))
                .matches(
                    passwordRegex,
                    'Password must contains minimum 8 characters, including one letter, one number, and one special character.'
                )
        }),

        onSubmit: async (values) => {
            if (values.newPassword.length < 8) {
                SetError(
                    <span style={{ color: 'red' }}>
                        New Password must be 8-character minimum
                    </span>
                );
            } else if (values.oldPassword === values.newPassword) {
                SetError(
                    <span style={{ color: 'red' }}>
                        Old Password and New Password are same
                    </span>
                );
            } else if (values.newPassword !== values.confirmPassword) {
                SetError(
                    <span style={{ color: 'red' }}>
                        New Password and Confirm Password not same
                    </span>
                );
            } else {
                const key = CryptoJS.enc.Hex.parse(
                    '253D3FB468A0E24677C28A624BE0F939'
                );
                const iv = CryptoJS.enc.Hex.parse(
                    '00000000000000000000000000000000'
                );
                const old1 = CryptoJS.AES.encrypt(values.oldPassword, key, {
                    iv: iv,
                    padding: CryptoJS.pad.NoPadding
                }).toString();
                const new1 = CryptoJS.AES.encrypt(values.newPassword, key, {
                    iv: iv,
                    padding: CryptoJS.pad.NoPadding
                }).toString();

                const body = JSON.stringify({
                    user_id: JSON.stringify(currentUser?.data[0]?.user_id),
                    old_password: old1,
                    new_password: new1
                });

                var config = {
                    method: 'put',
                    url:
                        process.env.REACT_APP_API_BASE_URL +
                        '/admins/changePassword',
                    headers: {
                        'Content-Type': 'application/json',

                        Authorization: `Bearer ${currentUser?.data[0]?.token}`
                    },
                    data: body
                };
                axios(config)
                    .then(function (response) {
                        if (response.status === 202) {
                            SetResponce(response.data.message);
                            setTimeout(() => {
                                props.btnSubmit();
                            }, 1000);
                        }
                    })
                    .catch(function (error) {
                        openNotificationWithIcon(
                            'error',
                            'Enter the correct current password'
                        );
                        console.log(error);
                    });
            }
        }
    });
    useEffect(() => {
        SetError('');
    }, [formik.values]);
    //----password fields initial state and hide show password
    const [oldPassType, setOldPassType] = useState('password');
    const [newPassType, setNewPassType] = useState('password');
    const [confirmPassType, setConfirmPassType] = useState('password');
    const oldPassword = {
        type: oldPassType,
        placeholder: t('changepswd.Enter_current_password_here'),
        className: 'defaultInput'
    };

    const newPassword = {
        type: newPassType,
        placeholder: t('changepswd.Create_new_password_here'),
        className: 'defaultInput'
    };

    const confirmPassword = {
        type: confirmPassType,
        placeholder: t('changepswd.Verify_New_password'),
        className: 'defaultInput'
    };
    const handleShowPassword = (name) => {
        // here name = password //
        // here we can see the password //
        switch (name) {
            case oldPassword:
                name?.type === 'password'
                    ? setOldPassType('text')
                    : setOldPassType('password');
                break;
            case newPassword:
                name?.type === 'password'
                    ? setNewPassType('text')
                    : setNewPassType('password');
                break;
            case confirmPassword:
                name?.type === 'password'
                    ? setConfirmPassType('text')
                    : setConfirmPassType('password');
                break;
        }
    };
    return (
        <React.Fragment>
            <div className="container-fluid ChangePSWModal">
                <Row className="mt-5">
                    <Col md={12}>
                        <h5>{t('changepswd.Change your password')}</h5>
                        <p>
                            {t(
                                'changepswd.password_helps_prevent_unauthorized'
                            )}
                        </p>
                    </Col>
                    <Col md={12}>
                        <Form onSubmit={formik.handleSubmit}>
                            <div className="form-row row mb-5 mt-3">
                                <Col
                                    className="form-group position-relative"
                                    md={12}
                                >
                                    <Label className="mb-2" htmlFor="Password">
                                        {t('changepswd.Current_password')}
                                    </Label>
                                    <InputBox
                                        {...oldPassword}
                                        id="oldPassword"
                                        name="oldPassword"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.oldPassword}
                                    />
                                    <div
                                        className="pointer position-absolute top-50 end-0 me-4 mt-1"
                                        onClick={() => {
                                            handleShowPassword(oldPassword);
                                        }}
                                    >
                                        {oldPassword?.type === 'password' ? (
                                            <FaEyeSlash size={18} />
                                        ) : (
                                            <FaEye size={18} />
                                        )}
                                    </div>

                                    {formik.touched.oldPassword &&
                                    formik.errors.oldPassword ? (
                                        <small className="error-cls">
                                            {formik.errors.oldPassword}
                                        </small>
                                    ) : null}
                                </Col>
                            </div>
                            <div className="w-100 clearfix " />

                            <div className="form-row row  mb-5">
                                <Col
                                    className="form-group position-relative"
                                    md={12}
                                >
                                    <Label
                                        className="mb-2"
                                        htmlFor="newPassword"
                                    >
                                        {t('changepswd.New_password')}
                                    </Label>
                                    <InputBox
                                        {...newPassword}
                                        id="newPassword"
                                        name="newPassword"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.newPassword}
                                    />
                                    <div
                                        className="pointer position-absolute end-0 me-4"
                                        style={{ bottom: '4rem' }}
                                        onClick={() => {
                                            handleShowPassword(newPassword);
                                        }}
                                    >
                                        {newPassword?.type === 'password' ? (
                                            <FaEyeSlash size={18} />
                                        ) : (
                                            <FaEye size={18} />
                                        )}
                                    </div>
                                    <small className="mt-2">
                                        {t(
                                            'changepswd.8-charac_minimum_case_sensitive'
                                        )}
                                    </small>
                                    {formik.touched.newPassword &&
                                    formik.errors.newPassword ? (
                                        <small className="error-cls">
                                            {formik.errors.newPassword}
                                        </small>
                                    ) : null}
                                </Col>
                                <div className="w-100 clearfix" />
                                <Col
                                    className="form-group mt-5 position-relative"
                                    md={12}
                                >
                                    <Label
                                        className="mb-2"
                                        htmlFor="confirmPassword"
                                    >
                                        {t('changepswd.Verify_New_password')}
                                    </Label>
                                    <InputBox
                                        {...confirmPassword}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.confirmPassword}
                                    />
                                    <div
                                        className="pointer position-absolute top-50 end-0 me-4 mt-1"
                                        onClick={() => {
                                            handleShowPassword(confirmPassword);
                                        }}
                                    >
                                        {confirmPassword?.type ===
                                        'password' ? (
                                            <FaEyeSlash size={18} />
                                        ) : (
                                            <FaEye size={18} />
                                        )}
                                    </div>
                                    {formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword ? (
                                        <small className="error-cls">
                                            {formik.errors.confirmPassword}
                                        </small>
                                    ) : null}
                                </Col>
                            </div>
                            {error}

                            {responce}
                            <div
                                className="swal2-actions"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'end',
                                    fontSize: '0.9em'
                                }}
                            >
                                <button
                                    onClick={props.onCancel}
                                    className="btn btn-outline-secondary rounded-pill sweet-btn-max"
                                >
                                    {t('changepswd.Cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="storybook-button storybook-button--small storybook-button--primary sweet-btn-max"
                                >
                                    {t('changepswd.Change_password')}
                                </button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default ChangePSWModal;
