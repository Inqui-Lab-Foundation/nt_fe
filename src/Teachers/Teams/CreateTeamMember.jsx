/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import './styles.scss';
import { Row, Col, Form, Label } from 'reactstrap';
import { useLocation, withRouter } from 'react-router-dom';
import Layout from '../Layout';
import { Button } from '../../stories/Button';
import { InputBox } from '../../stories/InputBox/InputBox';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { BreadcrumbTwo } from '../../stories/BreadcrumbTwo/BreadcrumbTwo';
import { openNotificationWithIcon, getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { teacherCreateMultipleStudent } from '../store/teacher/actions';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import { DropDownWithSearch } from '../../stories/DropdownWithSearch/DropdownWithSearch';
import { error } from 'highcharts';

const studentBody = {
    student_full_name: '',
    Age: '',
    // stream_id: '',
    mobile: '',
    year_of_study: '',
    date_of_birth: '',
    Gender: '',
    email: '',
    username: '',
    institution_course_id: ''
};
// const grades = [6, 7, 8, 9, 10, 11, 12];
const allowedAge = [10, 11, 12, 13, 14, 15, 16, 17, 18];
const allowedYear = [1, 2, 3, 4, 5];
const allowCourse = [1, 2, 3];
const CreateMultipleMembers = ({ id }) => {
    const currentUser = getCurrentUser('current_user');
    const MentorId = currentUser.data[0]?.mentor_id;

    const tempStudentData = {
        team_id: id,
        role: 'STUDENT',
        student_full_name: '',
        // stream_id: '',
        Age: '',
        mobile: '',
        year_of_study: '',
        date_of_birth: '',

        email: '',
        Gender: '',
        institution_course_id: '',
        // disability: '',
        username: '',
        mentor_id: MentorId
    };
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [itemDataErrors, setItemDataErrors] = useState([studentBody]);
    const history = useHistory();
    const [isClicked, setIsClicked] = useState(false);
    const [listCourse, setListCourse] = useState([]);
    const [multiStream, setMultiStream] = useState([]);
    const [multiProgram, setMultiProgram] = useState([]);

    // console.log(MentorId, '3');
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedStreamValue, setSelectedStreamValue] = useState('');

    const [studentData, setStudentData] = useState([
        {
            team_id: id,
            role: 'STUDENT',
            student_full_name: '',
            // stream_id: '',
            institution_course_id: '',

            Age: '',
            mobile: '',
            year_of_study: '',
            date_of_birth: '',
            // Grade: '',
            Gender: '',
            username: '',
            email: '',
            mentor_id: MentorId
        },
        {
            team_id: id,
            role: 'STUDENT',
            student_full_name: '',
            stream_id: '',
            Age: '',
            mobile: '',
            year_of_study: '',
            date_of_birth: '',
            institution_course_id: '',

            // Grade: '',
            // Gender: '',
            username: '',
            email: '',
            mentor_id: MentorId
            // disability: ''
        },
        {
            team_id: id,
            role: 'STUDENT',
            student_full_name: '',
            // stream_id: '',
            Age: '',
            mobile: '',
            year_of_study: '',
            date_of_birth: '',
            institution_course_id: '',

            // Grade: '',
            // Gender: '',
            username: '',
            email: '',
            mentor_id: MentorId
            // disability: ''
        }
    ]);
    let pattern = /[A-Za-z0-9\s]*$/;
    // const emailRegex = /[A-Za-z-@+.-]*$/;
    // const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    // const emailRegex = /^[\w.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isValidNumber = /^\d{10}$/;
    useEffect(() => {
        multiInstitutionList();
    }, []);
    const multiInstitutionList = () => {
        const newparam = encryptGlobal(
            JSON.stringify({
                institution_id: currentUser.data[0]?.institution_id
            })
        );

        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/institutions/institutionTypes?Data=${newparam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    let dataa = response?.data?.data;

                    if (dataa) {
                        let courseOption = [];
                        dataa.map((item) => {
                            let option = {
                                label: item.institution_type,
                                value: item.institution_type_id
                            };
                            courseOption.push(option);
                        });
                        setListCourse(courseOption);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const selectCategory = {
        label: 'Select Institution',
        options: listCourse,
        className: 'defaultDropdown'
    };
    const selectMUltiStream = {
        label: 'Select Stream',
        options: multiStream,
        className: 'defaultDropdown'
    };
    const selectMUltiProgram = {
        label: 'Select Program',
        options: multiProgram,
        className: 'defaultDropdown'
    };
    useEffect(async () => {
        if (selectedValue) {
            await MultistreamsApi();
        }
    }, [selectedValue]);
    const MultistreamsApi = () => {
        const newparam = encryptGlobal(
            JSON.stringify({
                institution_id: currentUser.data[0]?.institution_id,
                institution_type_id: selectedValue
            })
        );

        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/institutions/Streams?Data=${newparam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response, '3');
                    let StreamListdata = response?.data?.data;
                    if (StreamListdata) {
                        let MultiStreamOptions = [];
                        StreamListdata.map((item) => {
                            let option = {
                                label: item.stream_name,
                                value: item.stream_id
                            };
                            MultiStreamOptions.push(option);
                        });
                        setMultiStream(MultiStreamOptions);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    useEffect(async () => {
        if (selectedStreamValue) {
            await MultiProgrammeApi();
        }
    }, [selectedStreamValue]);
    const MultiProgrammeApi = () => {
        const newparam = encryptGlobal(
            JSON.stringify({
                institution_id: currentUser.data[0]?.institution_id,
                institution_type_id: selectedValue,
                stream_id: selectedStreamValue
            })
        );

        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/institutions/programs?Data=${newparam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    let MultiProgrammedata = response?.data?.data;
                    if (MultiProgrammedata) {
                        let MultiProgrammeOptions = [];
                        MultiProgrammedata.map((item) => {
                            let option = {
                                label: item.program_name,
                                value: item.institution_course_id
                            };
                            MultiProgrammeOptions.push(option);
                        });
                        setMultiProgram(MultiProgrammeOptions);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const handleChange = (e, i) => {
        let newItem = [...studentData];

        const dataKeys = Object.keys(studentBody);
        if (e.target) {
            dataKeys.some((item) => {
                if (e.target.name === item) {
                    newItem[i][e.target.name] = e.target.value;
                    let errCopy = [...itemDataErrors];
                    if (item === 'student_full_name') {
                        let check = e.target.value;
                        if (check && check.match(pattern)) {
                            const { index } = check.match(pattern);
                            if (index) {
                                const foo = { ...errCopy[i] };
                                foo[e.target.name] =
                                    'Only alphanumeric are allowed';
                                errCopy[i] = { ...foo };
                                setItemDataErrors(errCopy);
                                return;
                            }
                        }
                    }
                    if (item === 'mobile') {
                        let check = e.target.value;
                        if (check && check.match(isValidNumber)) {
                            const { index } = check.match(isValidNumber);
                            if (index) {
                                const foo = { ...errCopy[i] };
                                foo[e.target.name] =
                                    'Enter Valid Mobile Number';
                                errCopy[i] = { ...foo };
                                setItemDataErrors(errCopy);
                                return;
                            }
                        }
                    }
                    if (item === 'date_of_birth') {
                        let check = e.target.value;
                        const currentDate = new Date();
                        const selectedDate = new Date(check);
                        const age =
                            currentDate.getFullYear() -
                            selectedDate.getFullYear();
                        newItem[i]['age'] = age;
                        studentData[i]['Age'] = age;
                        if (age < 16 || age > 30) {
                            // const { index } = newItem[i]['age'];
                            // if (index) {
                            const foo = { ...errCopy[i] };

                            foo['age'] = 'Age must be between 16 to 30';
                            errCopy[i] = { ...foo };
                            setItemDataErrors(errCopy);
                            return;
                            // }
                        }
                        // if (item === 'stream_id') {
                        //     newItem[i].stream_id = e.target.value;
                        // }
                        // console.log(age, '11');
                        // if (check && check.match(isValidNumber)) {
                        //     const { index } = check.match(isValidNumber);
                        //     if (index) {
                        //         const foo = { ...errCopy[i] };
                        //         foo[e.target.name] =
                        //             'Enter Valid Mobile Number';
                        //         errCopy[i] = { ...foo };
                        //         setItemDataErrors(errCopy);
                        //         return;
                        //     }
                        // }
                    }

                    const foo = { ...errCopy[i] };
                    foo[e.target.name] = '';
                    errCopy[i] = { ...foo };
                    setItemDataErrors(errCopy);
                }
                return;
            });
        }

        setStudentData(newItem);
    };
    const validateItemData = () => {
        const errors = studentData.map((item, i) => {
            let err = {};
            if (!item.student_full_name.trim())
                err['student_full_name'] = 'Please enter full name';
            if (
                item.student_full_name &&
                item.student_full_name.match(pattern)
            ) {
                const { index } = item.student_full_name.match(pattern);
                if (index) {
                    err['student_full_name'] = 'Only alphanumeric are allowed';
                }
            }
            if (!item.date_of_birth) {
                err['date_of_birth'] =
                    'Please select date-of-birth / Age Must be 14 to 15';
            } else {
                const currentDate = new Date();
                const selectedDate = new Date(item.date_of_birth);
                const age =
                    currentDate.getFullYear() - selectedDate.getFullYear();

                // Validate age
                if (age < 16 || age > 30) {
                    err['Age'] = 'Age must be between 16 to 30';
                    openNotificationWithIcon(
                        'error',
                        'Age must be between 16 to 30'
                    );
                } else {
                    // err['Age'] = '';
                    delete err['Age'];
                }
            }

            // if (!item.Age) err['Age'] = 'Age is Required';
            // if (!item.email) err['email'] = 'Email Id is Required';
            if (!item.email.trim()) err['email'] = 'Please enter email id';
            if (item.email && item.email.match(emailRegex)) {
                const { index } = item.email.match(emailRegex);
                if (index) {
                    err['email'] = 'Please enter valid email id';
                }
            }
            if (!item.email.trim()) {
                err['email'] = 'Please enter email id';
            } else if (!emailRegex.test(item.email)) {
                err['email'] =
                    'Enter the valid email id/accept small letters only';
            }
            if (!item.institution_course_id)
                err['institution_course_id'] = 'Please select any program ';
            // if (!item.stream_id) {
            //     err['stream_id'] = 'Course is Required';
            // } else {
            //     err['stream_id'] = '';
            // }

            // if (!item.mobile) err['mobile'] = 'Mobile number is Required';
            // if (!item.mobile.trim())
            //     err['mobile'] = 'Mobile number is Required';
            // if (item.mobile && item.mobile.match(isValidNumber)) {
            //     const { index } = item.mobile.match(isValidNumber);
            //     if (index) {
            //         err['mobile'] = 'Enter the valid Mobile number';
            //     }
            // }
            // if (!item.mobile.trim()) {
            //     err['mobile'] = 'Mobile number is Required';
            // } else if (item.mobile.length !==10) {
            //     err['mobile'] = 'Mobile number must be exactly 10 digits';
            // } else if (!isValidNumber.test(item.mobile)) {
            //     err['mobile'] = 'Enter a valid mobile number';
            // }
            if (!item.mobile.trim()) {
                err['mobile'] = 'Please enter mobile number ';
            } else if (!/^\d{10}$/.test(item.mobile)) {
                err['mobile'] =
                    'Mobile number must be exactly 10 digits/accept only digits';
            } else if (!isValidNumber.test(item.mobile)) {
                err['mobile'] = 'Please enter a valid mobile number';
            }

            // if (!item.date_of_birth) err['date_of_birth'] = 'DOB is Required';
            if (!item.year_of_study)
                err['year_of_study'] = 'Please select year of study';

            if (!item.Gender) err['Gender'] = 'Please select gender ';
            if (Object.values(err).length === 0) {
                return { ...studentBody, i };
            }
            return { ...err, i };
        });
        setItemDataErrors(
            errors.filter((item) => Object.values(item).length > 0)
        );
        const filterEmpty = errors.filter((item) => {
            const ce = { ...item };
            delete ce.i;
            return Object.values(ce).filter(Boolean).length > 0;
        });
        if (filterEmpty.length > 0) {
            return false;
        } else {
            return true;
        }
    };

    const addItem = () => {
        if (!validateItemData()) {
            return;
        } else {
            setStudentData([...studentData, tempStudentData]);
        }
    };
    const containsDuplicates = (array) => {
        if (array.length !== new Set(array).size) {
            return true;
        }
        return false;
    };
    const removeItem = (i) => {
        let newItems = [...studentData];
        newItems.splice(i, 1);
        setStudentData(newItems);
    };
    const handleSumbit = () => {
        if (!validateItemData()) return;
        setIsClicked(true);
        const checkDuplicateName = containsDuplicates(
            studentData.map((item) => item.student_full_name)
        );
        if (checkDuplicateName) {
            openNotificationWithIcon('error', 'Student already exists');
            setIsClicked(false);
            return;
        }
        var finalStudentArray = [];
        finalStudentArray = studentData.map((item, i) => ({
            ...item,
            username: item.mobile,
            age: item.age
        }));

        dispatch(
            teacherCreateMultipleStudent(
                finalStudentArray,
                history,
                setIsClicked
            )
        );
    };
    const handleErrorForStream = (values, i) => {
        let errCopy = [...itemDataErrors];
        if (values[i]['institution_course_id'] !== '') {
            errCopy[i]['institution_course_id'] = '';
        }
        setItemDataErrors(errCopy);
    };
    // console.log(selectedStreamValue, 'St');
    return (
        <div className="create-ticket register-blockt">
            {studentData.map((item, i) => {
                const foundErrObject = { ...itemDataErrors[i] };
                return (
                    <div key={i + item} className="mb-5">
                        <div className="d-flex justify-content-between align-items-center">
                            <h6 className="">Student {i + 1} Details</h6>
                            {i > 3 && (
                                <Button
                                    label={'Remove'}
                                    onClick={() => removeItem(i)}
                                    btnClass={'secondary float-end'}
                                    size="small"
                                />
                            )}
                        </div>
                        <hr />
                        <Row className="mb-3">
                            <Row>
                                <Col md={6}>
                                    <Label
                                        className="name-req-create-member"
                                        htmlFor="fullName"
                                    >
                                        {t('teacher_teams.student_name')}
                                        <span required className="p-1">
                                            *
                                        </span>
                                    </Label>
                                    <InputBox
                                        className={'defaultInput'}
                                        placeholder={t(
                                            'teacher_teams.student_name_pl'
                                        )}
                                        id="student_full_name"
                                        name="student_full_name"
                                        onChange={(e) => {
                                            handleChange(e, i);
                                        }}
                                        value={item.student_full_name}
                                    />
                                    {foundErrObject?.student_full_name ? (
                                        <small className="error-cls">
                                            {foundErrObject.student_full_name}
                                        </small>
                                    ) : null}
                                </Col>
                                <Col md={6}>
                                    <Label
                                        className="name-req-create-member"
                                        htmlFor="stream_id"
                                    >
                                        Institution Type
                                        <span required className="p-1">
                                            *
                                        </span>
                                    </Label>

                                    <DropDownWithSearch
                                        {...selectCategory}
                                        // onBlur={formik.handleBlur}
                                        // onChange={(option) => {
                                        //     // studentData[i][
                                        //     //     'institution_type_id'
                                        //     // ] =
                                        //     option[0]?.value;
                                        //     // console.log(
                                        //     //     option[0]?.value,
                                        //     //     ' option[0]?.value'
                                        //     // );
                                        // }}
                                        onChange={(option) => {
                                            // const selectedValue =
                                            //     option[0]?.value;
                                            const selectedValue =
                                                option[0]?.value;
                                            setSelectedValue(selectedValue);

                                            // console.log(
                                            //     selectedValue,
                                            //     'selectedCategory'
                                            // );
                                        }}
                                        // value={[
                                        //     {
                                        //         label: selectedValue?.institution_type,
                                        //         value: selectedValue?.institution_type_id
                                        //     }
                                        // ]}
                                        // value={selectedValue }
                                        value={item.value}
                                        name="Select Institution Type"
                                        id="Select Institution Type"
                                    />
                                    {/* </div> */}

                                    {foundErrObject?.institution_type_id ? (
                                        <small className="error-cls">
                                            {foundErrObject.institution_type_id}
                                        </small>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={5}>
                                    <Label
                                        className="name-req-create-member"
                                        htmlFor="stream_id"
                                    >
                                        Stream Type
                                        <span required className="p-1">
                                            *
                                        </span>
                                    </Label>

                                    <DropDownWithSearch
                                        {...selectMUltiStream}
                                        // onBlur={formik.handleBlur}
                                        onChange={(option) => {
                                            // studentData[i]['stream_id'] =
                                            //     option[0]?.value;
                                            const selectedStreamValue =
                                                option[0]?.value;
                                            setSelectedStreamValue(
                                                selectedStreamValue
                                            );

                                            // 'course_id', option[0]?.value;
                                        }}
                                        // onChange={(e) => {
                                        //     handleChange(e, i);
                                        // }}
                                        value={item.value}
                                        name="Select Course"
                                        id="Select Course"
                                    />
                                    {/* </div> */}

                                    {foundErrObject?.stream_id ? (
                                        <small className="error-cls">
                                            {foundErrObject.stream_id}
                                        </small>
                                    ) : null}
                                </Col>
                                <Col md={5}>
                                    <Label
                                        className="name-req-create-member"
                                        htmlFor="stream_id"
                                    >
                                        Program Type
                                        <span required className="p-1">
                                            *
                                        </span>
                                    </Label>

                                    <DropDownWithSearch
                                        {...selectMUltiProgram}
                                        // onBlur={formik.handleBlur}
                                        onChange={(option) => {
                                            studentData[i][
                                                'institution_course_id'
                                            ] = option[0]?.value;
                                            handleErrorForStream(
                                                studentData,
                                                i
                                            );
                                            // 'course_id', option[0]?.value;
                                        }}
                                        // onChange={(e) => {
                                        //     handleChange(e, i);
                                        // }}
                                        value={item.value}
                                        name="Select Program"
                                        id="Select Program"
                                    />
                                    {/* </div> */}

                                    {foundErrObject?.institution_course_id ? (
                                        <small className="error-cls">
                                            {
                                                foundErrObject.institution_course_id
                                            }
                                        </small>
                                    ) : null}
                                </Col>
                                <Col md={2} className="mb-xl-0">
                                    <Label
                                        className="name-req-create-member"
                                        htmlFor="year_of_study"
                                    >
                                        Year of Study
                                        <span required className="p-1">
                                            *
                                        </span>
                                    </Label>
                                    <div className="dropdown CalendarDropdownComp ">
                                        <select
                                            name="year_of_study"
                                            className="form-control custom-dropdown"
                                            value={item.year_of_study}
                                            onChange={(e) => handleChange(e, i)}
                                        >
                                            <option value={''}>
                                                Select the Year
                                            </option>
                                            {allowedYear.map((item) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {foundErrObject?.year_of_study ? (
                                        <small className="error-cls">
                                            {foundErrObject.year_of_study}
                                        </small>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} className="mb-xl-0">
                                    <Label
                                        className="name-req-create-member"
                                        htmlFor="email"
                                    >
                                        {/* {t('teacher_teams.age')} */}
                                        Email Address
                                        <span required className="p-1">
                                            *
                                        </span>
                                        {/* <span
                                            required
                                            className="p-1 "
                                            style={{ color: 'red' }}
                                        >
                                            * Note : Gmail / Yahoo / Outlook
                                            mails are accepted.
                                        </span> */}
                                    </Label>
                                    <InputBox
                                        className={'defaultInput'}
                                        placeholder="Enter Email Id"
                                        // {t(
                                        //     'teacher_teams.student_name_pl'
                                        // )}
                                        id="email"
                                        name="email"
                                        onChange={(e) => {
                                            handleChange(e, i);
                                        }}
                                        value={item.email}
                                    />
                                    {foundErrObject?.email ? (
                                        <small className="error-cls">
                                            {foundErrObject.email}
                                        </small>
                                    ) : null}
                                </Col>
                                <Col md={6} className="mb-xl-0">
                                    <Label
                                        className="name-req-create-member"
                                        htmlFor="mobile"
                                    >
                                        {/* {t('teacher_teams.age')} */}
                                        Mobile Number
                                        <span required className="p-1">
                                            *
                                        </span>
                                    </Label>
                                    <InputBox
                                        className={'defaultInput'}
                                        placeholder="Enter Mobile Number"
                                        // {t(
                                        //     'teacher_teams.student_name_pl'
                                        // )}
                                        id="mobile"
                                        name="mobile"
                                        onChange={(e) => {
                                            handleChange(e, i);
                                        }}
                                        value={item.mobile}
                                    />
                                    {foundErrObject?.mobile ? (
                                        <small className="error-cls">
                                            {foundErrObject.mobile}
                                        </small>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Label
                                        className="name-req-create-member"
                                        htmlFor="date_of_birth"
                                    >
                                        Date of Birth
                                        <span required className="p-1">
                                            *
                                        </span>
                                    </Label>
                                    <InputBox
                                        className={'defaultInput'}
                                        placeholder="DD/MM/YYYY"
                                        id="date_of_birth"
                                        type="date"
                                        name="date_of_birth"
                                        onChange={(e) => {
                                            handleChange(e, i);
                                        }}
                                        value={item.date_of_birth}
                                    />
                                    {foundErrObject?.date_of_birth ? (
                                        <small className="error-cls">
                                            {foundErrObject.date_of_birth}
                                        </small>
                                    ) : null}
                                </Col>

                                <Col md={4} className="mb-5 mb-xl-0">
                                    <Label
                                        className="name-req-create-member"
                                        htmlFor="gender"
                                    >
                                        {t('teacher_teams.gender')}
                                        <span required className="p-1">
                                            *
                                        </span>
                                    </Label>

                                    <select
                                        name="Gender"
                                        className="form-control custom-dropdown"
                                        value={item.Gender}
                                        onChange={(e) => handleChange(e, i)}
                                    >
                                        <option value="">
                                            {t('teacher_teams.student_gender')}
                                        </option>
                                        <option value="Male">
                                            {t(
                                                'teacher_teams.student_gender_male'
                                            )}
                                        </option>
                                        <option value="Female">
                                            {t(
                                                'teacher_teams.student_gender_female'
                                            )}
                                        </option>
                                        <option value="OTHERS">
                                            Prefer not to mention
                                        </option>
                                    </select>
                                    {foundErrObject?.Gender ? (
                                        <small className="error-cls">
                                            {foundErrObject?.Gender}
                                        </small>
                                    ) : null}
                                </Col>
                                <Col md={4} className="mb-xl-0">
                                    <Label
                                        className="name-req-create-member"
                                        htmlFor="age"
                                    >
                                        {t('teacher_teams.age')}
                                        <span required className="p-1">
                                            *
                                        </span>
                                    </Label>
                                    {/* <div className="dropdown CalendarDropdownComp ">
                                        <select
                                            name="Age"
                                            className="form-control custom-dropdown"
                                            value={item.Age}
                                            onChange={(e) => handleChange(e, i)}
                                        >
                                            <option value={''}>
                                                Select Age
                                            </option>
                                            {allowedAge.map((item) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div> */}
                                    <InputBox
                                        className={'defaultInput'}
                                        isDisabled={true}
                                        placeholder="Age"
                                        id="age"
                                        type="age"
                                        name="age"
                                        onChange={(e) => {
                                            handleChange(e, i);
                                        }}
                                        value={item.age?.toString()}
                                    />
                                    {foundErrObject?.Age ? (
                                        <small className="error-cls">
                                            {foundErrObject.Age}
                                        </small>
                                    ) : null}
                                </Col>
                            </Row>
                            {/* <Col md={3} className="mb-xl-0">
                                <Label
                                    className="name-req-create-member"
                                    htmlFor="disability"
                                >
                                    {/* {t('teacher_teams.age')} */}
                            {/* Disability
                                    <span required className="p-1">
                                        *
                                    </span>
                                </Label>
                                <select
                                    name="disability"
                                    className="form-control custom-dropdown"
                                    value={item.disability}
                                    onChange={(e) => handleChange(e, i)}
                                >
                                    <option value="">Select Status</option>
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
                                    <option value="Others">Others</option>
                                </select>
                                {foundErrObject?.disability ? (
                                    <small className="error-cls">
                                        {foundErrObject.disability}
                                    </small>
                                ) : null} */}
                            {/* </Col>  */}

                            {/* <Col md={3}>
                                <Label
                                    className="name-req-create-member"
                                    htmlFor="grade"
                                >
                                    Class
                                    <span required className="p-1">
                                        *
                                    </span>
                                </Label>
                                <div className="dropdown CalendarDropdownComp ">
                                    <select
                                        name="Grade"
                                        className="form-control custom-dropdown"
                                        value={item.Grade}
                                        onChange={(e) => handleChange(e, i)}
                                    >
                                        <option value="">Select Class</option>
                                        {grades.map((item) => (
                                            <option key={item} value={item}>
                                                Class {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {foundErrObject?.Grade ? (
                                    <small className="error-cls">
                                        {foundErrObject?.Grade}
                                    </small>
                                ) : null}
                            </Col> */}
                        </Row>
                    </div>
                );
            })}
            <Row>
                <Col className="mt-2" xs={12} sm={6} md={6} xl={6}>
                    <Button
                        label={t('teacher_teams.discard')}
                        btnClass="secondary "
                        size="small"
                        onClick={() => history.push('/mentor/teamlist')}
                    />
                </Col>
                <Col className="mt-2" xs={12} sm={6} md={6} xl={6}>
                    {!isClicked ? (
                        <Button
                            label={t('teacher_teams.submit')}
                            type="submit"
                            onClick={handleSumbit}
                            btnClass={'primary float-end'}
                            // btnClass={'btn btn-warning text-right'}
                            size="small"
                        />
                    ) : (
                        <Button
                            label={t('teacher_teams.submit')}
                            type="button"
                            btnClass={'default float-end'}
                            // btnClass={'btn btn-default'}
                            size="small"
                            disabled={true}
                        />
                    )}
                    {studentData.length < 6 && (
                        <div className="">
                            <Button
                                label={'Add More'}
                                onClick={addItem}
                                btnClass={
                                    // 'primary d-flex justify-content-center mt-2'
                                    studentData.length != 5
                                        ? 'primary'
                                        : 'default'
                                }
                                size="small"
                                disabled={studentData.length === 5}
                            />
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

const CreateTeamMember = (props) => {
    const loc = useLocation();
    const params = loc.pathname.split('/');
    const pl = params.length;
    const { t } = useTranslation();
    const id = params[pl - 2];
    const studentCount = params[pl - 1];
    const currentUser = getCurrentUser('current_user');
    const [teamMemberData, setTeamMemberData] = useState({});
    const [isClicked, setIsClicked] = useState(false);
    const [aged, setAge] = useState('');
    const [courses, setCourses] = useState([]);
    const [stream, setStream] = useState([]);
    const [program, setProgram] = useState([]);
    const [instType, setInstType] = useState();
    const MentorsId = currentUser?.data[0]?.mentor_id;
    const headingDetails = {
        title: t('teacher_teams.create_team_members'),

        options: [
            {
                title: t('teacher_teams.teamslist'),
                path: '/mentor/teamlist'
            },
            {
                title: t('teacher_teams.create_team_members')
            }
        ]
    };
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    useEffect(async () => {
        await handleCreateMemberAPI(id);
    }, [id]);
    const selectCategory = {
        label: 'Select Institution',
        options: courses,
        className: 'defaultDropdown'
    };
    const selectStream = {
        label: 'Select Stream',
        options: stream,
        className: 'defaultDropdown'
    };
    const selectProgram = {
        label: 'Select Program',
        options: program,
        className: 'defaultDropdown'
    };
    // const selectCategory = {
    //     label: 'Select Course',
    //     options: [
    //         { label: 'CSE', value: '1' },
    //         { label: 'ECE', value: '2' },
    //         { label: 'EEE', value: '3' },
    //         { label: 'CIVIL', value: '4' }
    //     ],
    //     className: 'defaultDropdown'
    // };
    // useEffect(() => {
    //     CourseList();
    // }, []);
    useEffect(() => {
        institutionTypeApi();
    }, []);
    const institutionTypeApi = () => {
        const newparam = encryptGlobal(
            JSON.stringify({
                institution_id: currentUser.data[0]?.institution_id
            })
        );

        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/institutions/institutionTypes?Data=${newparam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    let data = response?.data?.data;
                    if (data) {
                        let courseOptions = [];
                        data.map((item) => {
                            let option = {
                                label: item.institution_type,
                                value: item.institution_type_id
                            };
                            courseOptions.push(option);
                        });
                        setCourses(courseOptions);
                    }
                    // setTotalSubmittedideasCount(
                    //     response.data.data[0].submitted_ideas
                    // );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    // useEffect(() => {
    //     if (formik.values.institution_type_id) {
    //     }
    // }, [formik.values.institution_type_id]);

    async function handleCreateMemberAPI(teamId) {
        const creaParam = encryptGlobal(JSON.stringify(teamId));
        const param = encryptGlobal(
            JSON.stringify({
                status: 'ACTIVE'
            })
        );

        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_API_BASE_URL}/teams/${creaParam}?Data=${param}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setTeamMemberData(response.data && response.data.data[0]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const formik = useFormik({
        initialValues: {
            student_full_name: '',
            age: '',
            // stream_id: '',
            gender: '',
            year_of_study: '',
            date_of_birth: '',
            mobile: '',
            username: '',
            email: '',
            institution_course_id: ''
        },
        validationSchema: Yup.object({
            student_full_name: Yup.string()
                .required('Please Enter Full Name')
                .max(40)
                .required()
                .matches(
                    /^[A-Za-z0-9\s]*$/,
                    'Please enter only alphanumeric characters'
                )
                .trim(),
            age: Yup.number().lessThan(31).moreThan(15),
            // .test(
            //     'age-validation',
            //     'Age must be between 14 and 25',
            //     function (value) {
            //         const currentDate = new Date();
            //         const selectedDate = new Date(
            //             this.parent.date_of_birth
            //         );

            //         if (isNaN(selectedDate.getTime())) {
            //             return false;
            //         }
            //         const age =
            //             currentDate.getFullYear() -
            //             selectedDate.getFullYear();
            //         if (isNaN(age) || age < 0) {
            //             return false;
            //         }
            //         return age >= 14 && age <= 25;
            //     }
            // )
            // .default(0),

            gender: Yup.string().required('Please select any gender'),
            email: Yup.string()
                .required('Please Enter Email Id')
                .trim()
                .matches(emailRegex, 'accept small letters only')
                .email('Enter Valid Email Id'),

            institution_course_id: Yup.string().required(
                'Please select any Program'
            ),
            year_of_study: Yup.string().required('Please select any Year'),

            mobile: Yup.string()
                .required('Please Enter Mobile Number')
                .trim()
                .matches(
                    /^\d+$/,
                    'Mobile number is not valid (Enter only digits)'
                )
                .min(10, 'Please enter valid number')
                .max(10, 'Please enter valid number'),
            date_of_birth: Yup.string().required(
                'Please select Date of Birth / Age Must be 16 to 30'
            )
        }),

        onSubmit: (values) => {
            if (
                process.env.REACT_APP_TEAM_LENGTH ==
                teamMemberData.student_count
            ) {
                openNotificationWithIcon(
                    'warning',
                    'Team Members Maximum Count All Ready Exist'
                );
            } else {
                setIsClicked(true);
                const body = {
                    team_id: id,
                    role: 'STUDENT',
                    mentor_id: MentorsId,
                    student_full_name: values.student_full_name,
                    Age: values.age,
                    // stream_id: values.stream_id,
                    Gender: values.gender,
                    year_of_study: values.year_of_study,
                    mobile: values.mobile,
                    email: values.email,
                    username: values.mobile,
                    date_of_birth: values.date_of_birth,
                    country: values.country,
                    institution_course_id: values.institution_course_id
                };
                var config = {
                    method: 'post',
                    url:
                        process.env.REACT_APP_API_BASE_URL +
                        '/students/addStudent',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${currentUser?.data[0]?.token}`
                    },
                    data: body
                };
                axios(config)
                    .then(function (response) {
                        if (response.status === 201) {
                            openNotificationWithIcon(
                                'success',
                                'Team Member Created Successfully'
                            );
                            props.history.push('/mentor/teamlist');
                        } else {
                            openNotificationWithIcon(
                                'error',
                                'Opps! Something Wrong'
                            );
                            setIsClicked(false);
                        }
                    })
                    .catch(function (error) {
                        if (error.response.status === 406) {
                            openNotificationWithIcon(
                                'error',
                                error?.response?.data?.message
                            );
                        } else {
                            openNotificationWithIcon(
                                'error',
                                'Opps! Something Wrong'
                            );
                        }
                        setIsClicked(false);
                    });
            }
        }
    });
    useEffect(() => {
        const currentDate = new Date();
        const selectedDate = new Date(formik.values.date_of_birth);

        if (!isNaN(selectedDate.getTime())) {
            const age = currentDate.getFullYear() - selectedDate.getFullYear();
            formik.setFieldValue('age', age);
        }
        // else {
        //     formik.setFieldValue('age', 0);
        // }
    }, [formik.values.date_of_birth]);
    useEffect(async () => {
        if (formik.values.institution_type_id) {
            await streamsApi();
        }
    }, [formik.values.institution_type_id]);
    const streamsApi = () => {
        const newparam = encryptGlobal(
            JSON.stringify({
                institution_id: currentUser.data[0]?.institution_id,
                institution_type_id: formik.values.institution_type_id
            })
        );

        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/institutions/Streams?Data=${newparam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    let Streamdata = response?.data?.data;
                    if (Streamdata) {
                        let StreamOptions = [];
                        Streamdata.map((item) => {
                            let option = {
                                label: item.stream_name,
                                value: item.stream_id
                            };
                            StreamOptions.push(option);
                        });
                        setStream(StreamOptions);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    useEffect(async () => {
        if (formik.values.stream_id) {
            await ProgrammeApi();
        }
    }, [formik.values.stream_id]);
    const ProgrammeApi = () => {
        const newparam = encryptGlobal(
            JSON.stringify({
                institution_id: currentUser.data[0]?.institution_id,
                institution_type_id: formik.values.institution_type_id,
                stream_id: formik.values.stream_id
            })
        );

        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/institutions/programs?Data=${newparam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    let Programmedata = response?.data?.data;
                    if (Programmedata) {
                        let ProgrammeOptions = [];
                        Programmedata.map((item) => {
                            let option = {
                                label: item.program_name,
                                value: item.institution_course_id
                            };
                            ProgrammeOptions.push(option);
                        });
                        setProgram(ProgrammeOptions);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    // console.log(formik.values.stream_id, '2');
    return (
        <Layout title="teams">
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3> Create Team Member Details</h3>
                        {/* <BreadcrumbTwo {...headingDetails} /> */}
                        {studentCount && studentCount === 'new' ? (
                            <CreateMultipleMembers id={id} />
                        ) : (
                            <div>
                                <Form
                                    onSubmit={formik.handleSubmit}
                                    isSubmitting
                                >
                                    <div className="create-ticket register-blockt">
                                        <Row>
                                            <Row>
                                                <Col md={6}>
                                                    <Label
                                                        className="name-req-create-member"
                                                        htmlFor="student_full_name"
                                                    >
                                                        {t(
                                                            'teacher_teams.student_name'
                                                        )}
                                                        <span
                                                            required
                                                            className="p-1"
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <InputBox
                                                        className={
                                                            'defaultInput'
                                                        }
                                                        placeholder={t(
                                                            'teacher_teams.student_name_pl'
                                                        )}
                                                        id="student_full_name"
                                                        name="student_full_name"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values
                                                                .student_full_name
                                                        }
                                                    />
                                                    {formik.touched
                                                        .student_full_name &&
                                                    formik.errors
                                                        .student_full_name ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .student_full_name
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>

                                                <Col md={6} className="mb-0">
                                                    <Label
                                                        className="name-req-create-member"
                                                        htmlFor="stream_id"
                                                    >
                                                        Institution Type
                                                        <span
                                                            required
                                                            className="p-1"
                                                        >
                                                            *
                                                        </span>
                                                    </Label>

                                                    <DropDownWithSearch
                                                        {...selectCategory}
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        onChange={(option) => {
                                                            formik.setFieldValue(
                                                                'institution_type_id',
                                                                option[0]?.value
                                                            );
                                                        }}
                                                        // value={
                                                        //     formik.values
                                                        //         .stream_id
                                                        // }
                                                        name="Select Institution"
                                                        id="Select Institution"
                                                    />
                                                    {formik.touched
                                                        .institution_type_id &&
                                                    formik.errors
                                                        .institution_type_id ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .institution_type_id
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={5} className="mb-0">
                                                    <Label
                                                        className="name-req-create-member"
                                                        htmlFor="stream_id"
                                                    >
                                                        Stream Type
                                                        <span
                                                            required
                                                            className="p-1"
                                                        >
                                                            *
                                                        </span>
                                                    </Label>

                                                    <DropDownWithSearch
                                                        {...selectStream}
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        onChange={(option) => {
                                                            formik.setFieldValue(
                                                                'stream_id',
                                                                option[0]?.value
                                                            );
                                                        }}
                                                        // value={
                                                        //     formik.values
                                                        //         .stream_id
                                                        // }
                                                        name="Select Stream"
                                                        id="Select Stream"
                                                    />
                                                    {formik.touched.stream_id &&
                                                    formik.errors.stream_id ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .stream_id
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col md={5} className="mb-0">
                                                    <Label
                                                        className="name-req-create-member"
                                                        htmlFor="stream_id"
                                                    >
                                                        Program Type
                                                        <span
                                                            required
                                                            className="p-1"
                                                        >
                                                            *
                                                        </span>
                                                    </Label>

                                                    <DropDownWithSearch
                                                        {...selectProgram}
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        onChange={(option) => {
                                                            formik.setFieldValue(
                                                                'institution_course_id',
                                                                option[0]?.value
                                                            );
                                                        }}
                                                        // value={
                                                        //     formik.values
                                                        //         .stream_id
                                                        // }
                                                        name="Select Program"
                                                        id="Select Program"
                                                    />
                                                    {formik.touched
                                                        .institution_course_id &&
                                                    formik.errors
                                                        .institution_course_id ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .institution_course_id
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col md={2} className="mb-0">
                                                    <Label
                                                        className="name-req-create-member"
                                                        htmlFor="year_of_study"
                                                    >
                                                        Year of Study
                                                        <span
                                                            required
                                                            className="p-1"
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <div className="dropdown CalendarDropdownComp ">
                                                        <select
                                                            className="form-control custom-dropdown"
                                                            id="year_of_study"
                                                            name="year_of_study"
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                            onBlur={
                                                                formik.handleBlur
                                                            }
                                                            value={
                                                                formik.values
                                                                    .year_of_study
                                                            }
                                                        >
                                                            <option value={''}>
                                                                Select Year
                                                            </option>
                                                            {allowedYear.map(
                                                                (item) => (
                                                                    <option
                                                                        key={
                                                                            item
                                                                        }
                                                                        value={
                                                                            item
                                                                        }
                                                                    >
                                                                        {item}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                    {formik.touched
                                                        .year_of_study &&
                                                    formik.errors
                                                        .year_of_study ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .year_of_study
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col
                                                    md={6}
                                                    className="mb-5 mb-xl-0"
                                                >
                                                    <Label
                                                        className="name-req-create-member"
                                                        htmlFor="email"
                                                    >
                                                        Email Address
                                                        <span
                                                            required
                                                            className="p-1"
                                                        >
                                                            *
                                                        </span>
                                                        {/* {t(
                                                        'teacher_teams.student_name'
                                                    )} */}
                                                        {/* <span
                                                            required
                                                            className="p-1 "
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                        >
                                                            * Note : Gmail /
                                                            Yahoo / Outlook
                                                            mails are accepted.
                                                        </span> */}
                                                    </Label>
                                                    <InputBox
                                                        className={
                                                            'defaultInput'
                                                        }
                                                        placeholder="Enter Email Address"
                                                        id="email"
                                                        name="email"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values.email
                                                        }
                                                    />

                                                    {formik.touched.email &&
                                                    formik.errors.email ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .email
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col
                                                    md={6}
                                                    className="mb-5 mb-xl-0"
                                                >
                                                    <Label
                                                        className="name-req-create-member"
                                                        htmlFor="mobile"
                                                    >
                                                        Mobile Number
                                                        <span
                                                            required
                                                            className="p-1"
                                                        >
                                                            *
                                                        </span>
                                                        {/* {t(
                                                        'teacher_teams.student_name'
                                                    )} */}
                                                        {/* <span
                                                            required
                                                            className="p-1 "
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                        >
                                                            * Note : Gmail /
                                                            Yahoo / Outlook
                                                            mails are accepted.
                                                        </span> */}
                                                    </Label>
                                                    <InputBox
                                                        className={
                                                            'defaultInput'
                                                        }
                                                        placeholder="Enter Mobile Number"
                                                        id="mobile"
                                                        name="mobile"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values.mobile
                                                        }
                                                    />

                                                    {formik.touched.mobile &&
                                                    formik.errors.mobile ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .mobile
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col
                                                    md={4}
                                                    className="mb-5 mb-xl-0"
                                                >
                                                    <Label
                                                        className="name-req-create-member"
                                                        htmlFor="date_of_birth"
                                                    >
                                                        Date of Birth
                                                        <span
                                                            required
                                                            className="p-1"
                                                        >
                                                            *
                                                        </span>
                                                        {/* {t(
                                                        'teacher_teams.student_name'
                                                    )} */}
                                                        {/* <span
                                                            required
                                                            className="p-1 "
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                        >
                                                            * Note : Gmail /
                                                            Yahoo / Outlook
                                                            mails are accepted.
                                                        </span> */}
                                                    </Label>
                                                    <InputBox
                                                        className={
                                                            'defaultInput'
                                                        }
                                                        placeholder="DD/MM/YYYY"
                                                        id="date_of_birth"
                                                        name="date_of_birth"
                                                        type="date"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values
                                                                .date_of_birth
                                                        }
                                                    />

                                                    {formik.touched
                                                        .date_of_birth &&
                                                    formik.errors
                                                        .date_of_birth ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .date_of_birth
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>

                                                <Col
                                                    md={4}
                                                    className="mb-5 mb-xl-0"
                                                >
                                                    <Label
                                                        className="name-req-create-member"
                                                        htmlFor="gender"
                                                    >
                                                        {t(
                                                            'teacher_teams.gender'
                                                        )}
                                                        <span
                                                            required
                                                            className="p-1"
                                                        >
                                                            *
                                                        </span>
                                                    </Label>

                                                    <select
                                                        name="gender"
                                                        className="form-control custom-dropdown"
                                                        value={
                                                            formik.values.gender
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                    >
                                                        <option value="">
                                                            {t(
                                                                'teacher_teams.student_gender'
                                                            )}
                                                        </option>
                                                        <option value="Male">
                                                            {t(
                                                                'teacher_teams.student_gender_male'
                                                            )}
                                                        </option>
                                                        <option value="Female">
                                                            {t(
                                                                'teacher_teams.student_gender_female'
                                                            )}
                                                        </option>
                                                        <option value="OTHERS">
                                                            Prefer not to
                                                            mention
                                                        </option>
                                                    </select>

                                                    {formik.touched.gender &&
                                                    formik.errors.gender ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .gender
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col md={4} className="mb-0">
                                                    <Label
                                                        className="name-req-create-member"
                                                        htmlFor="age"
                                                    >
                                                        {t('teacher_teams.age')}
                                                        <span
                                                            required
                                                            className="p-1"
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <div className="dropdown CalendarDropdownComp ">
                                                        <InputBox
                                                            className={
                                                                'defaultInput'
                                                            }
                                                            isDisabled={true}
                                                            // onChange={
                                                            //     formik.handleChange
                                                            // }
                                                            placeholder="Age"
                                                            id="age"
                                                            name="age"
                                                            type="text"
                                                            value={String(
                                                                formik.values
                                                                    .age
                                                            )}
                                                        />
                                                        {/* <select
                                                            className="form-control custom-dropdown"
                                                            id="age"
                                                            name="age"
                                                            // disabled={true}
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                            onBlur={
                                                                formik.handleBlur
                                                            }
                                                            value={aged}
                                                        >
                                                            <option value={''}>
                                                                Select Age
                                                            </option>
                                                            {allowedAge.map(
                                                                (item) => (
                                                                    <option
                                                                        key={
                                                                            item
                                                                        }
                                                                        value={
                                                                            item
                                                                        }
                                                                    >
                                                                        {item}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select> */}
                                                    </div>
                                                    {formik.errors.age &&
                                                    formik.errors.age ? (
                                                        <small className="error-cls">
                                                            {formik.errors.age}
                                                        </small>
                                                    ) : null}
                                                </Col>
                                            </Row>
                                        </Row>
                                    </div>

                                    <hr className="mt-4 mb-4"></hr>
                                    <Row>
                                        <Col
                                            className="mt-2"
                                            xs={12}
                                            sm={6}
                                            md={6}
                                            xl={6}
                                        >
                                            <Button
                                                label={t(
                                                    'teacher_teams.discard'
                                                )}
                                                btnClass="secondary"
                                                size="small"
                                                onClick={() =>
                                                    props.history.push(
                                                        '/mentor/teamlist'
                                                    )
                                                }
                                            />
                                        </Col>
                                        <Col
                                            className="mt-2"
                                            xs={12}
                                            sm={6}
                                            md={6}
                                            xl={6}
                                        >
                                            {!isClicked ? (
                                                <Button
                                                    label={t(
                                                        'teacher_teams.submit'
                                                    )}
                                                    type="submit"
                                                    btnClass={
                                                        !(
                                                            formik.dirty &&
                                                            formik.isValid
                                                        )
                                                            ? 'default float-end'
                                                            : 'primary float-end'
                                                    }
                                                    size="small"
                                                    disabled={
                                                        !(
                                                            formik.dirty &&
                                                            formik.isValid
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <Button
                                                    label={t(
                                                        'teacher_teams.submit'
                                                    )}
                                                    type="button"
                                                    btnClass="default"
                                                    size="small"
                                                    disabled={true}
                                                />
                                            )}
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default withRouter(CreateTeamMember);
