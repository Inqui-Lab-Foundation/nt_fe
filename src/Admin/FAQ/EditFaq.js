/* eslint-disable indent */
import '../../Student/Pages/Student.scss';
import React, { useEffect, useState, Fragment } from 'react';
import {
    Container,
    Row,
    Col,
    FormGroup,
    Label,
    Card,
    CardBody
} from 'reactstrap';
import { InputBox } from '../../stories/InputBox/InputBox';

import { DropDownWithSearch } from '../../stories/DropdownWithSearch/DropdownWithSearch';

import { Button } from '../../stories/Button';

import { useFormik } from 'formik';
import * as Yup from 'yup';
// import { BreadcrumbTwo } from '../../stories/BreadcrumbTwo/BreadcrumbTwo';
//import { RichText } from '../../stories/RichText/RichText';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import Layout from '../Layout';
import { URL, KEY } from '../../constants/defaultValues';
import {
    getNormalHeaders,
    openNotificationWithIcon
} from '../../helpers/Utils';

import AddFaqCategoryModal from './AddFaqCategoryModal';

import plusIcon from '../../assets/media/img/plus-icon.svg';
import axios from 'axios';

//import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { useHistory, useParams } from 'react-router-dom';

import 'bootstrap/dist/js/bootstrap.min.js';
import './style.scss';

const EditFaq = (props) => {
    const [categoriesList, setCategoriesList] = useState([]);
    const [faqData, setFaqData] = useState({});
    const [showFaqCatModal, setShowFaqCatModal] = useState(false);
    const [defaultCategory, setDefaultCategory] = useState({
        label: '',
        value: ''
    });
    // const [editorState, ] = useState(() =>
    //     EditorState.createEmpty()
    // );
    const history = useHistory();

    let { faqid } = useParams();

    // const handleEditorChange = (state) => {
    //     setEditorState(state);
    //     formik.setFieldValue(
    //         'answer',
    //         state.getCurrentContent().getPlainText()
    //     );
    // };

    const formik = useFormik({
        initialValues: {
            faq_category_id: faqData?.faq_category_id,
            question: faqData?.question,
            answer: faqData?.answer,
            status: 'ACTIVE'
        },

        validationSchema: Yup.object({
            faq_category_id: Yup.string().required('required'),
            question: Yup.string().required('required'),
            answer: Yup.string().required('required')
        }),

        onSubmit: async (values) => {
            const axiosConfig = getNormalHeaders(KEY.User_API_Key);
            const faqeditparam = encryptGlobal(
                JSON.stringify({
                    faq_id: faqid
                })
            );
            return await axios
                .put(
                    `${process.env.REACT_APP_API_BASE_URL}/faqs/editfaqandtranslation?Data=${faqeditparam}`,
                    JSON.stringify(values, null, 2),
                    axiosConfig
                )
                .then((faqsubmitRest) => {
                    if (faqsubmitRest?.status == 200) {
                        openNotificationWithIcon(
                            'success',
                            'Faq updated Sucessfully',
                            ''
                        );
                        props.history.push('/admin/faq');
                    }
                })
                .catch((err) => {
                    return err.response;
                });
        }
    });

    const selectCategory = {
        label: 'Select FAQ category',
        options: categoriesList,
        className: 'defaultDropdown'
    };

    const update = {
        label: 'Update Changes',
        size: 'small'
    };

    const discard = {
        label: 'Discard',
        size: 'small',
        btnClass: 'primary'
    };

    const getFaqCategoryList = async () => {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        return await axios
            .get(`${URL.getFaqCategoryList}`, axiosConfig)
            .then((categoryListRes) => {
                if (categoryListRes?.status == 200) {
                    let dataValue = categoryListRes?.data?.data[0]?.dataValues;
                    if (dataValue) {
                        let categoriesOptions = [];
                        dataValue.map((item) => {
                            let option = {
                                label: item.category_name,
                                value: item.faq_category_id
                            };
                            categoriesOptions.push(option);
                        });
                        setCategoriesList(categoriesOptions);
                    }
                }
            })
            .catch((err) => {
                return err.response;
            });
    };

    const getFaqList = async () => {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const faqidparam = encryptGlobal(JSON.stringify(faqid));
        return await axios
            .get(`${URL.getFaqList}/${faqidparam}`, axiosConfig)
            .then((faqResData) => {
                if (faqResData?.status == 200) {
                    let dataValue = faqResData?.data?.data[0];
                    if (dataValue) {
                        setFaqData(dataValue);
                        formik.setFieldValue('question', dataValue?.question);
                        formik.setFieldValue('answer', dataValue?.answer);
                        formik.setFieldValue(
                            'faq_category_id',
                            dataValue?.faq_category_id
                        );
                    }
                }
            })
            .catch((err) => {
                return err.response;
            });
    };

    const toggleFaqCatModal = () => {
        setShowFaqCatModal((showFaqCatModal) => !showFaqCatModal);
    };
    useEffect(async () => {
        await getFaqCategoryList();
        await getFaqList();
    }, []);

    const updateFaqCatList = async () => {
        await getFaqCategoryList();
        toggleFaqCatModal();
    };

    useEffect(() => {}, [formik.values, formik.errors]);

    useEffect(() => {
        if (Object.keys(faqData).length > 0 && categoriesList.length > 0) {
            let defaultCategoryValue = categoriesList.find(
                (eachFaqCat) => eachFaqCat.value == faqData.faq_category_id
            );

            setDefaultCategory(defaultCategoryValue);
        }
    }, [categoriesList, faqData]);

    useEffect(() => {}, [defaultCategory]);

    return (
        <Layout>
            <Container className="EditPersonalDetails pt-3 pt-xl-5">
                {/* <UsersPage /> */}
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3 className="mb-5">Edit FAQ</h3>
                        <Row className=" article-header mb-50">
                            <Col
                                md={12}
                                className=" d-flex justify-content-center flex-column"
                            >
                                <Card className="aside p-4">
                                    <CardBody>
                                        <FormGroup className="form-row row">
                                            <Col
                                                className="form-group mb-5  mb-md-0"
                                                md={12}
                                            >
                                                <Label className="mb-2">
                                                    Select FAQ category
                                                </Label>

                                                <Col
                                                    className="form-group"
                                                    md={12}
                                                >
                                                    <DropDownWithSearch
                                                        {...selectCategory}
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={[
                                                            defaultCategory
                                                        ]}
                                                        onChange={(option) => {
                                                            formik.setFieldValue(
                                                                'faq_category_id',
                                                                option[0].value
                                                            );
                                                        }}
                                                        name="faq_category_id"
                                                        id="faq_category_id"
                                                    />

                                                    {formik.errors
                                                        .faq_category_id ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .faq_category_id
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>

                                                <Col
                                                    className="form-group mt-5  mb-md-0"
                                                    md={12}
                                                >
                                                    <div
                                                        className="add-category-container"
                                                        onClick={() =>
                                                            toggleFaqCatModal()
                                                        }
                                                    >
                                                        <img
                                                            src={plusIcon}
                                                            className="mx-2 mb-2"
                                                        ></img>
                                                        <span className="mb-2">
                                                            Create New Category
                                                        </span>
                                                    </div>
                                                </Col>
                                            </Col>
                                        </FormGroup>
                                    </CardBody>
                                </Card>

                                <div className="mb-24 mt-5">
                                    <span className="main-title">
                                        FAQ Topic
                                    </span>
                                </div>

                                <Card className="aside p-4 mb-5">
                                    <>
                                        <Col
                                            className="form-group mb-5  mb-md-0"
                                            md={12}
                                        >
                                            <Label className="mb-2">
                                                FAQ question
                                            </Label>
                                            <Col className="form-group" md={12}>
                                                <InputBox
                                                    className="defaultInput"
                                                    label="InputBox"
                                                    name="question"
                                                    placeholder="Enter FAQ question here..."
                                                    type="text"
                                                    value={
                                                        formik.values.question
                                                    }
                                                    onChange={(e) => {
                                                        return formik.setFieldValue(
                                                            'question',
                                                            e.target.value
                                                        );
                                                    }}
                                                />

                                                {formik.errors.question ? (
                                                    <small className="error-cls">
                                                        {formik.errors.question}
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Col>

                                        <Col
                                            className="form-group mb-5  mb-md-0"
                                            md={12}
                                        >
                                            <Label className="mb-2 mt-5">
                                                FAQ answer
                                            </Label>
                                            <Col className="form-group" md={12}>
                                                <textarea
                                                    className="form-control form-control-lg"
                                                    rows="8"
                                                    name="answer"
                                                    value={formik.values.answer}
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    style={{
                                                        fontSize: '2rem'
                                                    }}
                                                ></textarea>
                                                {formik.errors.answer ? (
                                                    <small className="error-cls">
                                                        {formik.errors.answer}
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Col>
                                    </>
                                </Card>

                                <hr className="my-5 w-100 mb-4 clearfix" />
                                <div className="row mb-4 justify-content-between">
                                    <div className="col-6">
                                        <Button
                                            {...discard}
                                            type="cancel"
                                            onClick={() => history.goBack()}
                                        />
                                    </div>
                                    <div className="col-6 text-right">
                                        <Button
                                            {...update}
                                            type="button"
                                            btnClass={
                                                !(
                                                    formik.dirty &&
                                                    formik.isValid
                                                )
                                                    ? 'default'
                                                    : 'primary'
                                            }
                                            onClick={formik.handleSubmit}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>

                    <AddFaqCategoryModal
                        show={showFaqCatModal}
                        toggleFaqCatModal={toggleFaqCatModal}
                        updateFaqCatList={updateFaqCatList}
                    />
                </Row>
            </Container>
        </Layout>
    );
};

export default EditFaq;
