/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../Layout';
import { Container, Row, Col, Table } from 'reactstrap';
import { Button } from '../../../stories/Button';
import { CSVLink } from 'react-csv';
import {
    openNotificationWithIcon,
    getCurrentUser
} from '../../../helpers/Utils';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';
import {
    getDistrictData,
    getStateData,
    getFetchDistData
} from '../../../redux/studentRegistration/actions';
import { useDispatch, useSelector } from 'react-redux';
import Select from '../Helpers/Select';
import axios from 'axios';
import { categoryValue } from '../../Schools/constentText';
import '../reports.scss';
import { Doughnut } from 'react-chartjs-2';
import { notification } from 'antd';
import { encryptGlobal } from '../../../constants/encryptDecrypt';

const ReportsRegistration = () => {
    const stackedBarChart = {
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
                stepSize: 20,
                title: {
                    display: true,
                    text: 'Number of Students',
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
                    text: 'Districts',
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
                stepSize: 20,
                title: {
                    display: true,
                    text: 'Number of Mentors',
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
    const [RegTeachersState, setRegTeachersState] = React.useState('');

    const [RegTeachersdistrict, setRegTeachersdistrict] = React.useState('');
    const [category, setCategory] = useState('');
    const categoryData = ['All Categorys', 'ATL', 'Non ATL'];
    // const categoryData =
    //     categoryValue[process.env.REACT_APP_LOCAL_LANGUAGE_CODE];

    const [downloadData, setDownloadData] = useState(null);
    const csvLinkRef = useRef();
    const csvLinkRefTable = useRef();
    const dispatch = useDispatch();
    const history = useHistory();
    const currentUser = getCurrentUser('current_user');
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [combinedArray, setCombinedArray] = useState([]);
    const [downloadTableData, setDownloadTableData] = useState([]);
    const [totalCount, setTotalCount] = useState([]);
    const [doughnutChart1Data, setDoughnutChart1Data] = useState(null);
    const [doughnutChart2Data, setDoughnutChart2Data] = useState(null);
    const [newFormat, setNewFormat] = useState('');
    const [barChart1Data, setBarChart1Data] = useState({
        labels: [],
        datasets: []
    });
    const [barChart2Data, setBarChart2Data] = useState({
        labels: [],
        datasets: []
    });
    const fullStatesNames = useSelector(
        (state) => state?.studentRegistration?.regstate
    );
    const fiterDistData = useSelector(
        (state) => state?.studentRegistration?.fetchdist
    );
    const fullDistrictsNames = useSelector(
        (state) => state?.studentRegistration?.dists
    );
    // useEffect(() => {
    //     dispatch(getStateData());
    // }, []);
    // useEffect(() => {
    //     if (RegTeachersState !== '') {
    //         dispatch(getFetchDistData(RegTeachersState));
    //     }
    //     setRegTeachersdistrict('');
    //     fetchChartTableData();
    // }, [RegTeachersState]);
    useEffect(() => {
        // if (RegTeachersState !== '') {
        dispatch(getFetchDistData());
        // }
        // setRegTeachersdistrict('');
        fetchChartTableData();
    }, []);
    const studentTableHeaders = [
        {
            label: 'District Name',
            key: 'district_name'
        },
        {
            label: 'Total No.Of TEAMS created',
            key: 'totalTeams'
        },
        {
            label: 'Total No.Of STUDENTS enrolled',
            key: 'totalStudents'
        },
        // {
        //     label: 'No.Of Students completed the Course',
        //     key: 'courseCompleted'
        // },
        // {
        //     label: 'No.Of Students course In Progress',
        //     key: 'courseInProgress'
        // },
        // {
        //     label: 'No.Of students NOT STARTED Course',
        //     key: 'courseNotStarted'
        // },
        {
            label: ' No.Of TEAMS SUBMITTED IDEAS',
            key: 'submittedCount'
        },
        {
            label: 'No.Of Teams IDEAS IN DRAFT',
            key: 'draftCount'
        },
        {
            label: 'No.Of Teams NOT STARTED IDEAS SUBMISSION',
            key: 'ideaNotStarted'
        },
        // {
        //     label: 'Course Completion Percentage',
        //     key: 'coursePercentage'
        // },
        {
            label: 'IDEA Submission Percentage',
            key: 'ideaSubmissionPercentage'
        }
    ];

    const studentDetailsHeaders = [
        {
            label: 'Institution Unique Code',
            key: 'institution_code'
        },
        {
            label: 'Institution Name',
            key: 'institution_name'
        },

        {
            label: 'Place',
            key: 'place_name'
        },
        {
            label: 'Block',
            key: 'block_name'
        },
        {
            label: 'District',
            key: 'district_name'
        },

        {
            label: 'State',
            key: 'state_name'
        },
        {
            label: 'Principal Name',
            key: 'principal_name'
        },
        {
            label: 'Principal Mobile Number',
            key: 'principal_mobile'
        },
        {
            label: 'Principal Whatsapp Number',
            key: 'principal_whatsapp_mobile'
        },
        {
            label: 'Principal Email',
            key: 'principal_email'
        },
        // {
        //     label: 'Mentor Name',
        //     key: 'Teacher Name'
        // },
        {
            label: 'Mentor Name',
            key: 'mentor_name'
        },
        {
            label: 'Email ID',
            key: 'mentor_email'
        },
        // {
        //     label: 'Mentor Gender',
        //     key: 'gender'
        // },
        {
            label: 'Mentor Mobile Number',
            key: 'mentor_mobile'
        },
        // {
        //     label: 'Mentor WhatsApp No',
        //     key: 'mentor_whatapp_mobile'
        // },
        {
            label: 'Team Name',
            key: 'team_name'
        },
        {
            label: 'Student Name',
            key: 'student_full_name'
        },
        {
            label: 'Student Mobile Number',
            key: 'mobile'
        },
        {
            label: 'Student Email',
            key: 'email'
        },
        {
            label: 'Age',
            key: 'Age'
        },
        {
            label: 'Gender',
            key: 'Gender'
        },
        {
            label: 'Year of study',
            key: 'year_of_study'
        },
        // {
        //     label: 'Disability status',
        //     key: 'Disability status'
        // },
        // {
        //     label: 'Course Completion%',
        //     key: 'Course Completion'
        // },
        // {
        //     label: 'Course Status',
        //     key: 'Course Status'
        // },
        {
            label: 'Idea Status',
            key: 'idea_status'
        }
        // {
        //     label: 'Post-Survey Status',
        //     key: 'Post Survey Status'
        // }
    ];
    // useEffect(() => {
    //     dispatch(getDistrictData());
    //     fetchChartTableData();
    // }, []);

    const chartOption = {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            labels: {
                fontColor: 'black'
            }
        },
        plugins: {
            legend: {
                labels: {
                    generateLabels: function (chart) {
                        return chart.data.labels.map(function (label, i) {
                            const value = chart.data.datasets[0].data[i];
                            const backgroundColor =
                                chart.data.datasets[0].backgroundColor[i];
                            return {
                                text: label + ': ' + value,
                                fillStyle: backgroundColor
                            };
                        });
                    }
                }
            }
        }
    };
    const chartOptions = {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            labels: {
                fontColor: 'black'
            }
        },
        plugins: {
            legend: {
                labels: {
                    generateLabels: function (chart) {
                        return chart.data.labels.map(function (label, i) {
                            const value = chart.data.datasets[0].data[i];
                            const backgroundColor =
                                chart.data.datasets[0].backgroundColor[i];
                            return {
                                text: label + ': ' + value,
                                fillStyle: backgroundColor
                            };
                        });
                    }
                }
            }
        }
    };

    const fetchData = () => {
        const param = encryptGlobal(
            JSON.stringify({
                // state: RegTeachersState,
                district_name:
                    RegTeachersdistrict === ''
                        ? 'All Districts'
                        : RegTeachersdistrict
                // category: category
            })
        );
        const url = `/reports/studentdetailsreport?Data=${param}`;

        const config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const newdatalist = response.data.data.map((item) => {
                        const dataList = { ...item };
                        if (item['Post Survey Status'] === 'ACTIVE') {
                            dataList['Post Survey Status'] = 'Completed';
                        }
                        if (item['Pre Survey Status'] === 'ACTIVE') {
                            dataList['Pre Survey Status'] = 'Completed';
                        }
                        const coursePre = Math.round(
                            (item.course_status / 34) * 100
                        );
                        dataList['Course Completion'] = `${coursePre}%`;
                        if (coursePre >= 100) {
                            dataList['Course Status'] = 'Completed';
                        } else if (coursePre < 100 && coursePre > 0) {
                            dataList['Course Status'] = 'In Progress';
                        } else {
                            dataList['Course Status'] = 'Not Started';
                        }
                        return dataList;
                    });
                    setDownloadData(newdatalist);
                    csvLinkRef.current.link.click();
                    openNotificationWithIcon(
                        'success',
                        `Student Detailed Reports Downloaded Successfully`
                    );
                    setIsDownloading(false);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
                setIsDownloading(false);
            });
    };

    const handleDownload = () => {
        // if (
        //     // !RegTeachersState |
        //     !RegTeachersdistrict
        //     // !category
        // ) {
        //     notification.warning({
        //         message:
        //             'Please select district type before Downloading Reports.'
        //     });
        //     return;
        // }
        setIsDownloading(true);
        fetchData();
    };

    useEffect(() => {
        if (downloadComplete) {
            setDownloadComplete(false);
            setRegTeachersdistrict('');
            // setRegTeachersState('');
        }
        const newDate = new Date();
        const formattedDate = `${newDate.getUTCDate()}/${
            1 + newDate.getMonth()
        }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
        setNewFormat(formattedDate);
    }, [downloadComplete]);

    const fetchChartTableData = () => {
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/reports/studentdetailstable',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    // console.log(response);
                    const summary = response.data.data[0].summary;
                    const studentCountDetails =
                        response.data.data[0].studentCountDetails;
                    // const courseCompleted =
                    //     response.data.data[0].courseCompleted;
                    // const courseINprogesss =
                    //     response.data.data[0].courseINprogesss;
                    const submittedCount = response.data.data[0].submittedCount;
                    const draftCount = response.data.data[0].draftCount;

                    const combinedArray = summary.map((summaryItem) => {
                        const district_name = summaryItem.district_name;
                        const totalTeams = summaryItem.totalTeams;
                        const studentCountItem = studentCountDetails.find(
                            (item) => item.district_name === district_name
                        );
                        // const courseCompletedItem = courseCompleted.find(
                        //     (item) => item.state === state
                        // );
                        // const courseInProgressItem = courseINprogesss.find(
                        //     (item) => item.state === state
                        // );
                        // const courseNotStarted = studentCountItem
                        //     ? studentCountItem.totalstudent -
                        //       (courseCompletedItem
                        //           ? courseCompletedItem.studentCourseCMP
                        //           : 0) -
                        //       (courseInProgressItem
                        //           ? courseInProgressItem.studentCourseIN
                        //           : 0)
                        //     : 0;

                        const submittedCountItem = submittedCount.find(
                            (item) => item.district_name === district_name
                        );
                        const draftCountItem = draftCount.find(
                            (item) => item.district_name === district_name
                        );
                        const ideaNotStarted =
                            summaryItem.totalTeams -
                            ((submittedCountItem
                                ? submittedCountItem.submittedCount
                                : 0) +
                                (draftCountItem
                                    ? draftCountItem.draftCount
                                    : 0));

                        // const coursePercentage =
                        //     studentCountItem &&
                        //     studentCountItem.totalstudent > 0
                        //         ? Math.round(
                        //               ((courseCompletedItem
                        //                   ? courseCompletedItem.studentCourseCMP
                        //                   : 0) /
                        //                   studentCountItem.totalstudent) *
                        //                   100
                        //           )
                        //         : 0;
                        const ideaSubmissionPercentage =
                            totalTeams > 0
                                ? Math.round(
                                      ((submittedCountItem
                                          ? submittedCountItem.submittedCount
                                          : 0) /
                                          totalTeams) *
                                          100
                                  )
                                : 0;

                        return {
                            district_name,
                            totalTeams,
                            totalStudents: studentCountItem
                                ? studentCountItem.totalstudent
                                : 0,
                            // courseCompleted: courseCompletedItem
                            //     ? courseCompletedItem.studentCourseCMP
                            //     : 0,
                            // courseInProgress: courseInProgressItem
                            //     ? courseInProgressItem.studentCourseIN
                            //     : 0,
                            // courseNotStarted,
                            submittedCount: submittedCountItem
                                ? submittedCountItem.submittedCount
                                : 0,
                            draftCount: draftCountItem
                                ? draftCountItem.draftCount
                                : 0,
                            ideaNotStarted,
                            // coursePercentage,
                            ideaSubmissionPercentage
                        };
                    });

                    const total = combinedArray.reduce(
                        (acc, item) => {
                            acc.totalTeams += item.totalTeams;
                            acc.totalStudents += item.totalStudents;
                            // acc.courseCompleted += item.courseCompleted;
                            // acc.courseInProgress += item.courseInProgress;
                            acc.submittedCount += item.submittedCount;
                            acc.draftCount += item.draftCount;
                            // acc.courseNotStarted =
                            //     acc.totalStudents -
                            //     (acc.courseCompleted + acc.courseInProgress);
                            acc.ideaNotStarted =
                                acc.totalTeams -
                                (acc.submittedCount + acc.draftCount);
                            acc.ideaSubmissionPercentage = (
                                (acc.submittedCount / acc.totalTeams) *
                                100
                            ).toFixed(2);
                            return acc;
                        },
                        {
                            totalTeams: 0,
                            totalStudents: 0,
                            // courseCompleted: 0,
                            // courseInProgress: 0,
                            submittedCount: 0,
                            draftCount: 0,
                            // courseNotStarted: 0,
                            ideaNotStarted: 0,
                            ideaSubmissionPercentage: 0
                        }
                    );
                    const doughNutData1 = {
                        labels: ['Completed', 'IN Progress', 'NOT Started'],
                        datasets: [
                            {
                                data: [
                                    total.courseCompleted,
                                    total.courseInProgress,
                                    total.courseNotStarted
                                ],
                                backgroundColor: [
                                    '#36A2EB',
                                    '#FFCE56',
                                    '#FF6384'
                                ],
                                hoverBackgroundColor: [
                                    '#36A2EB',
                                    '#FFCE56',
                                    '#FF6384'
                                ]
                            }
                        ]
                    };
                    const doughNutData2 = {
                        labels: [
                            'Submitted Ideas',
                            'IN Draft Ideas',
                            'NOT Started Idea Submission'
                        ],
                        datasets: [
                            {
                                data: [
                                    total.submittedCount,
                                    total.draftCount,
                                    total.ideaNotStarted
                                ],
                                backgroundColor: [
                                    '#36A2EB',
                                    '#FFCE56',
                                    '#FF6384'
                                ],
                                hoverBackgroundColor: [
                                    '#36A2EB',
                                    '#FFCE56',
                                    '#FF6384'
                                ]
                            }
                        ]
                    };

                    const stackedBarChart1Data = {
                        labels: combinedArray.map((item) => item.state),
                        datasets: [
                            {
                                label: 'No of Students Completed Course',
                                data: combinedArray.map(
                                    (item) => item.courseCompleted
                                ),
                                backgroundColor: 'Lightgreen'
                            },
                            {
                                label: 'No of Students Course In progress',
                                data: combinedArray.map(
                                    (item) => item.courseInProgress
                                ),
                                backgroundColor: 'Yellow'
                            },
                            {
                                label: 'No of Students Not Started Course',
                                data: combinedArray.map(
                                    (item) => item.courseNotStarted
                                ),
                                backgroundColor: 'Red'
                            }
                        ]
                    };

                    const stackedBarChart2Data = {
                        labels: combinedArray.map((item) => item.district_name),
                        datasets: [
                            {
                                label: 'No of Teams Submitted Ideas',
                                data: combinedArray.map(
                                    (item) => item.submittedCount
                                ),
                                backgroundColor: 'Lightgreen'
                            },
                            {
                                label: 'No of Team Ideas in Draft',
                                data: combinedArray.map(
                                    (item) => item.draftCount
                                ),
                                backgroundColor: 'Yellow'
                            },
                            {
                                label: 'No of Teams Not Started Idea Submission',
                                data: combinedArray.map(
                                    (item) => item.ideaNotStarted
                                ),
                                backgroundColor: 'Red'
                            }
                        ]
                    };
                    var array = combinedArray;
                    array.push({ district_name: 'Total Count', ...total });
                    setCombinedArray(array);
                    // setCombinedArray(combinedArray);
                    setDownloadTableData(combinedArray);
                    setDoughnutChart1Data(doughNutData1);
                    setDoughnutChart2Data(doughNutData2);
                    setBarChart1Data(stackedBarChart1Data);
                    setBarChart2Data(stackedBarChart2Data);
                    setTotalCount(total);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };

    return (
        <>
            <Layout title="Reports">
                <Container className="RegReports mt-4 mb-30 userlist">
                    <Row className="mt-0 pt-2">
                        <Col>
                            <h2>Students Progress Detailed Report</h2>
                        </Col>
                        <Col className="text-right mb-1">
                            <Button
                                label="Back"
                                btnClass="primary mx-3"
                                size="small"
                                shape="btn-square"
                                onClick={() => history.push('/admin/reports')}
                            />
                        </Col>
                        <div className="reports-data p-5 mt-4 mb-5 bg-white">
                            <Row className="align-items-center">
                                {/* <Col md={3}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={fullStatesNames}
                                            setValue={setRegTeachersState}
                                            placeHolder={'Select State'}
                                            value={RegTeachersState}
                                        />
                                    </div>
                                </Col> */}
                                <Col md={3}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={fiterDistData}
                                            setValue={setRegTeachersdistrict}
                                            placeHolder={'Select District'}
                                            value={RegTeachersdistrict}
                                        />
                                    </div>
                                </Col>
                                {/* <Col md={3}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={categoryData}
                                            setValue={setCategory}
                                            placeHolder={'Select Category'}
                                            value={category}
                                        />
                                    </div>
                                </Col> */}
                                <Col
                                    md={3}
                                    className="d-flex align-items-center justify-content-center"
                                >
                                    <Button
                                        onClick={handleDownload}
                                        label={
                                            downloadComplete
                                                ? 'Download Complete'
                                                : isDownloading
                                                ? 'Downloading...'
                                                : 'Download Report'
                                        }
                                        btnClass="primary mx-3"
                                        size="small"
                                        shape="btn-square"
                                        type="submit"
                                        style={{
                                            width: '160px',
                                            whiteSpace: 'nowrap',
                                            pointerEvents: isDownloading
                                                ? 'none'
                                                : 'auto'
                                        }}
                                        disabled={isDownloading}
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
                                            <div className="col-md-12 mx-10 px-10">
                                                <div
                                                    className="table-wrapper bg-white "
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
                                                                    District
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    Total No.Of
                                                                    TEAMS
                                                                    created
                                                                </th>
                                                                <th>
                                                                    Total No.Of
                                                                    STUDENTS
                                                                    enrolled
                                                                </th>
                                                                {/* <th>
                                                                    No.Of
                                                                    Students
                                                                    completed
                                                                    the Course
                                                                </th>
                                                                <th>
                                                                    No.Of
                                                                    Students
                                                                    course In
                                                                    Progress
                                                                </th>
                                                                <th>
                                                                    No.Of
                                                                    students NOT
                                                                    STARTED
                                                                    Course
                                                                </th> */}
                                                                <th>
                                                                    No.Of TEAMS
                                                                    SUBMITTED
                                                                    IDEAS
                                                                </th>
                                                                <th>
                                                                    No.Of Teams
                                                                    IDEAS IN
                                                                    DRAFT
                                                                </th>
                                                                <th>
                                                                    No.Of Teams
                                                                    NOT STARTED
                                                                    IDEAS
                                                                    SUBMISSION
                                                                </th>
                                                                {/* <th>
                                                                    Course
                                                                    Completion
                                                                    Percentage
                                                                </th> */}
                                                                <th>
                                                                    IDEA
                                                                    Submission
                                                                    Percentage
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
                                                                                item.district_name
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
                                                                        {/* <td>
                                                                            {
                                                                                item.courseCompleted
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.courseInProgress
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.courseNotStarted
                                                                            }
                                                                        </td> */}
                                                                        <td>
                                                                            {
                                                                                item.submittedCount
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.draftCount
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.ideaNotStarted
                                                                            }
                                                                        </td>
                                                                        {/* <td>
                                                                            {
                                                                                item.coursePercentage
                                                                            }
                                                                            %
                                                                        </td> */}
                                                                        <td>
                                                                            {
                                                                                item.ideaSubmissionPercentage
                                                                            }
                                                                            %
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                            {/* <tr>
                                                                <td>{}</td>
                                                                <td>
                                                                    {
                                                                        'Total Count'
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.totalTeams
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.totalStudents
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.courseCompleted
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.courseInProgress
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.courseNotStarted
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.submittedCount
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.draftCount
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.ideaNotStarted
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {Math.round(
                                                                        (totalCount.courseCompleted /
                                                                            totalCount.totalStudents) *
                                                                            100
                                                                    )}
                                                                    %
                                                                </td>
                                                                <td>
                                                                    {Math.round(
                                                                        (totalCount.submittedCount /
                                                                            totalCount.totalTeams) *
                                                                            100
                                                                    )}
                                                                    %
                                                                </td>
                                                            </tr> */}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                            {/* <div className="col-md-6">
                                                <div className="col-md-6 text-center mt-5">
                                                    <p
                                                        style={{
                                                            whiteSpace:
                                                                'nowrap',
                                                            paddingLeft: '50px'
                                                        }}
                                                    >
                                                        <b>
                                                            Student Course
                                                            Status As of{' '}
                                                            {newFormat}
                                                        </b>
                                                    </p>
                                                </div>
                                                <div className="col-md-6 doughnut-chart-container">
                                                    {doughnutChart1Data && (
                                                        <Doughnut
                                                            data={
                                                                doughnutChart1Data
                                                            }
                                                            options={
                                                                chartOptions
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div> */}
                                            <div className="col-md-6">
                                                <div className="col-md-6 text-center mt-5 ">
                                                    <p
                                                        style={{
                                                            whiteSpace:
                                                                'nowrap',
                                                            paddingLeft: '30px'
                                                        }}
                                                    >
                                                        <b>
                                                            Student Idea
                                                            Submission As of{' '}
                                                            {newFormat}
                                                        </b>
                                                    </p>
                                                </div>
                                                <div className="col-md-6 doughnut-chart-container">
                                                    {doughnutChart2Data && (
                                                        <Doughnut
                                                            data={
                                                                doughnutChart2Data
                                                            }
                                                            options={
                                                                chartOption
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            {/* <div className="row">
                                                <div
                                                    className="col-md-6 chart-container mt-2"
                                                    style={{
                                                        width: '100%',
                                                        height: '370px'
                                                    }}
                                                >
                                                    <div className="chart-box">
                                                        <Bar
                                                            data={barChart1Data}
                                                            options={
                                                                stackedBarChart
                                                            }
                                                        />
                                                        <div className="chart-title">
                                                            <p>
                                                                <b>
                                                                    Student
                                                                    Course
                                                                    Completion
                                                                    Status As of{' '}
                                                                    {newFormat}
                                                                </b>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}

                                            <div
                                                className="col-md-6 chart-container mt-4"
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
                                                                Idea Submission
                                                                Status As of{' '}
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
                                        headers={studentTableHeaders}
                                        filename={`StudentDetailedSummaryReport_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRefTable}
                                    >
                                        Download Table CSV
                                    </CSVLink>
                                )}

                                {downloadData && (
                                    <CSVLink
                                        headers={studentDetailsHeaders}
                                        data={downloadData}
                                        filename={`StudentDetailedReport_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRef}
                                        onDownloaded={() => {
                                            setIsDownloading(false);
                                            setDownloadComplete(true);
                                        }}
                                    >
                                        Download CSV
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
export default ReportsRegistration;
