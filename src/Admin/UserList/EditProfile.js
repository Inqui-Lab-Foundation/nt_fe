/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect } from 'react';
import { Row, Col, Form, Label } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import './style.scss';
import Layout from '../../Admin/Layout';
import { Button } from '../../stories/Button';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { InputBox } from '../../stories/InputBox/InputBox';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import { useHistory } from 'react-router-dom';
import { getAdminEvalutorsList } from '../store/adminEvalutors/actions';
import { getAdmin } from '../store/admin/actions';
import { useDispatch } from 'react-redux';
import Select from '../../Admin/Challenges/pages/Select';
import { getDistrictData } from '../../redux/studentRegistration/actions';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import { useSelector } from 'react-redux';
const EditProfile = (props) => {
    // here we can edit the users details //
    const history = useHistory();
    const currentUser = getCurrentUser('current_user');
    const dispatch = useDispatch();
    const mentorData =
        // where  mentorData = mentor details //
        (history && history.location && history.location.data) || {};
    // console.log(mentorData, '111');
    // const phoneRegExp = /^[0-9\s]+$/;
    const fullDistrictsNames = useSelector(
        (state) => state?.studentRegistration?.dists
    );
    useEffect(() => {
        dispatch(getDistrictData());
    }, []);
    const inputPassword = {
        placeholder: 'Enter Password',
        showEyeIcon: true
        // className: 'defaultInput'
    };

    const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    const getValidationSchema = (mentorData) => {
        // where data = mentorData //
        const adminValidation = Yup.object({
            name: Yup.string()
                .matches(/^[aA-zZ\s]+$/, 'Only allow alpha characters')
                .min(2, 'Enter a valid name')
                .required('Name is Required'),
            email: Yup.string()
                .email('Must be a valid email')
                .required('required'),
            password: Yup.string()
                .trim()
                // .required('Please enter Password')
                .matches(
                    passwordRegex,
                    'Password must contains minimum 8 characters, including one letter, one number, and one special character.'
                )
            // .matches(/[A-Za-z0-9/-/]\.com$/, 'Email must end with .com')
            // .trim()
            // .matches(
            //     /^\d+$/,
            //     'Mobile number is not valid (Enter only digits)'
            // )
            // .max(10, 'Please enter only 10 digit valid number')
            // .min(10, 'Number is less than 10 digits')
        });
        if (mentorData?.mentor_id)
            if (mentorData?.evaluator_id)
                // adminValidation['phone'] = Yup.string()
                //     .matches(phoneRegExp, 'Mobile number is not valid')
                //     .min(10, 'Enter a valid mobile number')
                //     .max(10, 'Enter a valid mobile number')
                //     .required('Mobile Number is Required');
                adminValidation['district'] = Yup.string()
                    .matches(/^[aA-zZ\s]+$/, 'Invalid District Name ')
                    .min(2, 'Enter a valid district')
                    .required('District is Required');
        return adminValidation;
    };
    const getInitialValues = (mentorData) => {
        // console.log(data, '222');
        const commonInitialValues = {
            name: mentorData?.full_name || mentorData?.user?.full_name,
            email: mentorData?.username || mentorData?.user?.username,
            password: mentorData?.password || mentorData?.user?.password
        };
        if (!mentorData?.admin_id) {
            commonInitialValues['phone'] = mentorData.mobile;
            if (!mentorData?.mentor_id)
                commonInitialValues['district'] = mentorData.district;
        }
        return commonInitialValues;
    };
    const formik = useFormik({
        initialValues: getInitialValues(mentorData),
        validationSchema: getValidationSchema(mentorData),
        onSubmit: (values) => {
            var pass = values.password ? values.password.trim() : '';

            const key = CryptoJS.enc.Hex.parse(
                '253D3FB468A0E24677C28A624BE0F939'
            );
            const iv = CryptoJS.enc.Hex.parse(
                '00000000000000000000000000000000'
            );
            const encrypted = CryptoJS.AES.encrypt(pass, key, {
                iv: iv,
                padding: CryptoJS.pad.NoPadding
            }).toString();
            // values.password = encrypted;
            const full_name = values.name;
            const email = values.email;
            const password = values.password;
            const district = values.district;
            const tecParam = encryptGlobal(
                JSON.stringify(mentorData.mentor_id)
            );
            const body = mentorData?.evaluator_id
                ? {
                      full_name: full_name,
                      username: email
                      //   password: encrypted
                  }
                : mentorData?.admin_id
                ? JSON.stringify({
                      full_name: full_name,
                      username: email
                  })
                : JSON.stringify({
                      full_name: full_name,
                      username: email
                      //   mobile: email
                  });

            if (mentorData && mentorData.password !== password) {
                body['password'] = encrypted;
            }

            const EvlId = encryptGlobal(
                JSON.stringify(mentorData.evaluator_id)
            );
            const admId = encryptGlobal(JSON.stringify(mentorData.admin_id));
            const url = mentorData?.evaluator_id
                ? process.env.REACT_APP_API_BASE_URL + '/evaluators/' + EvlId
                : mentorData?.admin_id
                ? process.env.REACT_APP_API_BASE_URL + '/admins/' + admId
                : process.env.REACT_APP_API_BASE_URL + '/mentors/' + tecParam;
            var config = {
                method: 'put',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser?.data[0]?.token}`
                },
                data: body
            };
            axios(config)
                .then(function (response) {
                    if (response.status === 200) {
                        mentorData?.evaluator_id
                            ? dispatch(getAdminEvalutorsList())
                            : mentorData?.admin_id && dispatch(getAdmin());
                        openNotificationWithIcon(
                            'success',
                            'Updated Successfully'
                        );
                        setTimeout(() => {
                            props.history.push(
                                mentorData.where === 'Dashbord'
                                    ? '/admin/dashboard'
                                    : '/admin/userlist'
                            );
                        }, 200);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    });

    const handleDiscard = () => {
        // where we can discard  the changes //
        props.history.push(
            mentorData.where === 'Dashbord'
                ? '/admin/dashboard'
                : '/admin/userlist'
        );
        localStorage.setItem(
            'organization_code',
            JSON.stringify(mentorData.organization_code)
        );
    };
    return (
        <Layout>
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        {/* <BreadcrumbTwo {...headingDetails} /> */}
                        <h3 className="mb-5">User Edit Profile</h3>

                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                    <Row className="justify-content-center">
                                        <Row>
                                            <Col md={12}>
                                                <Label
                                                    className="name-req"
                                                    htmlFor="name"
                                                >
                                                    Name
                                                </Label>

                                                <InputBox
                                                    className={'defaultInput'}
                                                    id="name"
                                                    name="name"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.name}
                                                />

                                                {formik.touched.name &&
                                                formik.errors.name ? (
                                                    <small className="error-cls">
                                                        {formik.errors.name}
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Label
                                                    className="name-req "
                                                    htmlFor="email"
                                                >
                                                    Email Address
                                                </Label>
                                                <InputBox
                                                    className={'defaultInput'}
                                                    id="email"
                                                    name="email"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.email}
                                                />
                                                {formik.touched.email &&
                                                formik.errors.email ? (
                                                    <small className="error-cls">
                                                        {formik.errors.email}
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="password"
                                                    style={{
                                                        fontSize: '1.5rem'
                                                    }}
                                                >
                                                    Password
                                                </Label>
                                                <InputBox
                                                    {...inputPassword}
                                                    id="reg-password"
                                                    type="password"
                                                    name="password"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values.password
                                                    }
                                                    // maxLength={8}
                                                    minLength={8}
                                                />

                                                {formik.touched.password &&
                                                formik.errors.password ? (
                                                    <small className="error-cls">
                                                        {formik.errors.password}
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>
                                        <div className="w-100" />
                                        {!mentorData?.admin_id && (
                                            <>
                                                {/* <Col md={6}>
                                                    <Label
                                                        className="name-req mt-5"
                                                        htmlFor="phone"
                                                    >
                                                        Phone
                                                    </Label>
                                                    <InputBox
                                                        className={
                                                            'defaultInput'
                                                        }
                                                        id="phone"
                                                        name="phone"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values.phone
                                                        }
                                                    />

                                                    {formik.touched.phone &&
                                                    formik.errors.phone ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .phone
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col> */}
                                                <div className="w-100" />
                                            </>
                                        )}
                                    </Row>
                                </div>

                                <hr className="mt-4 mb-4"></hr>
                                <Row>
                                    <Col className="col-xs-12 col-sm-6">
                                        <Button
                                            label="Discard"
                                            btnClass="secondary"
                                            size="small"
                                            onClick={handleDiscard}
                                        />
                                    </Col>
                                    <Col className="submit-btn col-xs-12 col-sm-6">
                                        <Button
                                            label="Submit details"
                                            type="submit"
                                            btnClass={
                                                !(
                                                    formik.dirty &&
                                                    formik.isValid
                                                )
                                                    ? 'default'
                                                    : 'primary'
                                            }
                                            size="small"
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default withRouter(EditProfile);
