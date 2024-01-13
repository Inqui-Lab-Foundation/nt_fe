import React from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import Layout from '../Layout';
import { Link } from 'react-router-dom';
import '../../Admin/Reports/reports.scss';
import PageNotFoundImg from '../../assets/media/page-not-found.png';

const DistReports = () => {
    const showPage = true;

    return (
        <Layout>
            {showPage ? (
                <Container className="mt-5 report-wrapper mb-5 pb-5">
                    <h2>Reports</h2>
                    <div className="reports-data p-5 bg-gray">
                        <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/coordinator/reports-registration">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            SCHOOL/TEACHER REGISTRATION REPORTS
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row>
                        {/* <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/report/SurveyStatus">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            SURVEY DEATAILED REPORTS
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row> */}
                        <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/coordinator/TeacherProgressDetailed">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            SCHOOL PROGRESS DETAILED REPORT
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/coordinator/StudentDetailedReport">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            STUDENT PROGRESS DETAILED REPORT
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row>

                        {/* <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/report">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            IDEA SUBMISSION DETAILED REPORT
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row> */}
                        {/* <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/admin/ChallengesReport">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            CHALLENGES EVALUATION REPORTS
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row> */}
                    </div>
                </Container>
            ) : (
                <Container className="mt-5 report-wrapper mb-5 pb-5">
                    <Card className="p-5 text-center">
                        <div>
                            <img
                                src={PageNotFoundImg}
                                alt="under construction"
                                className="img-fluid w-25"
                            />
                        </div>

                        <p>Page is under construction</p>
                    </Card>
                </Container>
            )}
        </Layout>
    );
};
export default DistReports;
