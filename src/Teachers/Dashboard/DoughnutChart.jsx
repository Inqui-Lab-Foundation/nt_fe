/* eslint-disable indent */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import 'antd/dist/antd.css';
import { Card, Progress } from 'reactstrap';
import { Table } from 'antd';
import { getTeamMemberStatus } from '../store/teams/actions';
import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
    FaCheckCircle,
    FaDownload,
    FaHourglassHalf,
    FaTimesCircle
} from 'react-icons/fa';
import { Button } from '../../stories/Button';
import IdeaSubmissionCard from '../../components/IdeaSubmissionCard';
import { getStudentChallengeSubmittedResponse } from '../../redux/studentRegistration/actions';
import Select from '../../Admin/Challenges/pages/Select';
import { Modal } from 'react-bootstrap';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import axios from 'axios';
import { Row, Col } from 'reactstrap';
import { useReactToPrint } from 'react-to-print';
import Schoolpdf from '../../School/SchoolPdf';
import { encryptGlobal } from '../../constants/encryptDecrypt';
export default function DoughnutChart({ user, setApproval, setIdeaCount }) {
    const dispatch = useDispatch();
    const currentUser = getCurrentUser('current_user');
    const { teamsMembersStatus, teamsMembersStatusErr } = useSelector(
        (state) => state.teams
    );
    // console.log(teamsMembersStatus, 'teamsMembersStatus');
    const [teamId, setTeamId] = useState(null);
    const [showDefault, setshowDefault] = useState(true);
    const [ideaShow, setIdeaShow] = useState(false);
    const [Student, setStudent] = useState('');
    const [ChangeShow, setChangeShow] = useState(false);
    const [mentorid, setmentorid] = useState('');
    const [studentchangelist, setstudentchangelist] = useState([]);
    const [studentchangeObj, setstudentchangeObj] = useState({});
    const [isideadisable, setIsideadisable] = useState(false);
    const [isEvlCom, setIsEvlCom] = useState(false);
    const { challengesSubmittedResponse } = useSelector(
        (state) => state?.studentRegistration
    );
    useEffect(() => {
        if (teamId) {
            dispatch(getTeamMemberStatus(teamId, setshowDefault));
            dispatch(getStudentChallengeSubmittedResponse(teamId));
        }
    }, [teamId, dispatch]);
    const percentageBWNumbers = (a, b) => {
        return (((a - b) / a) * 100).toFixed(2);
    };
    useEffect(() => {
        if (user) {
            setmentorid(user[0].mentor_id);
        }
    }, [user]);
    const [teamsList, setTeamsList] = useState([]);
    useEffect(() => {
        if (mentorid) {
            setshowDefault(true);
            teamNameandIDsbymentorid(mentorid);
        }
    }, [mentorid]);

    const teamNameandIDsbymentorid = (mentorid) => {
        const teamApi = encryptGlobal(
            JSON.stringify({
                mentor_id: mentorid
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/teams/namebymenterid?Data=${teamApi}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setTeamsList(response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        const popParam = encryptGlobal('2');
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/popup/${popParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    if (response.data.data[0]?.on_off === '1') {
                        setIsideadisable(true);
                    } else {
                        setIsideadisable(false);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        const popaddParam = encryptGlobal('3');
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/popup/${popaddParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    if (response.data.data[0]?.on_off === '0') {
                        setIsEvlCom(true);
                    } else {
                        setIsEvlCom(false);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const handleChangeStudent = async (id, name) => {
        const StudentId = encryptGlobal(JSON.stringify(id));

        //  handleChangeStudent Api we can update the initiate student //
        // here id = class ; name = student name //

        const body = {
            team_id: teamId,
            initiated_by: studentchangeObj[name]
        };
        var config = {
            method: 'put',
            url: process.env.REACT_APP_API_BASE_URL + '/ideas/ideaUpdate',
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
                        'Idea initiated to New Student Successfully',
                        ''
                    );
                    setChangeShow(false);
                    dispatch(getStudentChallengeSubmittedResponse(teamId));
                    setStudent('');
                }
            })
            .catch(function (error) {
                console.log(error);
                setChangeShow(false);
            });
    };
    const handleRevoke = async (id, type) => {
        const handleRevokeId = encryptGlobal(JSON.stringify(id));
        let submitData = {
            status: type == 'DRAFT' ? 'SUBMITTED' : 'DRAFT'
        };
        var config = {
            method: 'put',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/challenge_response/updateEntry/${handleRevokeId}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: submitData
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    openNotificationWithIcon(
                        'success',
                        'Idea Submission Status Successfully Update!',
                        ''
                    );
                    dispatch(getTeamMemberStatus(teamId, setshowDefault));
                    dispatch(getStudentChallengeSubmittedResponse(teamId));
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'student_full_name',
            width: '15rem'
        },
        {
            title: 'Student Idea Send For Approval',
            dataIndex: 'PendingForApproval',
            render: (_, record) =>
                record?.PendingForApproval === 1 ? (
                    <FaCheckCircle size={20} color="green" />
                ) : (
                    <FaTimesCircle size={20} color="red" />
                ),
            width: '15rem'
        },
        // {
        //     title: 'Pre Survey',
        //     dataIndex: 'pre_survey_status',
        //     align: 'center',
        //     width: '15rem',
        //     render: (_, record) =>
        //         record?.pre_survey_status ? (
        //             <FaCheckCircle size={20} color="green" />
        //         ) : (
        //             <FaTimesCircle size={20} color="red" />
        //         )
        // },
        // {
        //     title: 'Lesson Progress',
        //     dataIndex: 'address',
        //     align: 'center',
        //     width: '30rem',
        //     render: (_, record) => {
        //         let percent =
        //             100 -
        //             percentageBWNumbers(
        //                 record.all_topics_count,
        //                 record.topics_completed_count
        //             );
        //         return (
        //             <div className="d-flex">
        //                 <div style={{ width: '80%' }}>
        //                     <Progress
        //                         key={'25'}
        //                         className="progress-height"
        //                         animated
        //                         color={
        //                             percent
        //                                 ? percent <= 25
        //                                     ? 'danger'
        //                                     : percent > 25 && percent <= 50
        //                                     ? 'info'
        //                                     : percent > 50 && percent <= 75
        //                                     ? 'warning'
        //                                     : 'sucess'
        //                                 : 'danger'
        //                         }
        //                         value={percent}
        //                     />
        //                 </div>
        //                 <span className="ms-2">
        //                     {Math.round(percent) ? Math.round(percent) : '0'}%
        //                 </span>
        //             </div>
        //         );
        //     }
        // },
        {
            title: 'Mentor Approval',
            dataIndex: 'idea_submission',
            align: 'center',
            width: '20rem',
            render: (_, record) =>
                record?.idea_submission === 1 ? (
                    <FaCheckCircle size={20} color="green" />
                ) : (
                    <FaTimesCircle size={20} color="red" />
                )
        }
        // {
        //     title: 'Post Survey',
        //     dataIndex: 'post_survey_status',
        //     align: 'center',
        //     width: '10rem',
        //     render: (_, record) =>
        //         record?.post_survey_status ? (
        //             <FaCheckCircle size={20} color="green" />
        //         ) : (
        //             <FaTimesCircle size={20} color="red" />
        //         )
        // },
        // {
        //     title: 'Certificate',
        //     dataIndex: 'certificate',
        //     align: 'center',
        //     width: '10rem',
        //     render: (_, record) =>
        //         record?.certificate ? (
        //             <FaCheckCircle size={20} color="green" />
        //         ) : (
        //             <FaTimesCircle size={20} color="red" />
        //         )
        // }
    ];

    useEffect(() => {
        const studentlistObj = {};
        const studentlist = teamsMembersStatus.map((stu) => {
            studentlistObj[stu.student_full_name] = stu.user_id;
            return stu.student_full_name;
        });

        let index = studentlist.indexOf(
            challengesSubmittedResponse?.initiated_name
        );

        if (index >= 0) {
            studentlist.splice(index, 1);
        }
        setstudentchangelist(studentlist);
        setstudentchangeObj(studentlistObj);
    }, [teamsMembersStatus, ChangeShow]);

    ///// school pdf code
    const [showPrintSymbol, setShowPrintSymbol] = useState(true);
    //school pdf idea deatils
    const [ideaValuesForPDF, setIdeaValuesForPDF] = useState();
    const ideaDataforPDF = () => {
        const ideaDataApi = encryptGlobal(
            JSON.stringify({
                mentor_id: user[0].mentor_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/challenge_response/schoolpdfideastatus?Data=${ideaDataApi}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setIdeaValuesForPDF(response?.data?.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const [teamsData, setTeamsData] = useState([]);

    //school pdf mentor deatils
    const [mentorValuesForPDF, setMentorValuesForPDF] = useState();
    const mentorDataforPDF = () => {
        const mentorDataApi = encryptGlobal(
            JSON.stringify({
                id: user[0].mentor_id,
                user_id: user[0].user_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/mentors/mentorpdfdata?Data=${mentorDataApi}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setMentorValuesForPDF(response?.data?.data[0]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // Function to fetch data for a single team by ID
    const fetchTeamData = async (teamId, teamName) => {
        const teamParam = encryptGlobal(JSON.stringify(teamId));
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/dashboard/teamStats/${teamParam}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${currentUser?.data[0]?.token}`
                    }
                }
            );
            return [...response.data.data, { name: teamName }];
        } catch (error) {
            console.error(`Error fetching data for team ID ${teamId}:`, error);
            return null;
        }
    };

    // Function to fetch data for all teams and store in a single array
    const fetchAllTeamsData = async () => {
        try {
            const teamDataPromises = teamsList.map((teamId) =>
                fetchTeamData(teamId.team_id, teamId.team_name)
            );
            const teamDataArray = await Promise.all(teamDataPromises);
            const filteredDataArray = teamDataArray.filter(
                (data) => data !== null
            );
            setTeamsData(filteredDataArray);
        } catch (error) {
            console.error('Error fetching team data:', error);
        }
    };

    useEffect(() => {
        if (
            teamsData.length === teamsList.length &&
            teamsData.length !== 0 &&
            mentorValuesForPDF !== undefined &&
            ideaValuesForPDF !== undefined
        ) {
            handlePrint();
            // console.log('printcontinue');
            setShowPrintSymbol(true);
        } else {
            // console.log("Some PDF printing related api's are failing");
            setShowPrintSymbol(true);
        }
    }, [teamsData, mentorValuesForPDF]);
    const tsetcall = () => {
        setShowPrintSymbol(false);
        mentorDataforPDF();
        ideaDataforPDF();
        fetchAllTeamsData();
    };
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });
    //////
    const [ideaStatusEval, setIdeaStatusEval] = useState('-');
    useEffect(() => {
        if (challengesSubmittedResponse.length === 0) {
            setIdeaStatusEval('NOT STARTED');
        } else if (challengesSubmittedResponse.final_result === '1') {
            setIdeaStatusEval(
                'Congratulations,Idea is selected for grand finale'
            );
        } else if (challengesSubmittedResponse.final_result === '0') {
            setIdeaStatusEval('Shortlisted for final round of evaluation');
            if (isEvlCom) {
                setIdeaStatusEval('Better luck next time');
            }
        } else if (
            challengesSubmittedResponse.evaluation_status === 'REJECTEDROUND1'
        ) {
            setIdeaStatusEval('Better luck next time');
        } else if (
            challengesSubmittedResponse.evaluation_status === 'SELECTEDROUND1'
        ) {
            setIdeaStatusEval('Promoted to Level 2 round of evaluation');
            if (isEvlCom) {
                setIdeaStatusEval('Better luck next time');
            }
        } else {
            setIdeaStatusEval(challengesSubmittedResponse?.status);
        }
    }, [challengesSubmittedResponse]);

    return (
        <>
            <div style={{ display: 'none' }}>
                {/* <Schoolpdf
                    ref={componentRef}
                    tabledata={teamsData}
                    remMentor={mentorValuesForPDF}
                    ideaStatusDetails={ideaValuesForPDF}
                /> */}
            </div>
            <Card
                className="select-team w-100"
                style={{ overflowX: 'auto', padding: '30px' }}
            >
                <div className="d-flex justify-content-between">
                    <label htmlFor="teams" className="">
                        Team Progress:
                    </label>
                    {/* {showPrintSymbol ? (
                        <FaDownload size={22} onClick={tsetcall} />
                    ) : (
                        <FaHourglassHalf size={22} />
                    )} */}
                </div>
                <div className="d-flex align-items-center teamProgreess">
                    <Col md="3" xs="12">
                        <div className="singlediv">
                            <select
                                onChange={(e) => setTeamId(e.target.value)}
                                name="teams"
                                id="teams"
                                style={{
                                    backgroundColor: 'lavender',
                                    height: '40px', // Set the desired height
                                    fontSize: '16px'
                                }}
                            >
                                <option hidden>Select Team</option>
                                {teamsList &&
                                teamsList.length > 0 &&
                                teamId !== ''
                                    ? teamsList.map((item, i) => (
                                          <option key={i} value={item.team_id}>
                                              {item.team_name}
                                          </option>
                                      ))
                                    : null}
                            </select>
                        </div>
                    </Col>
                    {teamId && (
                        <>
                            <Row>
                                <div className="singlediv">
                                    <Card
                                        className="p-3 mx-4 d-flex flex-row"
                                        style={{
                                            marginTop: '.5rem',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        <span className="fw-bold">
                                            IDEA STATUS :
                                        </span>
                                        <span style={{ paddingLeft: '1rem' }}>
                                            {isEvlCom
                                                ? ideaStatusEval
                                                : challengesSubmittedResponse.length ===
                                                  0
                                                ? 'Not Started'
                                                : challengesSubmittedResponse?.status}
                                        </span>
                                    </Card>
                                </div>
                            </Row>
                            <>
                                <div>
                                    {challengesSubmittedResponse?.status ===
                                        'SUBMITTED' && (
                                        <Button
                                            button="button"
                                            label="View Idea"
                                            disabled={
                                                teamsMembersStatus.length > 0 &&
                                                challengesSubmittedResponse?.status ===
                                                    'SUBMITTED'
                                                    ? false
                                                    : true
                                            }
                                            btnClass={`${
                                                teamsMembersStatus.length > 0 &&
                                                challengesSubmittedResponse?.status ===
                                                    'SUBMITTED'
                                                    ? 'primary'
                                                    : 'default'
                                            }`}
                                            size="small"
                                            shape="btn-square"
                                            style={{ padding: '1rem 2.4rem' }}
                                            onClick={() => setIdeaShow(true)}
                                        />
                                    )}
                                </div>
                                <div className="m-3">
                                    {challengesSubmittedResponse?.status !==
                                        'SUBMITTED' && (
                                        <Button
                                            label={' Change  '}
                                            disabled={
                                                teamsMembersStatus.length > 0 &&
                                                challengesSubmittedResponse?.status
                                                    ? false
                                                    : true
                                            }
                                            btnClass={`${
                                                teamsMembersStatus.length > 0 &&
                                                challengesSubmittedResponse?.status
                                                    ? 'primary'
                                                    : 'default'
                                            }`}
                                            size="small"
                                            shape="btn-square"
                                            style={{ padding: '1rem 3rem' }}
                                            onClick={() => setChangeShow(true)}
                                        />
                                    )}
                                </div>
                                {/* <div>
                                    {challengesSubmittedResponse?.status ===
                                        'SUBMITTED' &&
                                    challengesSubmittedResponse?.evaluation_status ===
                                        null ? (
                                        <Button
                                            className={
                                                isideadisable
                                                    ? `btn btn-success btn-lg mr-5 mx-2`
                                                    : `btn btn-lg mr-5 mx-2`
                                            }
                                            label={'REVOKE'}
                                            size="small"
                                            shape="btn-square"
                                            style={{
                                                padding: '1rem 3rem',
                                                fontSize: '14px',
                                                marginBottom: '.8rem'
                                            }}
                                            onClick={() =>
                                                handleRevoke(
                                                    challengesSubmittedResponse.challenge_response_id,
                                                    challengesSubmittedResponse.status
                                                )
                                            }
                                            disabled={!isideadisable}
                                        />
                                    ) : (
                                        ''
                                    )}
                                </div> */}
                            </>
                        </>
                    )}
                </div>
                {showDefault && (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: '25rem' }}
                    >
                        <h2 className="text-primary">Please Select a Team*</h2>
                    </div>
                )}
                {teamsMembersStatus.length > 0 && !showDefault ? (
                    <Table
                        bordered
                        pagination={false}
                        dataSource={teamsMembersStatus}
                        columns={columns}
                    />
                ) : teamsMembersStatusErr ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: '25rem' }}
                    >
                        <p className="text-primary">
                            There are no students in the selected Team
                        </p>
                    </div>
                ) : null}
            </Card>
            {ideaShow && (
                <IdeaSubmissionCard
                    show={ideaShow}
                    handleClose={() => setIdeaShow(false)}
                    response={challengesSubmittedResponse}
                    setIdeaCount={setIdeaCount}
                    setApproval={setApproval}
                />
            )}
            {ChangeShow && (
                <Modal
                    show={ChangeShow}
                    onHide={() => setChangeShow(false)}
                    //{...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    className="assign-evaluator ChangePSWModal teacher-register-modal"
                    backdrop="static"
                    scrollable={true}
                >
                    <Modal.Header
                        closeButton
                        onHide={() => setChangeShow(false)}
                    >
                        <Modal.Title
                            id="contained-modal-title-vcenter"
                            className="w-100 d-block text-center"
                        >
                            Idea Initiation Change
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="my-3 text-center">
                            <h3 className="mb-sm-4 mb-3">
                                Please Initiate Idea to Student
                            </h3>
                            <Select
                                list={studentchangelist}
                                setValue={setStudent}
                                placeHolder={'Please Select'}
                                value={Student}
                            />
                        </div>
                        <div className="text-center">
                            <Button
                                label={'Submit'}
                                btnClass={!Student ? 'default' : 'primary'}
                                size="small "
                                onClick={() =>
                                    handleChangeStudent(
                                        challengesSubmittedResponse.challenge_response_id,
                                        Student
                                    )
                                }
                                disabled={!Student}
                            />
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
}
