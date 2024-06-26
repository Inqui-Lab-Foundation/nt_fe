import React from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import Layout from '../Layout';
import { Link } from 'react-router-dom';
import './reports.scss';
import PageNotFoundImg from '../../assets/media/page-not-found.png';

const Reports = () => {
    const showPage = true;
    return (
        <Layout title="Reports">
            {showPage ? (
                <Container className="mt-5 report-wrapper mb-5 pb-5">
                    <h2>Reports</h2>
                    <Row className="md-12">
                        <Col className="md-6">
                            <div className="reports-data p-5 bg-gray">
                                {/* <Row className="mb-3">
                                    <Col lg={12} md={12}>
                                        <Link to="/admin/reports-registration">
                                            <Card className="p-4 text-center card-effect mb-4">
                                                <b className="text-secondary">
                                                    INSTITUTION/ MENTOR
                                                    REGISTRATION REPORTS
                                                </b>
                                            </Card>
                                        </Link>
                                    </Col>
                                </Row> */}
                                <Row className="mb-3">
                                    <Col lg={12} md={12}>
                                        <Link to="/admin/district_report">
                                            <Card className="p-4 text-center card-effect mb-4">
                                                <b className="text-secondary">
                                                    DISTRICT WISE ABSTRACT
                                                    REPORTS
                                                </b>
                                            </Card>
                                        </Link>
                                    </Col>
                                </Row>
                                {/* <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/admin/SurveyStatus">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            SURVEY DEATAILED REPORTS
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row> */}
                                <Row className="mb-3">
                                    <Col lg={12} md={12}>
                                        <Link to="/admin/TeacherProgressDetailed">
                                            <Card className="p-4 text-center card-effect mb-4">
                                                <b className="text-secondary">
                                                    INSTITUTION PROGRESS
                                                    DETAILED REPORT
                                                </b>
                                            </Card>
                                        </Link>
                                    </Col>
                                </Row>

                                {/* <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/admin/StudentsProgressReport">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            STUDENT PROGRESS DETAILED REPORT
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row> */}

                                <Row className="mb-3">
                                    <Col lg={12} md={12}>
                                        <Link to="/admin/IdeaDetailsReport">
                                            <Card className="p-4 text-center card-effect mb-4">
                                                <b className="text-secondary">
                                                    SUBMITTED IDEAS REPORT
                                                </b>
                                            </Card>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col lg={12} md={12}>
                                        <Link to="/admin/instituion">
                                            <Card className="p-4 text-center card-effect mb-4">
                                                <b className="text-secondary">
                                                    INSTITUTION DETAILS REPORT
                                                </b>
                                            </Card>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col lg={12} md={12}>
                                        <Link to="/admin/ideaSubmitted">
                                            <Card className="p-4 text-center card-effect mb-4">
                                                <b className="text-secondary">
                                                    INSTITUTION TYPE WISE IDEAS
                                                    REPORT
                                                </b>
                                            </Card>
                                        </Link>
                                    </Col>
                                </Row>
                                {/* <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/admin/ideaEvaluation">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            IDEA EVALUATION DETAILS REPORT
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row> */}
                            </div>
                        </Col>
                        <Col className="md-6">
                            <div className="reports-data p-5 bg-gray">
                                {/* <Row className="mb-3">
                                    <Col lg={12} md={12}>
                                        <Link to="/admin/district_report">
                                            <Card className="p-4 text-center card-effect mb-4">
                                                <b className="text-secondary">
                                                    DISTRICT WISE ABSTRACT
                                                    REPORTS
                                                </b>
                                            </Card>
                                        </Link>
                                    </Col>
                                </Row> */}
                                {/* <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/admin/SurveyStatus">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            SURVEY DEATAILED REPORTS
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row> */}
                                {/* <Row className="mb-3">
                                    <Col lg={12} md={12}>
                                        <Link to="/admin/Institution-performance">
                                        <Card className="p-4 text-center card-effect mb-4">
                                            <b className="text-secondary">
                                                INSTITUTION TYPE WISE
                                                PERFORMANCE REPORT
                                            </b>
                                        </Card>
                                        </Link>
                                    </Col>
                                </Row> */}

                                {/* <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/admin/StudentsProgressReport">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            STUDENT PROGRESS DETAILED REPORT
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row> */}

                                {/* <Row className="mb-3">
                                    <Col lg={12} md={12}>
                                        <Link to="/admin/IdeaDetailsReport">
                                        <Card className="p-4 text-center card-effect mb-4">
                                            <b className="text-secondary">
                                                DISTRICT PERFORMANCE REPORT
                                            </b>
                                        </Card>
                                        </Link>
                                    </Col>
                                </Row> */}
                                {/* <Row className="mb-3">
                                    <Col lg={12} md={12}>
                                        <Link to="/admin/instituionType">
                                        <Card className="p-4 text-center card-effect mb-4">
                                            <b className="text-secondary">
                                                INSTITUTIONS TYPE WISE REPORT
                                            </b>
                                        </Card>
                                        </Link>
                                    </Col>
                                </Row> */}
                                {/* <Row className="mb-3">
                                    <Col lg={12} md={12}>
                                        <Link to="/admin/instituion-yearwise">
                                            <Card className="p-4 text-center card-effect mb-4">
                                                <b className="text-secondary">
                                                    YEAR WISE REPORT
                                                </b>
                                            </Card>
                                        </Link>
                                    </Col>
                                </Row> */}
                                {/* <Row className="mb-3">
                            <Col lg={6} md={6}>
                                <Link to="/admin/ideaEvaluation">
                                    <Card className="p-4 text-center card-effect mb-4">
                                        <b className="text-secondary">
                                            IDEA EVALUATION DETAILS REPORT
                                        </b>
                                    </Card>
                                </Link>
                            </Col>
                        </Row> */}
                            </div>
                        </Col>
                    </Row>
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
export default Reports;
