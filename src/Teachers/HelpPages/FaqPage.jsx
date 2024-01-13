import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getNormalHeaders } from '../../helpers/Utils';
import { Row, Col } from 'react-bootstrap';
import { Accordion } from 'react-bootstrap';
import Layout from '../Layout';
import { KEY } from '../../constants/defaultValues';
import { encryptGlobal } from '../../constants/encryptDecrypt';

const FaqPage = () => {
    const [queryId] = useState('Idea Submission');
    const [response, SetResponse] = useState([]);

    const getFaqByCategory = async (id) => {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const getFaqParam = encryptGlobal(JSON.stringify(id));
        const lang = 'locale=en';
        const final = lang.split('=');
        let enParamData = encryptGlobal(
            JSON.stringify({
                locale: final[1]
            })
        );

        axios
            .get(
                `${process.env.REACT_APP_API_BASE_URL}/faqs/getbyCategoryid/${getFaqParam}?Data=${enParamData}`,
                axiosConfig
            )
            .then((res) => {
                if (res?.status === 200) {
                    SetResponse(res?.data?.data);
                }
            })
            .catch((err) => {
                console.log(err.response);
            });
    };
    // changed
    useEffect(async () => {
        await getFaqByCategory(1);
    }, []);
    return (
        <Layout>
            <div className="faq-page">
                {queryId ? (
                    <div className="idea-section text-center container">
                        <h1>FAQ’s</h1>

                        <Row className="justify-content-center">
                            <Col md={10}>
                                <div className="collapse-sec idea-que-sec pt-2">
                                    <Accordion>
                                        {response &&
                                            response.map((que, index) => {
                                                return (
                                                    <Accordion.Item
                                                        eventKey={index}
                                                        className="mt-3 mb-4 que-items"
                                                        key={index}
                                                    >
                                                        <Accordion.Header className="question">
                                                            <div className="idea-query py-3">
                                                                <span className="avatar-txt">
                                                                    {
                                                                        que.question
                                                                    }
                                                                </span>
                                                            </div>
                                                        </Accordion.Header>
                                                        <Accordion.Body>
                                                            <div className="idea-pblms">
                                                                <div
                                                                    className="idea-pblm-list"
                                                                    key={index}
                                                                >
                                                                    <Row className="justify-content-between w-100">
                                                                        <Col
                                                                            md={
                                                                                12
                                                                            }
                                                                            xl={
                                                                                12
                                                                            }
                                                                            className="my-auto text-left"
                                                                        >
                                                                            <div
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: que.answer
                                                                                }}
                                                                            ></div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </div>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                );
                                            })}
                                    </Accordion>
                                </div>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </Layout>
    );
};

export default FaqPage;
