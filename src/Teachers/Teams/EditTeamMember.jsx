/* eslint-disable indent */
import React from 'react';
import './styles.scss';
import { Row, Col, Form, Label } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import Layout from '../Layout';
import { Button } from '../../stories/Button';
import { InputBox } from '../../stories/InputBox/InputBox';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { openNotificationWithIcon, getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { encryptGlobal } from '../../constants/encryptDecrypt';
const EditTeamMember = (props) => {
    const { t } = useTranslation();
    const allowedAge = [10, 11, 12, 13, 14, 15, 16, 17, 18];
    const history = useHistory();
    const currentUser = getCurrentUser('current_user');
    const teamMemberData =
        (history && history.location && history.location.item) || {};
    // console.log(teamMemberData, 'data');
    const formik = useFormik({
        initialValues: {
            fullName: teamMemberData && teamMemberData.full_name,
            age: JSON.stringify(teamMemberData && teamMemberData.Age),
            grade: teamMemberData && teamMemberData.Grade,
            gender: teamMemberData && teamMemberData.Gender,
            disability: teamMemberData && teamMemberData.disability,
            username: teamMemberData && teamMemberData.user.username
        },

        validationSchema: Yup.object({
            fullName: Yup.string()
                .required('Please Enter valid Full Name')
                .max(40)
                .matches(
                    /^[A-Za-z0-9\s]*$/,
                    'Please enter only alphanumeric characters'
                )
                .trim(),
            age: Yup.number()
                .integer()
                .min(10, 'Min age is 10')
                .max(18, 'Max age is 18')
                .required('required'),
            gender: Yup.string().required('Please select valid gender'),
            username: Yup.string().email('Must be a valid email').max(255),
            disability: Yup.string().required('Please select disability'),
            grade: Yup.string()
                .matches('', 'Please enter valid class')
                .max(40)
                .required('Please enter valid class')
        }),

        onSubmit: (values) => {
            // if (values.username) {
            //     const start = values.username.indexOf('@');
            //     const main = values.username.substring(start);
            //     const checkarry = ['@gmail.com', '@outlook.com', '@yahoo.com'];
            //     const text = checkarry.includes(main);
            //     if (!text) {
            //         openNotificationWithIcon(
            //             'error',
            //             'Email id should end with any of these "@gmail.com,@outlook.com,@yahoo.com"'
            //         );
            //         return;
            //     }
            // }
            const body = {
                team_id: teamMemberData.team_id,
                role: 'STUDENT',
                full_name: values.fullName,
                Age: values.age,
                Grade: values.grade,
                disability: values.disability,
                // username: values.username,
                Gender: values.gender
            };
            if (
                teamMemberData &&
                teamMemberData.user.username !== values.username
            ) {
                body['username'] = values.username;
            }
            const teamparamId = encryptGlobal(
                JSON.stringify(teamMemberData.student_id)
            );
            var config = {
                method: 'put',
                url:
                    process.env.REACT_APP_API_BASE_URL +
                    '/students/' +
                    teamparamId,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser?.data[0]?.token}`
                },
                data: body
            };
            axios(config)
                .then(function (response) {
                    if (response.status === 200) {
                        openNotificationWithIcon(
                            'success',
                            'Team Member Update Successfully'
                        );
                        handleView(teamMemberData);
                    } else {
                        openNotificationWithIcon(
                            'error',
                            'Opps! Something Wrong'
                        );
                    }
                })
                .catch(function (error) {
                    openNotificationWithIcon(
                        'error',
                        error?.response?.data?.message
                    );
                });
        }
    });

    const handleView = (item) => {
        history.push({
            pathname: '/teacher/view-team-member',
            item: item
        });
    };
    return (
        <Layout>
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3 className="mb-5">Edit Team Member Details </h3>

                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-blockt">
                                    <Row>
                                        <Col md={4}>
                                            <Label
                                                className="name-req"
                                                htmlFor="fullName"
                                            >
                                                {t(
                                                    'teacher_teams.student_name'
                                                )}
                                            </Label>
                                            <InputBox
                                                className={'defaultInput'}
                                                placeholder={t(
                                                    'teacher_teams.student_name_pl'
                                                )}
                                                id="fullName"
                                                name="fullName"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.fullName}
                                            />
                                            {formik.touched.fullName &&
                                            formik.errors.fullName ? (
                                                <small className="error-cls">
                                                    {formik.errors.fullName}
                                                </small>
                                            ) : null}
                                        </Col>
                                        <Col md={4} className="mb-5 mb-xl-0">
                                            <Label
                                                className="name-req"
                                                htmlFor="age"
                                            >
                                                {t('teacher_teams.age')}
                                            </Label>

                                            <div className="dropdown CalendarDropdownComp ">
                                                <select
                                                    className="form-control custom-dropdown"
                                                    id="age"
                                                    name="age"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.age}
                                                >
                                                    <option value={''}>
                                                        Select Age
                                                    </option>
                                                    {allowedAge.map((item) => (
                                                        <option
                                                            key={item}
                                                            value={item}
                                                        >
                                                            {item}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {formik.touched.age &&
                                            formik.errors.age ? (
                                                <small className="error-cls">
                                                    {formik.errors.age}
                                                </small>
                                            ) : null}
                                        </Col>
                                        <Col md={4} className="mb-5 mb-xl-0">
                                            <Label
                                                className="name-req-create-member"
                                                htmlFor="username"
                                            >
                                                Email Address
                                                {/* {t(
                                                        'teacher_teams.student_name'
                                                    )} */}
                                                <span required className="p-1">
                                                    *
                                                </span>
                                            </Label>
                                            <InputBox
                                                className={'defaultInput'}
                                                placeholder="Enter Email Address"
                                                id="username"
                                                name="username"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.username}
                                            />

                                            {formik.touched.username &&
                                            formik.errors.username ? (
                                                <small className="error-cls">
                                                    {formik.errors.username}
                                                </small>
                                            ) : null}
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={4}>
                                            <Label
                                                className="name-req"
                                                htmlFor="grade"
                                            >
                                                Class
                                            </Label>
                                            <div className="dropdown CalendarDropdownComp ">
                                                <select
                                                    name="grade"
                                                    className="form-control custom-dropdown"
                                                    value={formik.values.grade}
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                >
                                                    <option value="">
                                                        Select Class..
                                                    </option>
                                                    <option value="6">
                                                        Class 6
                                                    </option>
                                                    <option value="7">
                                                        Class 7
                                                    </option>
                                                    <option value="8">
                                                        Class 8
                                                    </option>
                                                    <option value="9">
                                                        Class 9
                                                    </option>
                                                    <option value="10">
                                                        Class 10
                                                    </option>
                                                    <option value="11">
                                                        Class 11
                                                    </option>
                                                    <option value="12">
                                                        Class 12
                                                    </option>
                                                </select>
                                            </div>
                                            {formik.touched.grade &&
                                            formik.errors.grade ? (
                                                <small className="error-cls">
                                                    {formik.errors.grade}
                                                </small>
                                            ) : null}
                                        </Col>
                                        <Col md={4} className="mb-5 mb-xl-0">
                                            <Label
                                                className="name-req"
                                                htmlFor="gender"
                                            >
                                                {t('teacher_teams.gender')}
                                            </Label>

                                            <select
                                                name="gender"
                                                className="form-control custom-dropdown"
                                                value={formik.values.gender}
                                                onChange={formik.handleChange}
                                            >
                                                <option value="">
                                                    {t('teacher_teams.gender')}
                                                </option>
                                                <option value="MALE">
                                                    {t('teacher_teams.male')}
                                                </option>
                                                <option value="FEMALE">
                                                    {t('teacher_teams.female')}
                                                </option>

                                                <option value="OTHERS">
                                                    Prefer not to mention
                                                </option>
                                            </select>

                                            {formik.touched.gender &&
                                            formik.errors.gender ? (
                                                <small className="error-cls">
                                                    {formik.errors.gender}
                                                </small>
                                            ) : null}
                                        </Col>
                                        <Col md={4} className="mb-5 mb-xl-0">
                                            <Label
                                                className="name-req-create-member"
                                                htmlFor="disability"
                                            >
                                                Disability
                                                {/* {t('teacher_teams.gender')} */}
                                                <span required className="p-1">
                                                    *
                                                </span>
                                            </Label>

                                            <select
                                                name="disability"
                                                className="form-control custom-dropdown"
                                                value={formik.values.disability}
                                                onChange={formik.handleChange}
                                            >
                                                <option value="">
                                                    Select Status
                                                </option>
                                                <option value="No">No</option>
                                                <option value="Physically Challenged">
                                                    Physically Challenged
                                                </option>
                                                <option value="Visually Challenged">
                                                    Visually Challenged
                                                </option>
                                                <option value="Locomotor Disability">
                                                    Locomotor Disability
                                                </option>
                                                <option value="Intellectual Disability">
                                                    Intellectual Disability
                                                </option>
                                                <option value="Learning Disability">
                                                    Learning Disability
                                                </option>
                                                <option value="Hearing Impaired">
                                                    Hearing Impaired
                                                </option>
                                                <option value="Autism/Cerebral Palsy/Other">
                                                    Autism/Cerebral Palsy/Other
                                                </option>
                                                <option value="Others">
                                                    Others
                                                </option>
                                            </select>

                                            {formik.touched.disability &&
                                            formik.errors.disability ? (
                                                <small className="error-cls">
                                                    {formik.errors.disability}
                                                </small>
                                            ) : null}
                                        </Col>
                                    </Row>
                                </div>

                                <hr className="mt-4 mb-4"></hr>
                                <Row>
                                    <Col className="col-xs-12 col-sm-6">
                                        <Button
                                            label={t('teacher_teams.discard')}
                                            btnClass="secondary"
                                            size="small"
                                            onClick={() =>
                                                props.history.push(
                                                    '/teacher/view-team-member'
                                                )
                                            }
                                        />
                                    </Col>
                                    <Col className="submit-btn col-xs-12 col-sm-6">
                                        <Button
                                            label={t('teacher_teams.submit')}
                                            type="submit"
                                            btnClass={
                                                !(
                                                    formik.dirty &&
                                                    formik.isValid
                                                )
                                                    ? 'default'
                                                    : 'primary'
                                            }
                                            disabled={!formik.dirty}
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

export default withRouter(EditTeamMember);
