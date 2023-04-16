import React, {useState, useEffect, useRef} from "react";
import UserService from "../services/user.service";
import {useNavigate} from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import {isEmail} from "validator";
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormInput, CFormSelect,
    CInputGroup,
    CInputGroupText,
    CRow
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilLockLocked, cilUser} from "@coreui/icons";

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

const Home = () => {
    const [content, setContent] = useState("");
    let navigate = useNavigate();
    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [time, setTime] = useState("");
    const [paid, setPaid] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [timeofJob, setTimeOfJob] = useState("");
    const [message, setMessage] = useState("");
    const role = ["personal"];

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
        setPaid(paid);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleRegister = (e) => {
        e.preventDefault();

        setMessage("");
        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            AuthService.register(username, name, lastname, email, time, paid, password, role).then(
                (response) => {
                    setMessage(response.data.message);
                    setSuccessful(true);
                    navigate("/login");
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setMessage(resMessage);
                    setSuccessful(false);
                }
            );
        }
    };

    useEffect(() => {
        UserService.checkPersonalisExist().then(
            (response) => {
               setContent(response.data)

            },
            (error) => {
                setContent(error.response.data);
            }
        );
    }, []);

    useEffect(() => {
        if (content) {
            navigate("/login")
        }
    });

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            {!content &&
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={9} lg={7} xl={6}>
                            <CCard className="mx-4 ">
                                <CCardBody className="p-4 ">
                                    <Form onSubmit={handleRegister} ref={form}>
                                        <div>
                                            <h1>Welcome!!</h1>
                                            <span>It's your first time with app</span>
                                            <p className="text-medium-emphasis">Create personal account</p>
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
                                                    validations={[required]}
                                                />
                                            </CInputGroup>
                                            <CInputGroup className="mb-3">
                                                <CFormInput placeholder="Lastname of employee"
                                                    className="form-control"
                                                    name="lastname"
                                                    value={lastname}
                                                    onChange={onChangeLastname}
                                                    validations={[required]}
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
                                                <CFormInput placeholder="Provide a paid for hour"
                                                            className="form-control"
                                                            name="lastname"
                                                            value={paid}
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
                                                <CButton color="success" type="submit">Create Account</CButton>
                                            </div>
                                        </div>

                                        {message && (
                                            <div className="form-group">
                                                <div
                                                    className={"alert alert-danger"}
                                                    role="alert"
                                                >
                                                    {message}
                                                </div>
                                            </div>
                                        )}
                                        <CheckButton style={{display: "none"}} ref={checkBtn}/>
                                    </Form>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            }
        </div>
    );
};

export default Home;
