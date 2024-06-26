/* eslint-disable no-unused-vars */
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
import { useHistory } from 'react-router-dom';
import {
    getDistrictData,
    getStateData,
    getFetchDistData
} from '../../../redux/studentRegistration/actions';
import { useDispatch, useSelector } from 'react-redux';
import Select from '../Helpers/Select';
import { Bar } from 'react-chartjs-2';

import axios from 'axios';
import '../reports.scss';
import { Doughnut } from 'react-chartjs-2';
import { notification } from 'antd';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
// import { categoryValue } from '../../Schools/constentText';

const DistAbstractReport = () => {
    const [RegTeachersdistrict, setRegTeachersdistrict] = React.useState('');
    const [RegTeachersState, setRegTeachersState] = React.useState('');

    const [filterType, setFilterType] = useState('');
    const [category, setCategory] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [notfilteredData, setNotFilteredData] = useState([]);

    const filterOptions = ['Registered', 'Not Registered'];
    const [fetchreport, setFetchReport] = useState('');
    const categoryData = ['All Categorys', 'ATL', 'Non ATL'];
    // const categoryData =
    //     categoryValue[process.env.REACT_APP_LOCAL_LANGUAGE_CODE];
    const [combinedArray, setCombinedArray] = useState([]);

    const [downloadData, setDownloadData] = useState(null);
    const [downloadNotRegisteredData, setDownloadNotRegisteredData] =
        useState(null);
    const [chartTableData, setChartTableData] = useState([]);
    const csvLinkRefTable = useRef();
    const csvLinkRef = useRef();
    const csvLinkRefNotRegistered = useRef();
    const dispatch = useDispatch();
    const history = useHistory();
    const currentUser = getCurrentUser('current_user');
    const [registeredGenderChartData, setRegisteredGenderChartData] =
        useState(null);
    const [registeredChartData, setRegisteredChartData] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [newFormat, setNewFormat] = useState('');
    const [barChart1Data, setBarChart1Data] = useState({
        labels: [],
        datasets: []
    });
    const [totalCount, setTotalCount] = useState([]);

    const fullStatesNames = useSelector(
        (state) => state?.studentRegistration?.regstate
    );
    const fiterDistData = useSelector(
        (state) => state?.studentRegistration?.fetchdist
    );
    const fullDistrictsNames = useSelector(
        (state) => state?.studentRegistration?.dists
    );
    const [dataCount, setDataCount] = useState('');
    const [dataC, setDataC] = useState('');
    const [downloadTableData, setDownloadTableData] = useState(null);
    const [statusData, setStatusData] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    useEffect(() => {
        dispatch(getFetchDistData());
    }, []);

    const summaryHeaders = [
        {
            label: 'District Name',
            key: 'district_name'
        },
        // {
        //     label: 'Total Eligible ATL Schools',
        //     key: 'ATL_Count'
        // },
        {
            label: ' Total Number Of Institutions In District',
            key: 'totalInstitutions'
        },
        {
            label: 'Number Of Institutions Registered Till Now By Filing Ideas',
            key: 'totalRegInstitutions'
        },
        {
            label: '% Of Participating Institutions',
            key: 'ideaSubmissionPercentage'
        },
        {
            label: ' No Of Mentors  Enrolled',
            key: 'totalReg'
        },
        {
            label: '  No Of Teams Registered',
            key: 'totalTeams'
        },
        {
            label: ' No Of Students Enrolled In Teams',
            key: 'totalstudent'
        },
        {
            label: '  No Of Ideas In Draft',
            key: 'draftCount'
        },
        {
            label: '  No Of Ideas In Pending Approval',
            key: 'PFACount'
        },

        {
            label: '  No Of Ideas Submitted',
            key: 'submittedCount'
        }
    ];

    useEffect(() => {
        fetchChartTableData();
    }, []);

    useEffect(() => {
        if (filteredData.length > 0) {
            setDownloadData(filteredData);
        }
    }, [filteredData, downloadNotRegisteredData]);

    useEffect(() => {
        if (downloadComplete) {
            setDownloadComplete(false);
        }
        const newDate = new Date();
        const formattedDate = `${newDate.getUTCDate()}/${
            1 + newDate.getMonth()
        }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
        setNewFormat(formattedDate);
    }, [downloadComplete]);
    const fetchData = (item) => {
        const param = encryptGlobal(
            JSON.stringify({
                // state: RegTeachersState,
                status: 'ACTIVE',
                district_name:
                    RegTeachersdistrict === ''
                        ? 'All Districts'
                        : RegTeachersdistrict
                // category: category
            })
        );

        const params = encryptGlobal(
            JSON.stringify({
                // state: RegTeachersState,
                district_name:
                    RegTeachersdistrict === ''
                        ? 'All Districts'
                        : RegTeachersdistrict
                // category: category
            })
        );
        const url =
            item === 'Registered'
                ? `/reports/mentorRegList?Data=${param}`
                : item === 'Not Registered'
                ? `/reports/notRegistered?Data=${params}`
                : '';

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
                    // console.log(response, 'f');
                    if (item === 'Registered') {
                        setFilteredData(response?.data?.data || []);
                        setDownloadData(response?.data?.data || []);

                        csvLinkRef.current.link.click();
                    } else if (item === 'Not Registered') {
                        setDownloadNotRegisteredData(
                            response?.data?.data || []
                        );
                        csvLinkRefNotRegistered.current.link.click();
                    }
                    openNotificationWithIcon(
                        'success',
                        `${filterType} Report Downloaded Successfully`
                    );
                    setIsDownloading(false);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
                setIsDownloading(false);
            });
    };
    // console.log(filteredData, '11111');

    const fetchDataView = (item) => {
        setDataCount();
        setDataC();

        const param = encryptGlobal(
            JSON.stringify({
                // state: RegTeachersState,
                status: 'ACTIVE',
                district_name:
                    RegTeachersdistrict === ''
                        ? 'All Districts'
                        : RegTeachersdistrict
                // category: category
            })
        );

        const params = encryptGlobal(
            JSON.stringify({
                // state: RegTeachersState,
                district_name:
                    RegTeachersdistrict === ''
                        ? 'All Districts'
                        : RegTeachersdistrict
                // category: category
            })
        );
        const distName =
            RegTeachersdistrict === '' ? 'All Districts' : RegTeachersdistrict;
        setStatusData(distName);
        const url =
            item === 'Registered'
                ? `/reports/mentorRegList?Data=${param}`
                : item === 'Not Registered'
                ? `/reports/notRegistered?Data=${params}`
                : '';

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
                    // console.log(response, 'f');
                    if (item === 'Registered') {
                        setDataCount(response?.data?.count);
                        setDataC('');
                        setFilteredData(response?.data?.data || []);
                        setDownloadData(response?.data?.data || []);

                        // csvLinkRef.current.link.click();
                    } else if (item === 'Not Registered') {
                        setNotFilteredData(response?.data?.data || []);
                        setDownloadNotRegisteredData(
                            response?.data?.data || []
                        );

                        setDataC(response?.data?.count);
                        setDataCount('');

                        // csvLinkRefNotRegistered.current.link.click();
                    }
                    // openNotificationWithIcon(
                    //     'success',
                    //     `${filterType} Report Downloaded Successfully`
                    // );
                    setIsDownloading(false);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
                setIsDownloading(false);
            });
    };
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
    const RegHeaders = [
        // {
        //     label: 'Institution Code',
        //     key: 'organization.organization_code'
        // },
        {
            label: 'Institution Unique Code',
            key: 'institution_code'
        },
        {
            label: 'Institution Name',
            key: 'institution_name'
        },
        // {
        //     label: 'School Type/Category',
        //     key: 'organization.category'
        // },
        // {
        //     label: '',
        //     key: 'organization.state'
        // },
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
        // {
        //     label: 'Principal Name',
        //     key: 'principal_name'
        // },
        // {
        //     label: 'Principal Mobile No',
        //     key: 'principal_mobile'
        // },
        // {
        //     label: 'Principal Whatsapp Noo',
        //     key: 'principal_whatsapp_mobile'
        // },
        // {
        //     label: 'Principal Email',
        //     key: 'principal_email'
        // },
        {
            label: 'Title',
            key: 'mentor_title'
        },
        {
            label: 'Mentor Name',
            key: 'mentor_name'
        },
        {
            label: 'Mentor Email ID',
            key: 'mentor_email'
        },
        {
            label: 'Mentor Gender',
            key: 'gender'
        },
        {
            label: 'Mentor Mobile Number',
            key: 'mentor_mobile'
        },
        {
            label: 'Mentor WhatsApp Number',
            key: 'mentor_whatapp_mobile'
        }
        // {
        //     label: 'Date of Birth',
        //     key: 'date_of_birth'
        // }
    ];
    const notRegHeaders = [
        // {
        //     label: 'Institution Code',
        //     key: 'organization_code'
        // },
        {
            label: 'Institution Unique Code',
            key: 'institution_code'
        },
        {
            label: 'Institution Name',
            key: 'institution_name'
        },
        // {
        //     label: 'School Type/Category',
        //     key: 'category'
        // },
        // {
        //     label: 'State',
        //     key: 'state'
        // },
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
        }
        // {
        //     label: 'City',
        //     key: 'city'
        // },
        // {
        //     label: 'Pin code',
        //     key: 'pin_code'
        // },
        // {
        //     label: 'Address',
        //     key: 'address'
        // },
        // {
        //     label: 'Country',
        //     key: 'country'
        // },
        // {
        //     label: 'HM Name',
        //     key: 'principal_name'
        // },
        // {
        //     label: 'HM Contact',
        //     key: 'principal_mobile'
        // },
        // {
        //     label: 'HM Email',
        //     key: 'principal_email'
        // }
    ];
    const handleDownload = () => {
        if (
            // !RegTeachersState ||
            // !RegTeachersdistrict ||
            !filterType
            // !category
        ) {
            notification.warning({
                message:
                    'Please select  filter type before Downloading Reports.'
            });
            return;
        }
        setIsDownloading(true);
        fetchData(filterType);
    };
    // const distName =
    //     RegTeachersdistrict === '' ? 'All Districts' : RegTeachersdistrict;
    const handleDownloadView = () => {
        if (
            // !RegTeachersState ||
            // !RegTeachersdistrict ||
            !filterType
            // !category
        ) {
            notification.warning({
                message:
                    'Please select  filter type before Downloading Reports.'
            });
            return;
        }

        setButtonClicked(true);
        if (filterType === 'Registered' || filterType === 'Not Registered') {
            setButtonClicked(true);
            fetchDataView(filterType);
        }
        // setIsDownloading(true);
        // fetchDataView(filterType);
    };
    const fetchChartTableData = () => {
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/reports/Districtwiseabstract',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const summary = response.data.data[0].summary;
                    const PFACount = response.data.data[0].PFACount;
                    const RegInst = response.data.data[0].RegInst;
                    const RegMentor = response.data.data[0].RegMentor;
                    const TeamsCount = response.data.data[0].TeamsCount;
                    const draftCount = response.data.data[0].draftCount;
                    const submittedCount = response.data.data[0].submittedCount;
                    const studentCountDetails =
                        response.data.data[0].studentCountDetails;
                    const combinedArray = summary.map((summaryItem) => {
                        const district_name = summaryItem.district_name;
                        const totalInstitutions = summaryItem.totalInstitutions;

                        // const numberOfTeamsFormed =
                        //     summaryItem['Number of teams formed'];

                        const PFACountItem = PFACount.find(
                            (item) => item.district_name === district_name
                        );

                        const RegInstCountItem = RegInst.find(
                            (item) => item.district_name === district_name
                        );
                        const RegMentorCountItem = RegMentor.find(
                            (item) => item.district_name === district_name
                        );
                        const TeamsCountItem = TeamsCount.find(
                            (item) => item.district_name === district_name
                        );
                        const draftCountItem = draftCount.find(
                            (item) => item.district_name === district_name
                        );
                        const submittedCountItem = submittedCount.find(
                            (item) => item.district_name === district_name
                        );
                        const studentCountDetailsItem =
                            studentCountDetails.find(
                                (item) => item.district_name === district_name
                            );
                        // const ideaSubmissionPercentage = Math.round(
                        //     (RegInstCountItem
                        //         ? RegInstCountItem.totalRegInstitutions
                        //         : 0 / totalInstitutions) * 100
                        // );
                        const ideaSubmissionPercentage = Math.round(
                            ((RegInstCountItem
                                ? RegInstCountItem.totalRegInstitutions
                                : 0) /
                                totalInstitutions) *
                                100
                        );

                        return {
                            totalInstitutions,
                            district_name,
                            totalRegInstitutions: RegInstCountItem
                                ? RegInstCountItem.totalRegInstitutions
                                : 0,
                            submittedCount: submittedCountItem
                                ? submittedCountItem.submittedCount
                                : 0,
                            totalstudent: studentCountDetailsItem
                                ? studentCountDetailsItem.totalstudent
                                : 0,
                            draftCount: draftCountItem
                                ? draftCountItem.draftCount
                                : 0,
                            totalTeams: TeamsCountItem
                                ? TeamsCountItem.totalTeams
                                : 0,
                            totalReg: RegMentorCountItem
                                ? RegMentorCountItem.totalReg
                                : 0,
                            PFACount: PFACountItem ? PFACountItem.PFACount : 0,
                            ideaSubmissionPercentage
                        };
                    });

                    const total = combinedArray.reduce(
                        (acc, item) => {
                            acc.totalRegInstitutions +=
                                item.totalRegInstitutions;
                            acc.submittedCount += item.submittedCount;
                            acc.totalTeams += item.totalTeams;
                            acc.totalReg += item.totalReg;
                            acc.PFACount += item.PFACount;

                            acc.totalInstitutions += item.totalInstitutions;
                            acc.draftCount += item.draftCount;
                            acc.totalstudent += item.totalstudent;
                            acc.ideaSubmissionPercentage = (
                                (acc.totalRegInstitutions /
                                    acc.totalInstitutions) *
                                100
                            ).toFixed(2);
                            return acc;
                        },
                        {
                            totalRegInstitutions: 0,
                            totalTeams: 0,
                            totalstudent: 0,

                            submittedCount: 0,
                            draftCount: 0,

                            totalReg: 0,
                            PFACount: 0,
                            totalInstitutions: 0,
                            ideaSubmissionPercentage: 0
                        }
                    );

                    var array = combinedArray;

                    array.push({ district_name: 'Total Count', ...total });
                    setCombinedArray(array);
                    setDownloadTableData(combinedArray);
                    setRegisteredChartData({
                        labels: ['Registered ', 'Not Registered '],
                        datasets: [
                            {
                                data: [
                                    total.totalRegInstitutions,
                                    total.totalInstitutions
                                ],
                                backgroundColor: ['#36A2EB', '#FF6384'],
                                hoverBackgroundColor: ['#36A2EB', '#FF6384']
                            }
                        ]
                    });
                    const barData = {
                        labels: combinedArray.map((item) => item.district_name),
                        datasets: [
                            {
                                label: 'Registered ',
                                data: combinedArray.map(
                                    (item) => item.totalRegInstitutions
                                ),
                                backgroundColor: 'rgba(255, 0, 0, 0.6)'
                            },
                            {
                                label: 'Not Registered ',
                                data: combinedArray.map(
                                    (item) =>
                                        item.totalInstitutions -
                                        item.totalRegInstitutions
                                ),
                                backgroundColor: 'rgba(75, 162, 192, 0.6)'
                            }
                        ]
                    };
                    setBarChart1Data(barData);
                    // setTotalCount(total);

                    // setCombinedArray1(filteredData);
                    // setDownloadTableData1(filteredData);
                    // const filename = `${institution_type}_Ideas Evaluated Report_${newFormat}.csv`;
                    // csvLinkRefTable1.current.link.setAttribute(
                    //     'download',
                    //     filename
                    // );
                    // csvLinkRefTable1.current.link.click();
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };
    // console.log(filterType, '111');
    return (
        <>
            <Layout title="Reports">
                <Container className="RegReports mt-4 mb-30 userlist">
                    <Row className="mt-0 pt-2">
                        {/* <Col>
                            <h2>District Wise Abstract Status {newFormat}</h2>
                        </Col> */}
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
                            <Col>
                                <h2>
                                    District wise Abstract Status As of &nbsp;
                                    {newFormat}
                                </h2>
                            </Col>
                            <Row className="align-items-center">
                                {/* <Col md={2}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={fullStatesNames}
                                            setValue={setRegTeachersState}
                                            placeHolder={'Select State'}
                                            value={RegTeachersState}
                                        />
                                    </div>
                                </Col> */}
                                <Col md={2}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={fiterDistData}
                                            setValue={setRegTeachersdistrict}
                                            placeHolder={'Select District'}
                                            value={RegTeachersdistrict}
                                        />
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={filterOptions}
                                            setValue={setFilterType}
                                            placeHolder={'Select Filter'}
                                            value={filterType}
                                        />
                                    </div>
                                </Col>
                                {/* <Col md={2}>
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
                                    md={2}
                                    className="d-flex align-items-center justify-content-center"
                                >
                                    {/* <Button
                                        label="View Details"
                                        btnClass="primary mx-6"
                                        size="small"
                                        shape="btn-square"
                                        onClick={handleViewDetails}
                                        style={{
                                            width: '150px',
                                            whiteSpace: 'nowrap'
                                        }}
                                    /> */}
                                    <Button
                                        onClick={handleDownloadView}
                                        label={'Get Details'}
                                        btnClass="primary mx-3"
                                        size="small"
                                        shape="btn-square"
                                        type="submit"
                                    />
                                </Col>
                                <Col
                                    md={2}
                                    className="d-flex align-items-center justify-content-center"
                                >
                                    {/* <Button
                                        label="View Details"
                                        btnClass="primary mx-6"
                                        size="small"
                                        shape="btn-square"
                                        onClick={handleViewDetails}
                                        style={{
                                            width: '150px',
                                            whiteSpace: 'nowrap'
                                        }}
                                    /> */}
                                    <Button
                                        onClick={handleDownload}
                                        label={'Download Report'}
                                        // label={
                                        //     isDownloading
                                        //         ? 'Downloading'
                                        //         : 'Download Report'
                                        // }
                                        // label={
                                        //     downloadComplete
                                        //         ? 'Download Complete'
                                        //         : isDownloading
                                        //         ? 'Downloading...'
                                        //         : 'Download Report'
                                        // }
                                        btnClass="primary mx-3"
                                        size="small"
                                        shape="btn-square"
                                        type="submit"
                                        // style={{
                                        //     width: '160px',
                                        //     whiteSpace: 'nowrap',
                                        //     pointerEvents: isDownloading
                                        //         ? 'none'
                                        //         : 'auto'
                                        // }}
                                        // disabled={isDownloading}
                                    />
                                </Col>
                            </Row>
                            <div className="chart">
                                {buttonClicked &&
                                filterType === 'Registered' &&
                                filteredData.length > 0 ? (
                                    <>
                                        <h2> {statusData} Status</h2>
                                        <div className="mt-5">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className=" bg-white">
                                                        <Table
                                                            id="dataTable"
                                                            className="table table-striped table-bordered responsive"
                                                        >
                                                            <thead
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    margin: '20px'
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th>No</th>
                                                                    <th>
                                                                        Institution
                                                                        Code
                                                                    </th>
                                                                    <th>
                                                                        Institution
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Place
                                                                    </th>
                                                                    <th>
                                                                        Block
                                                                    </th>
                                                                    <th>
                                                                        District
                                                                    </th>
                                                                    {/* <th>
                                                                        State
                                                                    </th> */}
                                                                    <th>
                                                                        Mentor
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Mentor
                                                                        Email Id
                                                                    </th>{' '}
                                                                    <th>
                                                                        Mentor
                                                                        Gender
                                                                    </th>{' '}
                                                                    <th>
                                                                        Mentor
                                                                        Mobile
                                                                        Number
                                                                    </th>
                                                                    <th>
                                                                        Mentor
                                                                        WhatsApp
                                                                        Number
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    margin: '20px'
                                                                }}
                                                            >
                                                                {filteredData.map(
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
                                                                                    item.institution_code
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.institution_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.place_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.block_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.district_name
                                                                                }
                                                                            </td>
                                                                            {/* <td>
                                                                                {
                                                                                    item.state_name
                                                                                }
                                                                            </td> */}
                                                                            <td>
                                                                                {
                                                                                    item.mentor_title
                                                                                }

                                                                                .
                                                                                {
                                                                                    item.mentor_name
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.mentor_email
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.gender
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.mentor_mobile
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.mentor_whatapp_mobile
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    dataCount == '0' && (
                                        <span
                                            style={{
                                                fontSize: '20px',

                                                color: 'red'
                                            }}
                                        >
                                            No Data
                                        </span>
                                    )
                                )}
                                {buttonClicked &&
                                filterType === 'Not Registered' &&
                                notfilteredData.length > 0 ? (
                                    <>
                                        <h2> {statusData} Status</h2>
                                        <div className="mt-5">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className=" bg-white">
                                                        <Table
                                                            id="dataTable"
                                                            className="table table-striped table-bordered responsive"
                                                        >
                                                            <thead
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    margin: '20px'
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th>No</th>
                                                                    <th>
                                                                        Institution
                                                                        Code
                                                                    </th>
                                                                    <th>
                                                                        Institution
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Place
                                                                    </th>
                                                                    <th>
                                                                        Block
                                                                    </th>
                                                                    <th>
                                                                        District
                                                                    </th>
                                                                    {/* <th>
                                                                        State
                                                                    </th> */}
                                                                    <th>
                                                                        Principal
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Principal
                                                                        Email Id
                                                                    </th>{' '}
                                                                    <th>
                                                                        Principal
                                                                        Mobile
                                                                        Number
                                                                    </th>
                                                                    <th>
                                                                        Principal
                                                                        WhatsApp
                                                                        Number
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    margin: '20px'
                                                                }}
                                                            >
                                                                {notfilteredData.map(
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
                                                                                    item.institution_code
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.institution_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.place_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.block_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.district_name
                                                                                }
                                                                            </td>
                                                                            {/* <td>
                                                                                {
                                                                                    item.state_name
                                                                                }
                                                                            </td> */}
                                                                            <td>
                                                                                {
                                                                                    item.principal_name
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.principal_email
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.principal_mobile
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.principal_whatsapp_mobile
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    dataC == '0' && (
                                        <span
                                            style={{
                                                fontSize: '20px',
                                                color: 'red'
                                            }}
                                        >
                                            No Data
                                        </span>
                                    )
                                )}
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
                                                        // setIsDownloading(true);
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
                                            <div className="col-md-12">
                                                <div className=" bg-white">
                                                    <Table
                                                        id="dataTable"
                                                        className="table table-striped table-bordered responsive"
                                                    >
                                                        <thead
                                                            style={{
                                                                textAlign:
                                                                    'center',
                                                                margin: '20px'
                                                            }}
                                                        >
                                                            <tr>
                                                                <th>No</th>
                                                                <th>
                                                                    District
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    Total Number
                                                                    Of
                                                                    Institutions
                                                                    In District
                                                                </th>
                                                                <th>
                                                                    Number Of
                                                                    Institutions
                                                                    Registered
                                                                    Till Now By
                                                                    Filing Ideas
                                                                </th>
                                                                <th>
                                                                    % Of
                                                                    Participating
                                                                    Institutions
                                                                </th>
                                                                <th>
                                                                    No Of
                                                                    Mentors
                                                                    Enrolled
                                                                </th>
                                                                <th>
                                                                    No Of Teams
                                                                    Registered
                                                                </th>
                                                                <th>
                                                                    No Of
                                                                    Students
                                                                    Enrolled In
                                                                    Teams
                                                                </th>
                                                                <th>
                                                                    No Of Ideas
                                                                    In Draft
                                                                </th>{' '}
                                                                <th>
                                                                    No Of Ideas
                                                                    In Pending
                                                                    Approval
                                                                </th>{' '}
                                                                <th>
                                                                    No Of Ideas
                                                                    Submitted
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody
                                                            style={{
                                                                textAlign:
                                                                    'center',
                                                                margin: '20px'
                                                            }}
                                                        >
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
                                                                                item.totalInstitutions
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.totalRegInstitutions
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.ideaSubmissionPercentage
                                                                            }
                                                                            %
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
                                                                                item.totalstudent
                                                                            }
                                                                        </td>{' '}
                                                                        <td>
                                                                            {
                                                                                item.draftCount
                                                                            }
                                                                        </td>{' '}
                                                                        <td>
                                                                            {
                                                                                item.PFACount
                                                                            }
                                                                        </td>{' '}
                                                                        <td>
                                                                            {
                                                                                item.submittedCount
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="col-md-12 mt-5">
                                    <div className="row">
                                        {/* <div className="col-md-6 text-center mt-3">
                                                        <p>
                                                            <b>
                                                                Overall
                                                                Registered vs
                                                                Not Registered
                                                                Institutions As
                                                                of {newFormat}
                                                            </b>
                                                        </p>
                                                    </div> */}
                                        {/* <Col className="md-6"> */}
                                        <p className="text-center">
                                            <b>
                                                Overall Registered vs Not
                                                Registered Institutions As of{' '}
                                                {newFormat}
                                            </b>

                                            <div
                                                className=" doughnut-chart-container"
                                                // style={{
                                                //     marginRight: '20rem'
                                                // }}
                                            >
                                                {registeredChartData && (
                                                    <Doughnut
                                                        data={
                                                            registeredChartData
                                                        }
                                                        options={chartOption}
                                                    />
                                                )}
                                            </div>
                                        </p>
                                        {/* </Col> */}
                                    </div>
                                </div>
                                {/* <div className="mt-5">
                                    <div
                                        className="col-md-12 chart-container mt-5"
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
                                                        Registered vs Not
                                                        Registered Institutions
                                                        As of{newFormat}
                                                    </b>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {downloadTableData && (
                                    <CSVLink
                                        data={downloadTableData}
                                        headers={summaryHeaders}
                                        filename={`District_SummaryTable_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRefTable}
                                        // onDownloaded={() => {
                                        //     setIsDownloading(false);
                                        //     setDownloadComplete(true);
                                        // }}
                                    >
                                        Download Table CSV
                                    </CSVLink>
                                )}
                                {downloadData && (
                                    <CSVLink
                                        data={downloadData}
                                        headers={RegHeaders}
                                        filename={`Mentor_${filterType}Report_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRef}
                                        // onDownloaded={() => {
                                        //     setIsDownloading(false);
                                        //     setDownloadComplete(true);
                                        // }}
                                    >
                                        Download CSV
                                    </CSVLink>
                                )}
                                {downloadNotRegisteredData && (
                                    <CSVLink
                                        data={downloadNotRegisteredData}
                                        headers={notRegHeaders}
                                        filename={`Mentor_${filterType}Report_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRefNotRegistered}
                                        // onDownloaded={() => {
                                        //     setIsDownloading(false);
                                        //     setDownloadComplete(true);
                                        // }}
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
export default DistAbstractReport;
