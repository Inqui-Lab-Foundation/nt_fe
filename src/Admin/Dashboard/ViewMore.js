/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import Layout from '../Layout';
import { Container, Row, Card, CardBody, CardText, Col } from 'reactstrap';
import { BreadcrumbTwo } from '../../stories/BreadcrumbTwo/BreadcrumbTwo';
import DoughnutChart from '../../Teachers/Dashboard/DoughnutChart';
import { Button } from '../../stories/Button';
import axios from 'axios';
import { getCurrentUser } from '../../helpers/Utils';
import { encryptGlobal } from '../../constants/encryptDecrypt';
const ViewMore = () => {
    const history = useHistory();
    const currentUser = getCurrentUser('current_user');
    const [button, setButton] = useState('');
    const [data, setData] = useState('');

    const orgDaTa = JSON.parse(localStorage.getItem('orgData'));
    // const tecDaTa = JSON.parse(localStorage.getItem('teacherId'));
    const [showMentorCard, setshowMentorCard] = useState(false);
    const [course, setCourse] = useState([]);
    // where orgDaTa = orgnization details //
    // we can see all orgnization , mentor details //
    const headingDetails = {
        title: 'View More Details',
        options: []
    };
    var teamId = [];
    teamId.push({
        mentor_id: orgDaTa.mentor.mentor_id,
        user_id: orgDaTa.mentor.user_id
    });
    const handleBack = () => {
        history.push({
            pathname: '/admin/dashboard'
        });
        localStorage.setItem(
            'organization_code',
            JSON.stringify(orgDaTa.organization_code)
        );
    };

    useEffect(() => {
        const userIdParam = encryptGlobal(
            JSON.stringify({
                user_id: orgDaTa?.mentor.user_id,
                role: 'MENTOR'
            })
        );

        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/quizscores?Data=${userIdParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setCourse(response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);
    // useEffect(() => {
    //     mentorsData();
    // }, []);
    // const mentorsData = () => {
    //     var config = {
    //         method: 'get',
    //         url:
    //             process.env.REACT_APP_API_BASE_URL +
    //             `/teams/teamMentor?team_id=${tecDaTa}`,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Accept: 'application/json',
    //             Authorization: `Bearer ${currentUser.data[0]?.token}`
    //         }
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             if (response.status === 200) {
    //                 setData(response?.data?.data[0]);
    //                 setButton(response.data.data[0].moc_name);
    //                 // if (response.data.data[0].moc_name !== null) {
    //                 //     setshowMentorCard(true);
    //                 // }
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };
    const atlData = orgDaTa.organization_code;
    const altRes = atlData.split('-');
    const atlNew = altRes[0];
    const percentageBWNumbers = (a, b) => {
        // here a = all_topics_count ; b= topics_completed_count //
        return (((a - b) / a) * 100).toFixed(2);
    };
    return (
        <Layout>
            <Container className="mt-5 pt-5 dynamic-form">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <BreadcrumbTwo {...headingDetails} />
                    <Button
                        label="Back"
                        btnClass="primary"
                        size="small"
                        onClick={handleBack}
                    />
                </div>
                <Row className="py-5">
                    <Row className="py-5">
                        <Card className="py-5">
                            <CardBody>
                                <h2 className="mb-4">Organization Details</h2>

                                {/* <CardText>
                                <span className="mx-3">
                                    <b>principal Name :</b>
                                </span>
                                <b>{orgDaTa.principal_name}</b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>principal Email :</b>
                                </span>
                                <b>{orgDaTa.principal_email}</b>
                            </CardText> */}
                                <CardText>
                                    <span className="mx-3">
                                        <b>Organization Name :</b>
                                    </span>
                                    <b>{orgDaTa.organization_name}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Organization Code :</b>
                                    </span>
                                    <b>{orgDaTa.organization_code}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>UDISE Code :</b>
                                    </span>
                                    <b>{orgDaTa.unique_code}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Category :</b>
                                    </span>
                                    <b>{orgDaTa.category}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>State:</b>
                                    </span>
                                    <b>{orgDaTa.state}</b>
                                </CardText>

                                <CardText>
                                    <span className="mx-3">
                                        <b>District :</b>
                                    </span>
                                    <b>{orgDaTa.district}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Pincode :</b>
                                    </span>
                                    <b>{orgDaTa.pin_code}</b>
                                </CardText>
                                {/* <CardText>
                                <span className="mx-3">
                                    <b>Country :</b>
                                </span>
                                <b>{orgDaTa.country}</b>
                            </CardText> */}
                            </CardBody>
                        </Card>
                    </Row>
                    <Row>
                        {orgDaTa.category === 'Non ATL' && (
                            <Card className="py-5">
                                <CardBody>
                                    <h2 className="mb-4">ATL School Details</h2>
                                    <CardText>
                                        <span className="mx-3">
                                            <b>ATL Code :</b>
                                        </span>
                                        <b>{atlNew}</b>
                                    </CardText>
                                    <CardText>
                                        <span className="mx-3">
                                            <b>Organization Name :</b>
                                        </span>
                                        <b>{orgDaTa.organization_name}</b>
                                    </CardText>

                                    <CardText>
                                        <span className="mx-3">
                                            <b>State:</b>
                                        </span>
                                        <b>{orgDaTa.state}</b>
                                    </CardText>

                                    <CardText>
                                        <span className="mx-3">
                                            <b>District :</b>
                                        </span>
                                        <b>{orgDaTa.district}</b>
                                    </CardText>
                                    <CardText>
                                        <span className="mx-3">
                                            <b>Pincode :</b>
                                        </span>
                                        <b>{orgDaTa.pin_code}</b>
                                    </CardText>
                                </CardBody>
                            </Card>
                        )}
                    </Row>
                    <Row className="py-5">
                        <Card className="py-5">
                            <CardBody>
                                <h2 className="mb-4">Teacher Details</h2>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Title :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.title}</b>
                                </CardText>

                                <CardText>
                                    <span className="mx-3">
                                        <b>Teacher Name :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.full_name}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Gender :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.gender}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b> Mentor Id :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.mentor_id}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Email Id :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.user.username}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Mobile No :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.mobile}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>WhatsApp No :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.whatapp_mobile}</b>
                                </CardText>
                            </CardBody>
                        </Card>
                    </Row>

                    <Row className="teacher-statistics bg-white p-5">
                        <Row className="">
                            <Col>
                                <div className="d-flex flex-wrap">
                                    <DoughnutChart
                                        user={teamId}
                                        dashBoard={'Admin'}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Row>
                    <Row className="py-5">
                        <Card className="py-5">
                            <CardBody>
                                <h2 className="mb-4">Teacher Course Details</h2>
                                <CardText>
                                    <span className="mx-3">
                                        <b> Quiz Score :</b>
                                    </span>
                                    <b>
                                        {course[0]?.scores[0]?.score
                                            ? course[0]?.scores[0]?.score +
                                              '/15'
                                            : '-'}
                                    </b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Course Progress :</b>
                                    </span>
                                    <b>
                                        {course[0]?.currentProgress !==
                                        undefined
                                            ? `${
                                                  Math.round(
                                                      (course[0]
                                                          ?.currentProgress /
                                                          course[0]
                                                              ?.totalProgress) *
                                                          100
                                                  ) + '%'
                                              }`
                                            : '-'}
                                    </b>{' '}
                                </CardText>
                            </CardBody>
                        </Card>
                    </Row>
                    {/* <Row>
                        {button ? (
                            <Col md={12}>
                                <Card className="w-100  mb-5 p-4">
                                    <CardBody>
                                        <h2 className="mb-4">Mentor Details</h2>
                                        <Row>
                                            <Col
                                                md={8}
                                                className="border-right my-auto "
                                            >
                                                <Row>
                                                    <Col
                                                        md={7}
                                                        className="my-auto profile-detail w-100"
                                                    >
                                                        <CardText>
                                                            <Row className="pt-3 pb-3">
                                                                <Col
                                                                    xs={5}
                                                                    sm={5}
                                                                    md={5}
                                                                    xl={5}
                                                                    className="my-auto profile-detail"
                                                                >
                                                                    <b>
                                                                        Mentor
                                                                        Name
                                                                    </b>
                                                                </Col>
                                                                <Col
                                                                    xs={1}
                                                                    sm={1}
                                                                    md={1}
                                                                    xl={1}
                                                                >
                                                                    :
                                                                </Col>
                                                                <Col
                                                                    xs={6}
                                                                    sm={6}
                                                                    md={6}
                                                                    xl={6}
                                                                    className="my-auto profile-detail"
                                                                >
                                                                    <b>
                                                                        {data?.moc_name
                                                                            ? data?.moc_name
                                                                            : '-'}
                                                                    </b>
                                                                </Col>
                                                            </Row>
                                                            <Row className="pt-3 pb-3">
                                                                <Col
                                                                    xs={5}
                                                                    sm={5}
                                                                    md={5}
                                                                    xl={5}
                                                                    className="my-auto profile-detail"
                                                                >
                                                                    <b>
                                                                        Email
                                                                        Address
                                                                    </b>
                                                                </Col>
                                                                <Col
                                                                    xs={1}
                                                                    sm={1}
                                                                    md={1}
                                                                    xl={1}
                                                                >
                                                                    :
                                                                </Col>
                                                                <Col
                                                                    xs={6}
                                                                    sm={6}
                                                                    md={6}
                                                                    xl={6}
                                                                    className="my-auto profile-detail"
                                                                >
                                                                    <b>
                                                                        {data?.moc_email
                                                                            ? data?.moc_email
                                                                            : '-'}
                                                                    </b>
                                                                </Col>
                                                            </Row>
                                                            <Row className="pt-3 pb-3">
                                                                <Col
                                                                    xs={5}
                                                                    sm={5}
                                                                    md={5}
                                                                    xl={5}
                                                                    className="my-auto profile-detail"
                                                                >
                                                                    <b>
                                                                        Gender
                                                                    </b>
                                                                </Col>
                                                                <Col
                                                                    xs={1}
                                                                    sm={1}
                                                                    md={1}
                                                                    xl={1}
                                                                >
                                                                    :
                                                                </Col>
                                                                <Col
                                                                    xs={6}
                                                                    sm={6}
                                                                    md={6}
                                                                    xl={6}
                                                                    className="my-auto profile-detail"
                                                                >
                                                                    <b>
                                                                        {data?.moc_gender
                                                                            ? data?.moc_gender
                                                                            : '-'}
                                                                    </b>
                                                                </Col>
                                                            </Row>
                                                            <Row className="pt-3 pb-3">
                                                                <Col
                                                                    xs={5}
                                                                    sm={5}
                                                                    md={5}
                                                                    xl={5}
                                                                    className="my-auto profile-detail"
                                                                >
                                                                    <b>
                                                                        Mobile
                                                                    </b>
                                                                </Col>
                                                                <Col
                                                                    xs={1}
                                                                    sm={1}
                                                                    md={1}
                                                                    xl={1}
                                                                >
                                                                    :
                                                                </Col>
                                                                <Col
                                                                    xs={6}
                                                                    sm={6}
                                                                    md={6}
                                                                    xl={6}
                                                                    className="my-auto profile-detail"
                                                                >
                                                                    <b>
                                                                        {data?.moc_phone
                                                                            ? data?.moc_phone
                                                                            : '-'}
                                                                    </b>
                                                                </Col>
                                                            </Row>
                                                        </CardText>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        ) : (
                            <div>
                                <Row className="py-5">
                                    <Card className="py-5">
                                        <CardBody>
                                            <h2 className="mb-4 ">
                                                No Mentor assigned yet
                                            </h2>
                                        </CardBody>
                                    </Card>
                                </Row>
                            </div>
                        )}
                    </Row> */}
                </Row>
            </Container>
        </Layout>
    );
};
export default withRouter(ViewMore);
