/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import { Tabs } from 'antd';
import Layout from '../Pages/Layout';
import { Link } from 'react-router-dom';

import { BsUpload } from 'react-icons/bs';
import { Button } from '../../../stories/Button';
import { connect } from 'react-redux';
import { getAdminEvalutorsList } from '../../../redux/actions';
import axios from 'axios';
import { URL, KEY } from '../../../constants/defaultValues.js';

import { getNormalHeaders } from '../../../helpers/Utils';
import { useHistory } from 'react-router-dom';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../../assets/media/logout.svg';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

import { Badge } from 'react-bootstrap';
import CommonPage from '../../../components/CommonPage';
import { updateEvaluator } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import Register from '../../../Evaluator/Register';
import dist from 'react-data-table-component-extensions';
// import AddADmins from './AddAdmins';
import ClipLoader from 'react-spinners/ClipLoader';

const TicketsPage = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const district = localStorage.getItem('dist');
    const [menter, activeMenter] = useState(false);
    const [loading, setLoading] = useState(false);

    const [evaluater, activeEvaluater] = useState(false);
    const [tab, setTab] = useState('1');
    const [studentDist, setstudentDist] = useState(district ? district : '');
    const [mentorDist, setmentorDist] = useState('');
    const [newDist, setNewDists] = useState('');
    const [registerModalShow, setRegisterModalShow] = useState(false);
    const [fetchData, setFetchData] = useState(false);
    // useEffect(() => {

    //         props.getEvaluatorListAction();
    //         // } else if (tab === 4) {
    //         //     props.getAdminListAction();
    //     }
    // }, []);
    useEffect(() => {
        props.getEvaluatorListAction();
    }, []);

    const [rows, setRows] = React.useState([]);
    const [mentorRows, setMentorRows] = React.useState([]);

    const handleEdit = (item) => {
        // where we can edit user details  //
        // where item = mentor id //
        props.history.push({
            pathname: `/eadmin/edit-user-profile`,
            data: item
        });
        localStorage.setItem('mentor', JSON.stringify(item));
    };

    const handleStatus = (status, id, type, all, item) => {
        // where we can update the status Active to InActive //
        // where id = student id / mentor id  / admin id / evaluator  id//
        // where status = status //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: `You are attempting to ${
                    status.toLowerCase() === 'active'
                        ? 'activate'
                        : 'inactivate'
                } ${
                    type && type === 'student'
                        ? 'Student'
                        : type && type === 'evaluator'
                        ? 'evaluator'
                        : type && type === 'admin'
                        ? 'Admin'
                        : 'Mentor'
                }.`,
                text: 'Are you sure?',
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: status,
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    if (type && type === 'evaluator') {
                        console.warn(status, id, type);

                        dispatch(
                            updateEvaluator(
                                {
                                    status,
                                    full_name: all.user.full_name,
                                    username: all.user.username
                                },
                                id
                            )
                        );
                        setTimeout(() => {
                            props.getEvaluatorListAction();
                        }, 500);
                        swalWithBootstrapButtons.fire(
                            `${
                                type && type === 'student'
                                    ? 'Student'
                                    : type && type === 'evaluator'
                                    ? 'evaluator'
                                    : type && type === 'admin'
                                    ? 'Admin'
                                    : 'Mentor'
                            } Status has been changed!`,
                            'Successfully updated.',
                            'success'
                        );
                        // if (type && type === 'student') {
                        //     props.studentStatusUpdate({ status }, id);
                        //     setTimeout(() => {
                        //         props.getStudentListAction(studentDist);
                        //     }, 500);
                    }

                    // } else if (type && type === 'admin') {
                    //     const obj = {
                    //         full_name: all.full_name,
                    //         username: all.username,
                    //         // mobile: all.mobile,
                    //         status
                    //     };
                    //     await handleStatusUpdateInAdmin({ obj }, id);

                    //     setTimeout(() => {
                    //         props.getAdminListAction();
                    //     }, 500);
                    // } else {
                    //     const obj = {
                    //         full_name: all.full_name,
                    //         username: all.username,
                    //         // mobile: all.mobile,
                    //         status
                    //     };
                    //     props.mentorStatusUpdate(obj, id);
                    //     setTimeout(() => {
                    //         props.getAdminMentorsListAction('ALL', mentorDist);
                    //     }, 500);
                    // }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        'Not updated successfully',
                        'error'
                    );
                }
            });
    };
    const evaluatorsData = {
        data: props.evalutorsList,
        columns: [
            {
                name: 'No',
                selector: (row) => row.id,
                width: '6rem'
            },
            {
                name: 'Evaluator Name',
                selector: (row) => row.user.full_name,
                width: '20rem'
            },
            {
                name: 'Email',
                selector: (row) => row.user.username,
                width: '25rem'
            },
            {
                name: 'Mobile No',
                selector: (row) => row.mobile,
                width: '20rem'
            },
            // {
            //     name: 'District',
            //     selector: 'district',
            //     width: '11rem'
            // },
            {
                name: 'Status',
                cell: (row) => [
                    <Badge
                        key={row.mentor_id}
                        bg={`${
                            row.status === 'ACTIVE' ? 'secondary' : 'danger'
                        }`}
                    >
                        {row.status}
                    </Badge>
                ],
                width: '18rem'
            },
            {
                name: 'Actions',
                sortable: false,
                width: '25rem',
                cell: (record) => [
                    // <div
                    //     key={record.id}
                    //
                    //     onClick={() => handleSelect(record)}
                    //     style={{ marginRight: '10px' }}
                    // >
                    //     <div className="btn btn-primary btn-lg mr-5">View</div>
                    // </div>,
                    <div
                        key={record.id}
                        onClick={() => handleEdit(record)}
                        style={{ marginRight: '10px' }}
                    >
                        <div className="btn btn-primary btn-lg">EDIT</div>
                    </div>,
                    <div
                        // exact="true"
                        key={record.id}
                        className="mr-5"
                        onClick={() => {
                            let status =
                                record?.status === 'ACTIVE'
                                    ? 'INACTIVE'
                                    : 'ACTIVE';
                            handleStatus(
                                status,
                                record?.evaluator_id,
                                'evaluator',
                                record
                            );
                        }}
                    >
                        {record?.status === 'ACTIVE' ? (
                            <div className="btn btn-danger btn-lg">
                                INACTIVE
                            </div>
                        ) : (
                            <div className="btn btn-warning btn-lg">ACTIVE</div>
                        )}
                    </div>
                    // <div
                    //     key={record.id}
                    //     className="mr-5"
                    //     onClick={() => {
                    //         let status =
                    //             record?.status === 'ACTIVE'
                    //                 ? 'INACTIVE'
                    //                 : 'ACTIVE';
                    //         handleStatus(status, record?.evaluator_id, record);
                    //     }}
                    // >
                    //     {record?.status === 'ACTIVE' ? (
                    //         <div className="btn btn-danger ">INACTIVE</div>
                    //     ) : (
                    //         <div className="btn btn-warning ">ACTIVE</div>
                    //     )}
                    // </div>
                ]
            }
        ]
    };

    return (
        <Layout title="Evaluator">
            <Container className="ticket-page mt-5 mb-50 userlist">
                <Row className="mt-0 pt-3">
                    <h2>Evaluator List</h2>
                    <div className="text-right">
                        <Button
                            label={'Add New Evaluator'}
                            btnClass="primary"
                            size="small"
                            shape="btn-square"
                            Icon={BsUpload}
                            onClick={() => setRegisterModalShow(true)}
                        />
                    </div>
                    <div className="ticket-data">
                        <div className="my-5">
                            <DataTableExtensions
                                {...evaluatorsData}
                                exportHeaders
                                print={false}
                                export={false}
                            >
                                <DataTable
                                    responsive={true}
                                    data={props.evalutorsList}
                                    defaultSortField="id"
                                    defaultSortAsc={false}
                                    pagination
                                    highlightOnHover
                                    fixedHeader
                                    subHeaderAlign={Alignment.Center}
                                />
                            </DataTableExtensions>
                        </div>
                    </div>
                </Row>
            </Container>
            {registerModalShow && (
                <Register
                    show={registerModalShow}
                    setShow={setRegisterModalShow}
                    onHide={() => setRegisterModalShow(false)}
                />
            )}
        </Layout>
    );
};

const mapStateToProps = ({
    adminEvalutors
    // adminMentors,
    // studentRegistration,
    // admin
}) => {
    const { evalutorsList } = adminEvalutors;
    // const { adminData } = admin;
    // const { mentorsList, totalItems } = adminMentors;
    // const { studentList, dists } = studentRegistration;
    return {
        evalutorsList
        // adminData,
        // mentorsList,
        // totalItems,
        // studentList,
        // dists
    };
};
export default connect(mapStateToProps, {
    // getAdminMentorsListAction: getAdminMentorsList,
    // getStudentListAction: getStudentRegistationData,
    // getDistrictsListAction: getDistrictData,
    getEvaluatorListAction: getAdminEvalutorsList
    // getAdminListAction: getAdmin,
    // mentorStatusUpdate: updateMentorStatus,
    // studentStatusUpdate: updateStudentStatus
})(TicketsPage);
