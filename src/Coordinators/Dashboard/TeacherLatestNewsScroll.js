/* eslint-disable indent */
/* eslint-disable no-constant-condition */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { Col, Row, Card, CardBody, CardText } from 'reactstrap';
import { getCurrentUser } from '../../helpers/Utils';
// import './scroll.scss';
import './TeacherContinousScroll.css';

import axios from 'axios';
import newIcon from '../../assets/media/blinking_new.gif';
import { encryptGlobal } from '../../constants/encryptDecrypt';
function TeacherLatestNewsScroll({ usersdata }) {
    const currentUser = getCurrentUser('current_user');

    const [newsRes, setNewRes] = useState({});
    const [news, setNews] = useState([]);
    // const containerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const togglePause = () => {
        setIsPaused(!isPaused);
    };
    // useEffect(() => {
    //     const container = containerRef.current;
    //     let scrollInterval;

    //     const startScrolling = () => {
    //         scrollInterval = setInterval(() => {
    //             if (
    //                 container.scrollTop + container.offsetHeight >=
    //                 container.scrollHeight
    //             ) {
    //                 // Reached the bottom of the list, scroll back to the top
    //                 container.scrollTop = 0;
    //             } else {
    //                 container.scrollTop += 1; // Adjust scrolling speed as desired
    //             }
    //         }, 30); // Adjust scrolling interval as desired
    //     };

    //     const stopScrolling = () => {
    //         clearInterval(scrollInterval);
    //     };
    //     container.addEventListener('mouseenter', stopScrolling);
    //     container.addEventListener('mouseleave', startScrolling);

    //     startScrolling();

    //     return () => {
    //         clearInterval(scrollInterval);
    //         container.removeEventListener('mouseenter', stopScrolling);
    //         container.removeEventListener('mouseleave', startScrolling);
    //     };
    // }, []);

    useEffect(async () => {
        let teacherParam = encryptGlobal(
            JSON.stringify({
                category: 'mentor'
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/latest_news/list?Data=${teacherParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setNews(response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <div className="latest-news-container">
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md={8} className="border-right my-auto">
                            <h2 style={{ color: 'black' }}>
                                {' '}
                                Teacher Latest News
                            </h2>
                            <div
                                // id="boxflow"
                                // ref={containerRef}
                                className="continuous-scroll-list"
                                onMouseEnter={togglePause}
                                onMouseLeave={togglePause}
                                style={{
                                    height: '200px',
                                    width: '500px'
                                    //overflow: 'auto'
                                }}
                            >
                                <div
                                    className={`scrolling-container ${
                                        isPaused ? 'paused' : ''
                                    }`}
                                >
                                    <ul>
                                        {news?.map((item, index) => (
                                            <div key={index}>
                                                <Row>
                                                    <Col
                                                        className="form-group"
                                                        col-6
                                                    >
                                                        <i
                                                            className="fa fa-bell"
                                                            style={{
                                                                color: 'blue'
                                                            }}
                                                        ></i>{' '}
                                                        {item?.details}
                                                        {/* </Col> */}
                                                        {/* <Col
                                                   
                                                > */}
                                                        {item?.file_name !=
                                                            null &&
                                                        item?.file_name !=
                                                            '' ? (
                                                            <a
                                                                className="link-item m-2 p-2"
                                                                // rel="noopener noreferrer"
                                                                href={
                                                                    item?.file_name
                                                                }
                                                                target="_blank"
                                                            >
                                                                <button className="btn btn-warning p-2 ">
                                                                    File
                                                                </button>
                                                            </a>
                                                        ) : (
                                                            ''
                                                        )}
                                                        {/* </Col> */}
                                                        {/* <Col
                                                   
                                                > */}
                                                        {item?.url != null &&
                                                        item?.url != '' ? (
                                                            <a
                                                                className="link-item"
                                                                // rel="noopener noreferrer"
                                                                href={item?.url}
                                                                target="_blank"
                                                            >
                                                                <button className="btn btn-success  ">
                                                                    Url
                                                                </button>
                                                            </a>
                                                        ) : (
                                                            ''
                                                        )}
                                                        {/* </Col> */}
                                                        {/* <Col
                                                   
                                                > */}
                                                        {item?.new_status !=
                                                            0 &&
                                                        item?.new_status !=
                                                            '' ? (
                                                            <img
                                                                className="m-2 p-2"
                                                                src={newIcon}
                                                                style={{
                                                                    width: '30px'
                                                                }}
                                                            />
                                                        ) : (
                                                            ''
                                                        )}
                                                        <hr />
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
export default TeacherLatestNewsScroll;
