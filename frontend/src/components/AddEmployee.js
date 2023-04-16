import React, {useState, useRef, useEffect} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {isEmail} from "validator";

import AuthService from "../services/auth.service";
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CFormInput, CFormSelect,
    CInputGroup,
    CInputGroupText,
    CRow, CTableDataCell, CTableRow
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilLockLocked, cilUser} from '@coreui/icons'
import {Alert} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import authHeader from "../services/auth-header";
import UserService from "../services/user.service";
import Error from "./Error";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const validEmail = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};


const vname = (value) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};
const vlastname = (value) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};
const vusername = (value) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};
const vpassword = (value) => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

const Register = () => {
    const form = useRef();
    const checkBtn = useRef();
    let navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [time, setTime] = useState("");
    const [perHour, setPerHour] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [timeofJob, setTimeOfJob] = useState("");
    const [access, setAccess] = useState(false);

    useEffect(() => {
        UserService.getTimeOfJob().then(
            (response) => {
                setTimeOfJob(response.data);

            },
            (error) => {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();

                setTimeOfJob(_content);
            }
        );


    }, [])
    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setAccess(user.roles.includes("PERSONAL"));
        }


    }, [])

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangeName = (e) => {
        const name = e.target.value;
        setName(name);
    };
    const onChangeLastname = (e) => {
        const lastname = e.target.value;
        setLastname(lastname);
    };

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangeTime = (e) => {
        const time = e.target.value;
        setTime(time);
    };

    const onChangePaid = (e) => {
        const paid = e.target.value;
        setPerHour(paid);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleRegister = (e) => {
        e.preventDefault();

        setMessage("");

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            AuthService.register(username, name, lastname, email, time, perHour, password).then(
                (response) => {
                    setMessage(response.data.message);
                    navigate("/profile")

                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setMessage(resMessage);

                }
            );
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            {access ?
                <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={9} lg={7} xl={6}>
                        <CCard className="mx-4">
                            <CCardBody className="p-4">
                                <Form onSubmit={handleRegister} ref={form}>
                                    <div>
                                        <h1>Create Employee</h1>
                                        <p className="text-medium-emphasis">Provide a login data for new employee</p>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser}/>
                                            </CInputGroupText>
                                            <CFormInput placeholder="Username" autoComplete="username" type="text"
                                                        className="form-control"
                                                        name="username"
                                                        value={username}
                                                        onChange={onChangeUsername}
                                                        validations={[required, vusername]}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>@</CInputGroupText>
                                            <CFormInput placeholder="Email" autoComplete="email" type="text"
                                                        className="form-control"
                                                        name="email"
                                                        value={email}
                                                        onChange={onChangeEmail}
                                                        validations={[required, validEmail]}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CFormInput placeholder="Name of employee"
                                                        className="form-control"
                                                        name="name"
                                                        value={name}
                                                        onChange={onChangeName}
                                                        validations={[required, vname]}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CFormInput placeholder="Lastname of employee"
                                                        className="form-control"
                                                        name="lastname"
                                                        value={lastname}
                                                        onChange={onChangeLastname}
                                                        validations={[required, vlastname]}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">

                                            <CFormSelect aria-label="Part of Job" onChange={onChangeTime} >
                                                <option>Choose...</option>
                                                {timeofJob && timeofJob.map((x) => {
                                                    return (
                                                        <option >{x}</option>
                                                    )
                                                })}
                                            </CFormSelect>

                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CFormInput placeholder="Earn for hour"
                                                        className="form-control"
                                                        name="lastname"
                                                        value={perHour}
                                                        onChange={onChangePaid}
                                                        validations={[required]}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilLockLocked}/>
                                            </CInputGroupText>
                                            <CFormInput
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                value={password}
                                                onChange={onChangePassword}
                                                validations={[required, vpassword]}
                                            />
                                        </CInputGroup>
                                        <div className="d-grid">
                                            <CButton color="success">Create Account</CButton>
                                        </div>
                                    </div>

                                    {message && (
                                        <Alert
                                            className={"alert alert-danger"}
                                            variant="alert"
                                        >
                                            {message}
                                        </Alert>
                                    )}
                                    <CheckButton style={{display: "none"}} ref={checkBtn}/>
                                </Form>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer> : <Error/>}

        </div>
    );
};

export default Register;
