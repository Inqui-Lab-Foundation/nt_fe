/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect } from 'react';
import { Button } from '../../stories/Button';
import LinkComponent from './LinkComponent';
import { getCurrentUser } from '../../helpers/Utils';
import RateIdea from './RateIdea';
import { Row, Col, Form, Label } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Card } from 'react-bootstrap';
import moment from 'moment';

const NextLevel = (props) => {
    // console.log(props);
    const currentUser = getCurrentUser('current_user');
    const [teamResponse, setTeamResponse] = React.useState({});
    const { t } = useTranslation();
    // console.log(teamResponse, 'ideaDetails');

    // React.useEffect(() => {
    //     if (props?.ideaDetails?.response) {
    //         setTeamResponse(
    //             Object.entries(props?.ideaDetails?.response).map((e) => e[1])
    //         );
    //     } else setTeamResponse([]);
    // }, [props]);
    useEffect(() => {
        if (props?.ideaDetails) {
            setTeamResponse(props?.ideaDetails);
        }
    }, [props]);
    const files = teamResponse?.Prototype_file
        ? teamResponse?.Prototype_file.split(',')
        : [];
    const downloadFile = (item) => {
        // const link = document.createElement('a');
        // link.href = item;
        // link.download = 'upload.pdf';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        fetch(item)
            .then((response) => {
                // Convert the response to a blob
                return response.blob();
            })
            .then((blob) => {
                // Create a download link
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                const parts = item.split('/');
                link.setAttribute('download', parts[parts.length - 1]);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };
    return (
        <>
            {teamResponse ? (
                <>
                    <div className="row idea_detail_card">
                        <div className="col-12 p-0">
                            <div className="row">
                                <div className="col-lg-6">
                                    <Row>
                                        {/* <Col>
                                            <h2 className="mb-md-4 mb-3">
                                                Theme :
                                                <span className="text-capitalize fs-3">
                                                    {props?.ideaDetails?.sdg?.toLowerCase() ||
                                                        ''}
                                                </span>
                                            </h2>
                                        </Col> */}
                                        <Col>
                                            <h2 className="mb-md-4 mb-3">
                                                CID :
                                                <span className="text-capitalize fs-3">
                                                    {props?.ideaDetails
                                                        ?.idea_id || ''}
                                                </span>
                                            </h2>
                                        </Col>
                                    </Row>
                                </div>
                                {/* <div className="col-sm-8">
                                    <h2 className="mb-md-4 mb-3">
                                        SDG:{' '}
                                        <span className="text-capitalize fs-3">
                                            {props?.ideaDetails?.sdg?.toLowerCase() ||
                                                ''}
                                        </span>
                                    </h2>
                                </div>
                                <div className="col-sm-8">
                                    <h2 className="mb-md-4 mb-3">
                                        Challenge Response Id :
                                        <span className="text-capitalize fs-3">
                                            {props?.ideaDetails
                                                ?.challenge_response_id || ''}
                                        </span>
                                    </h2>
                                </div> */}
                                <div className="col-sm-4 d-flex justify-content-end">
                                    <div className="ms-auto me-sm-3 p-0">
                                        <Button
                                            btnClass="primary"
                                            size="small"
                                            label="Skip"
                                            onClick={() => props?.handleSkip()}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12 mt-3">
                                    {/* <Row className="col-lg-12">
                                        <h2>
                                            <span
                                                style={{
                                                    color: 'blue'
                                                }}
                                            >
                                                Problem Statement :{' '}
                                            </span>
                                            <span className="text-capitalize fs-3">
                                                {props?.ideaDetails?.sub_category?.toLowerCase() ||
                                                    ''}
                                            </span>
                                        </h2>
                                    </Row> */}
                                </div>
                            </div>
                        </div>

                        <div
                            className={`${
                                props?.ideaDetails?.status === 'SUBMITTED'
                                    ? 'col-12'
                                    : 'col-lg-8'
                            } order-lg-0 order-1 p-0 h-100`}
                        >
                            {/* {teamResponse?.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                    >
                                        <div className="question quiz mb-0">
                                            <b
                                                style={{
                                                    fontSize: '1.6rem'
                                                }}
                                            >
                                                {item?.question_no || ''}.{' '}
                                                {item?.question || ''}
                                            </b>
                                        </div>
                                        <div className="bg-light rounded p-5">
                                            <p
                                                style={{
                                                    fontSize: '1.4rem'
                                                }}
                                            >
                                                {item?.question_type ===
                                                'MCQ' ? (
                                                    item?.selected_option?.map(
                                                        (data, i) => {
                                                            return (
                                                                <div key={i}>
                                                                    {data || ''}
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                ) : item?.question_type ===
                                                      'TEXT' ||
                                                  item?.question_type ===
                                                      'MRQ' ? (
                                                    item?.selected_option
                                                ) : item?.question_type ===
                                                  'DRAW' ? (
                                                    <LinkComponent
                                                        item={
                                                            item.selected_option
                                                        }
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })} */}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {1}. {t('student_course.ques1')}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.theme_name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {2}. {t('student_course.ques2')}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.problem_statement}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {3}.{' '}
                                            {t(
                                                'student_course.ques3description'
                                            )}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {
                                                teamResponse?.problem_statement_description
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {4}.{' '}
                                            {t(
                                                'student_course.ques4ideatitile'
                                            )}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.idea_title}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {5}.{' '}
                                            {t('student_course.ques5solution')}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.solution_statement}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {6}.{' '}
                                            {t('student_course.ques6detailsol')}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.detailed_solution}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {7}.{' '}
                                            {t('student_course.ques7Prototype')}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.prototype_available}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            {teamResponse?.prototype_available !== 'NO' &&
                                teamResponse?.prototype_available !== '' && (
                                    <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                        <div
                                            // key={index}
                                            className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                        >
                                            <div className="question quiz mb-0">
                                                <b
                                                    style={{
                                                        fontSize: '1.6rem'
                                                    }}
                                                >
                                                    {t(
                                                        'student_course.ques8file'
                                                    )}
                                                    {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                                </b>
                                            </div>
                                            <div className="bg-light rounded p-5">
                                                {files.length > 0 &&
                                                    files.map((item, i) => (
                                                        <div key={i}>
                                                            {/* <CardTitle className="fw-bold">
                                                    {item.question}
                                                </CardTitle> */}
                                                            {/* <CardBody> */}
                                                            <a
                                                                key={i}
                                                                className="badge mb-2 bg-info p-3 ms-3"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                onClick={() =>
                                                                    downloadFile(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                {item
                                                                    .split('/')
                                                                    .pop()}
                                                            </a>
                                                            {/* </CardBody> */}
                                                        </div>
                                                    ))}
                                                {/* <p
                                        style={{
                                            fontSize: '1.4rem'
                                        }}
                                    >
                                        {teamResponse?.Prototype_file}
                                    </p> */}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {8}.{' '}
                                            {t(
                                                'student_course.ques9publication'
                                            )}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.idea_available}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* //-----------Rating section---- */}

                    <RateIdea
                        challenge_response_id={props?.ideaDetails?.idea_id}
                        evaluator_id={currentUser?.data[0]?.user_id}
                        level={'L2'}
                        setIsNextDiv={props?.setIsNextDiv}
                    />
                </>
            ) : (
                <>
                    <h2 className="my-auto text-center mt-5">
                        Details Not Available.
                    </h2>
                    <div className="text-center mt-5">
                        <Button
                            btnClass="primary"
                            size="small"
                            label="Next Idea"
                            onClick={() => {
                                props?.handleSkip();
                            }}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default NextLevel;
