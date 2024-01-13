/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../Layout';
import { Container, Row, Col, Table } from 'reactstrap';
import { Button } from '../../stories/Button';
import { CSVLink } from 'react-csv';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import { useHistory } from 'react-router-dom';
import {
    getDistrictData,
    getFetchDistData
} from '../../redux/studentRegistration/actions';
import { useDispatch, useSelector } from 'react-redux';
import Select from '../../Admin/Reports/Helpers/Select';

import axios from 'axios';
import '../../Admin/Reports/reports.scss';

import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { categoryValue } from '../../Admin/Schools/constentText';

import { notification } from 'antd';
import { encryptGlobal } from '../../constants/encryptDecrypt';

const CoTeacherDetailedReport = () => {
    const currentUser = getCurrentUser('current_user');

    const [state, setstate] = React.useState(currentUser?.data[0]?.state_name);
    const [district, setdistrict] = React.useState('');

    const [category, setCategory] = useState('');
    const [isDownload, setIsDownload] = useState(false);
    const categoryData = ['All Categorys', 'ATL', 'Non ATL'];
    const [atl, setAtl] = useState('');
    const fiterDistData = useSelector(
        (state) => state?.studentRegistration?.fetchdist
    );
    const [mentorDetailedReportsData, setmentorDetailedReportsData] = useState(
        []
    );
    const [doughnutChartData, setDoughnutChartData] = useState(null);
    const history = useHistory();
    const csvLinkRef = useRef();
    const csvLinkRefTable = useRef();
    const dispatch = useDispatch();
    const [combinedArray, setCombinedArray] = useState([]);

    const [newFormat, setNewFormat] = useState('');

    const [downloadTableData, setDownloadTableData] = useState([]);
    const [barChart3Data, setBarChart3Data] = useState({
        labels: [],
        datasets: []
    });
    const [barChart1Data, setBarChart1Data] = useState({
        labels: [],
        datasets: []
    });
    const [barChart2Data, setBarChart2Data] = useState({
        labels: [],
        datasets: []
    });
    // const fullDistrictsNames = useSelector(
    //     (state) => state?.studentRegistration?.dists
    // );
    const tableHeaders = [
        {
            label: 'State Name',
            key: 'state'
        },
        {
            label: 'Total Registered Teachers',
            key: 'totalReg'
        },
        {
            label: 'Total No.of Teams created',
            key: 'totalTeams'
        },
        {
            label: 'Total No.of Students enrolled',
            key: 'totalStudents'
        },
        {
            label: 'No.of Female Students',
            key: 'femaleStudents'
        },
        {
            label: 'No.of Male Students',
            key: 'maleStudents'
        },
        {
            label: 'No.of Teachers completed the course',
            key: 'courseCompleted'
        },
        {
            label: 'No.of Teachers course IN Progress',
            key: 'courseINcompleted'
        },
        {
            label: 'No.of Teachers NOT Started Course',
            key: 'courseNotStarted'
        }
    ];
    const teacherDetailsHeaders = [
        {
            label: 'ATL CODE',
            key: 'ATL code'
        },
        {
            label: 'UDISE CODE',
            key: 'UDISE code'
        },
        {
            label: 'School Name',
            key: 'School Name'
        },
        {
            label: 'School Type/Category',
            key: 'category'
        },
        {
            label: 'State',
            key: 'state'
        },
        {
            label: 'District',
            key: 'district'
        },
        {
            label: 'City',
            key: 'city'
        },
        {
            label: 'HM Name',
            key: 'HM Name'
        },
        {
            label: 'HM Contact',
            key: 'HM Contact'
        },
        {
            label: 'Teacher Name',
            key: 'Teacher Name'
        },
        {
            label: 'Teacher Email',
            key: 'Teacher Email'
        },
        {
            label: 'Teacher Gender',
            key: 'Teacher Gender'
        },
        {
            label: 'Teacher Contact',
            key: 'Teacher Contact'
        },
        {
            label: 'Teacher WhatsApp Contact',
            key: 'Teacher WhatsApp Contact'
        },
        {
            label: 'Course Status',
            key: 'Course Status'
        },
        {
            label: 'Post Survey Status',
            key: 'Post Survey Status'
        },
        {
            label: 'NO.of Teams Created',
            key: 'team_count'
        },
        {
            label: 'No.of Students Enrollrd',
            key: 'student_count'
        },
        {
            label: 'No.of Students Course Completed',
            key: 'countop'
        },
        {
            label: 'No.of Students Course Inprogress',
            key: 'courseinprogess'
        },
        {
            label: 'No.of Students Course Not Started',
            key: 'courseNotStarted'
        },
        {
            label: 'No.of Teams Idea Submitted',
            key: 'submittedcout'
        },
        {
            label: 'No.of Teams Idea in Draft',
            key: 'draftcout'
        },
        {
            label: 'No.of Teams Idea NOt Initiated',
            key: 'ideanotIN'
        }
    ];

    useEffect(() => {
        // dispatch(getDistrictData());
        dispatch(getFetchDistData(currentUser?.data[0]?.state_name));
        fetchChartTableData();
        const newDate = new Date();
        const formattedDate = `${newDate.getUTCDate()}/${
            1 + newDate.getMonth()
        }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
        setNewFormat(formattedDate);
    }, []);

    const chartOption = {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            labels: {
                fontColor: 'black'
            }
        }
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10
                },
                title: {
                    display: true,
                    text: 'Number of Students & Teams',
                    color: 'blue'
                }
            },
            x: {
                grid: {
                    display: true,
                    drawBorder: true,
                    color: 'rgba(0, 0, 0, 0.2)',
                    lineWidth: 0.5
                },
                title: {
                    display: true,
                    text: 'States',
                    color: 'blue'
                },
                ticks: {
                    maxRotation: 80,
                    autoSkip: false
                    //maxTicksLimit: 10,
                }
            }
        }
    };
    const stackedBarChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'States',
                    color: 'blue'
                },
                ticks: {
                    autoSkip: false,
                    maxRotation: 85
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                stepSize: 10,
                title: {
                    display: true,
                    text: 'Number of Teachers',
                    color: 'blue'
                },
                grid: {
                    display: true,
                    drawBorder: true,
                    color: 'rgba(0, 0, 0, 0.2)',
                    lineWidth: 0.5
                }
            }
        }
    };
    const optionsStudent = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10
                },
                title: {
                    display: true,
                    text: 'Number of ATL v/s Non ATl Students ',
                    color: 'blue'
                }
            },
            x: {
                grid: {
                    display: true,
                    drawBorder: true,
                    color: 'rgba(0, 0, 0, 0.2)',
                    lineWidth: 0.5
                },
                title: {
                    display: true,
                    text: 'States',
                    color: 'blue'
                },
                ticks: {
                    maxRotation: 80,
                    autoSkip: false
                    //maxTicksLimit: 10,
                }
            }
        }
    };
    useEffect(() => {
        nonAtlCount();
    }, []);
    const nonAtlCount = () => {
        const tecSt = encryptGlobal(
            JSON.stringify({
                state: currentUser?.data[0]?.state_name
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/reports/studentATLnonATLcount?Data=${tecSt}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (res) {
                if (res.status === 200) {
                   
                    var mentorStuArray = [];
                    res &&
                        res.data &&
                        res.data.data &&
                        res.data.data.map((students, index) => {
                            var key = index + 1;
                            return mentorStuArray.push({ ...students, key });
                        });
                    setAtl(mentorStuArray);
                    

                    // setAtl(response.data.data);
                    const barStudentData = {
                        labels: mentorStuArray.map((item) => item.state),
                        datasets: [
                            {
                                label: 'No.of  ATL Students',
                                data: mentorStuArray.map(
                                    (item) => item.ATL_Student_Count
                                ),
                                backgroundColor: 'rgba(255, 0, 0, 0.6)'
                            },
                            {
                                label: 'No.of Non ATL Students',
                                data: mentorStuArray.map(
                                    (item) => item.NONATL_Student_Count
                                ),
                                backgroundColor: 'rgba(75, 162, 192, 0.6)'
                            }
                        ]
                    };
                    setBarChart3Data(barStudentData);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const handleDownload = () => {
        if (
            // !district ||
            !category
        ) {
            notification.warning({
                message:
                    'Please select a district, category type before Downloading Reports.'
            });
            return;
        }
        setIsDownload(true);
        fetchData();
    };
    const fetchData = () => {
        const apiParam = encryptGlobal(
            JSON.stringify({
                state: state,
                district: district === '' ? 'All Districts' : district,
                category: category
            })
        );
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/reports/mentordetailsreport?Data=${apiParam}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    const newdatalist = response.data.data.map((item) => {
                        const dataList = { ...item };
                        dataList['presurveyNotStarted'] =
                            item['student_count'] - item['preSur_cmp'];
                        dataList['courseNotStarted'] =
                            item['student_count'] -
                            (item['countop'] + item['courseinprogess']);
                        dataList['ideanotIN'] =
                            item['team_count'] -
                            (item['submittedcout'] + item['draftcout']);
                        return dataList;
                    });

                    setmentorDetailedReportsData(newdatalist);
                    openNotificationWithIcon(
                        'success',
                        `School Detailed Reports Downloaded Successfully`
                    );
                    csvLinkRef.current.link.click();
                    setIsDownload(false);
                }
            })
            .catch(function (error) {
                console.log(error);
                setIsDownload(false);
            });
    };

    const fetchChartTableData = () => {
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/reports/mentordetailstable?state=${currentUser?.data[0]?.state_name}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const summary = response.data.data[0].summary;
                    const teamCount = response.data.data[0].teamCount;
                    const studentCountDetails =
                        response.data.data[0].studentCountDetails;
                    const courseCompleted =
                        response.data.data[0].courseCompleted;
                    const courseINcompleted =
                        response.data.data[0].courseINcompleted;

                    const combinedArray = summary.map((summaryItem) => {
                        const state = summaryItem.state;
                        const teamCountItem = teamCount.find(
                            (item) => item.state === state
                        );
                        const studentCountItem = studentCountDetails.find(
                            (item) => item.state === state
                        );
                        const courseCompletedItem = courseCompleted.find(
                            (item) => item.state === state
                        );
                        const courseINcompletedItem = courseINcompleted.find(
                            (item) => item.state === state
                        );
                        const courseNotStarted =
                            summaryItem.totalReg -
                            ((courseCompletedItem
                                ? courseCompletedItem.courseCMP
                                : 0) +
                                (courseINcompletedItem
                                    ? courseINcompletedItem.courseIN
                                    : 0));

                        return {
                            state,
                            totalReg: summaryItem.totalReg,
                            totalTeams: teamCountItem
                                ? teamCountItem.totalTeams
                                : 0,
                            totalStudents: studentCountItem
                                ? studentCountItem.totalstudent
                                : 0,
                            maleStudents: studentCountItem
                                ? parseInt(studentCountItem.male)
                                : 0,
                            femaleStudents: studentCountItem
                                ? parseInt(studentCountItem.female)
                                : 0,
                            courseCompleted: courseCompletedItem
                                ? courseCompletedItem.courseCMP
                                : 0,
                            courseINcompleted: courseINcompletedItem
                                ? courseINcompletedItem.courseIN
                                : 0,
                            courseNotStarted
                        };
                    });

                    const doughnutData = {
                        labels: ['Male', 'Female'],
                        datasets: [
                            {
                                data: [
                                    combinedArray[0].maleStudents,
                                    combinedArray[0].femaleStudents
                                ],
                                backgroundColor: ['#36A2EB', '#FF6384'],
                                hoverBackgroundColor: ['#36A2EB', '#FF6384']
                            }
                        ]
                    };

                    const barData = {
                        labels: combinedArray.map((item) => item.state),
                        datasets: [
                            {
                                label: 'No.of Students Enrolled',
                                data: combinedArray.map(
                                    (item) => item.totalStudents
                                ),
                                backgroundColor: 'rgba(255, 0, 0, 0.6)'
                            },
                            {
                                label: 'No. of Teams created',
                                data: combinedArray.map(
                                    (item) => item.totalTeams
                                ),
                                backgroundColor: 'rgba(75, 162, 192, 0.6)'
                            }
                        ]
                    };

                    const stackedBarChartData = {
                        labels: combinedArray.map((item) => item.state),
                        datasets: [
                            {
                                label: 'No. of Teachers not started course',
                                data: combinedArray.map(
                                    (item) => item.courseNotStarted
                                ),
                                backgroundColor: 'rgba(255, 0, 0, 0.6)'
                            },
                            {
                                label: 'No. of Teachers course IN progress',
                                data: combinedArray.map(
                                    (item) => item.courseINcompleted
                                ),
                                backgroundColor: 'rgba(255, 255, 0, 0.6)'
                            },
                            {
                                label: 'No. of teachers Completed Course',
                                data: combinedArray.map(
                                    (item) => item.courseCompleted
                                ),
                                backgroundColor: 'rgba(0, 128, 0, 0.6)'
                            }
                        ]
                    };
                    setCombinedArray(combinedArray);
                    setDownloadTableData(combinedArray);
                    setDoughnutChartData(doughnutData);
                    setBarChart1Data(barData);
                    setBarChart2Data(stackedBarChartData);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };

    return (
        <>
            <Layout>
                <Container className="RegReports mt-4 mb-30 userlist">
                    <Row className="mt-0 pt-2">
                        <Col>
                            <h2>School Progress Detailed Report</h2>
                        </Col>
                        <Col className="text-right mb-1">
                            <Button
                                label="Back"
                                btnClass="primary mx-3"
                                size="small"
                                shape="btn-square"
                                onClick={() =>
                                    history.push('/coordinator/report')
                                }
                            />
                        </Col>
                        <div className="reports-data p-5 mt-4 mb-5 bg-white">
                            <Row className="align-items-center">
                                <Col md={2}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <p>{state}</p>
                                        {/* <Select
                                            list={fullDistrictsNames}
                                            setValue={setdistrict}
                                            placeHolder={'Select District'}
                                            value={district}
                                        /> */}
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={fiterDistData}
                                            setValue={setdistrict}
                                            placeHolder={'Select District'}
                                            value={district}
                                        />
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={categoryData}
                                            setValue={setCategory}
                                            placeHolder={'Select Category'}
                                            value={category}
                                        />
                                    </div>
                                </Col>
                                <Col
                                    md={2}
                                    className="d-flex align-items-center justify-content-center"
                                >
                                    {/* <Button
                                        label="View Details"
                                        btnClass="primary mx-3"
                                        size="small"
                                        shape="btn-square"
                                        onClick={() =>
                                            fetchData(
                                                'Teachers Course Completion List'
                                            )
                                        }
                                        style={{
                                            width: '150px',
                                            whiteSpace: 'nowrap'
                                        }}
                                    /> */}

                                    <Button
                                        onClick={handleDownload}
                                        label={
                                            isDownload
                                                ? 'Downloading'
                                                : 'Download Report'
                                        }
                                        btnClass="primary mx-3"
                                        size={'small'}
                                        shape="btn-square"
                                        type="submit"
                                        style={{
                                            width: '150px',
                                            whiteSpace: 'nowrap'
                                        }}
                                        disabled={isDownload}
                                    />
                                </Col>
                            </Row>
                            <div className="chart">
                                {combinedArray.length > 0 && (
                                    <div className="mt-5">
                                        <div className="d-flex align-items-center mb-3">
                                            <h3>OVERVIEW</h3>
                                            <Button
                                                label="Download Table"
                                                btnClass="primary mx-2"
                                                size="small"
                                                shape="btn-square"
                                                onClick={() => {
                                                    if (downloadTableData) {
                                                        setDownloadTableData(
                                                            null
                                                        );
                                                        csvLinkRefTable.current.link.click();
                                                    }
                                                }}
                                                style={{
                                                    width: '150px',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-7">
                                                <div
                                                    className="table-wrapper bg-white"
                                                    style={{
                                                        overflowX: 'auto'
                                                    }}
                                                >
                                                    <Table
                                                        id="dataTable"
                                                        className="table table-striped table-bordered responsive"
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>
                                                                    State Name
                                                                </th>
                                                                <th>
                                                                    Total
                                                                    Registered
                                                                    Teachers
                                                                </th>
                                                                <th>
                                                                    Total of
                                                                    No.of Teams
                                                                    Created
                                                                </th>
                                                                <th>
                                                                    Total of
                                                                    No.of
                                                                    Students
                                                                    Enrolled
                                                                </th>
                                                                <th>
                                                                    No.of Female
                                                                    Students
                                                                </th>
                                                                <th>
                                                                    No.of Male
                                                                    Students
                                                                </th>
                                                                <th>
                                                                    No.of
                                                                    Teachers
                                                                    Completed
                                                                    the course
                                                                </th>
                                                                <th>
                                                                    No.of
                                                                    Teachers
                                                                    course IN
                                                                    Progress
                                                                </th>
                                                                <th>
                                                                    No.of
                                                                    Teachers NOT
                                                                    started
                                                                    course
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {combinedArray.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {index +
                                                                                1}
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.state
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.totalReg
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.totalTeams
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.totalStudents
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.femaleStudents
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.maleStudents
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.courseCompleted
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.courseINcompleted
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.courseNotStarted
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="row">
                                                    <div className="col-md-12 text-center mt-1">
                                                        <p
                                                            style={{
                                                                whiteSpace:
                                                                    'nowrap',
                                                                paddingLeft:
                                                                    '10px'
                                                            }}
                                                        >
                                                            <b>
                                                                Students Male vs
                                                                Female As of{' '}
                                                                {newFormat}
                                                            </b>
                                                        </p>
                                                    </div>
                                                    <div className="col-md-5 doughnut-chart-container">
                                                        {doughnutChartData && (
                                                            <Doughnut
                                                                data={
                                                                    doughnutChartData
                                                                }
                                                                options={
                                                                    chartOption
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="col-md-6 chart-container mt-1"
                                                style={{
                                                    width: '100%',
                                                    height: '370px'
                                                }}
                                            >
                                                <div className="chart-box">
                                                    <Bar
                                                        data={barChart1Data}
                                                        options={options}
                                                    />
                                                    <div className="chart-title">
                                                        <p>
                                                            <b>
                                                                Teams, Students
                                                                Enrolled As of
                                                                {newFormat}
                                                            </b>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="col-md-6 chart-container mt-3"
                                                style={{
                                                    width: '100%',
                                                    height: '370px'
                                                }}
                                            >
                                                <div className="chart-box">
                                                    <Bar
                                                        data={barChart2Data}
                                                        options={
                                                            stackedBarChartOptions
                                                        }
                                                    />
                                                    <div className="chart-title">
                                                        <p>
                                                            <b>
                                                                Teacher Course
                                                                Status As of
                                                                {newFormat}
                                                            </b>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="col-md-6 chart-container mt-5"
                                                style={{
                                                    width: '100%',
                                                    height: '370px'
                                                }}
                                            >
                                                <div className="chart-box">
                                                    <Bar
                                                        data={barChart3Data}
                                                        options={optionsStudent}
                                                    />
                                                    <div className="chart-title">
                                                        <p>
                                                            <b>
                                                                No.of Students
                                                                Enrolled in ATL
                                                                v/s Non ATL
                                                                Schools{' '}
                                                                {newFormat}
                                                            </b>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {downloadTableData && (
                                    <CSVLink
                                        data={downloadTableData}
                                        headers={tableHeaders}
                                        // filename={`Teacher_Detailed_Summary_Reports.csv`}
                                        filename={`SchoolDetailedSummaryReport_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRefTable}
                                    >
                                        Download Table CSV
                                    </CSVLink>
                                )}

                                {mentorDetailedReportsData && (
                                    <CSVLink
                                        headers={teacherDetailsHeaders}
                                        data={mentorDetailedReportsData}
                                        // filename={`Teacher Detailed Reports.csv`}
                                        filename={`SchoolDetailedReport_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRef}
                                    >
                                        Download Not Registered CSV
                                    </CSVLink>
                                )}
                            </div>
                        </div>
                    </Row>
                </Container>
            </Layout>
        </>
    );
};
export default CoTeacherDetailedReport;
