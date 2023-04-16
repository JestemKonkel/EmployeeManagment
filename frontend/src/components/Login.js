import React, {useState, useRef, useEffect} from "react";
import {Link, useNavigate} from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";
import {
    CButton,
    CCard,
    CCardBody, CCardGroup,
    CCol,
    CContainer,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilLockLocked, cilUser} from "@coreui/icons";
import UserService from "../services/user.service";
import EmployeeDetail from "./EmployeeList";
import EmployeeList from "./EmployeeSchedule";
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

const Login = () => {
    let navigate = useNavigate();

    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [access, setAccess] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"))

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);


        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            AuthService.login(username, password).then(
                () => {
                    navigate("/main");
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setLoading(false);
                    setMessage(resMessage);

                }
            );
        } else {
            setLoading(false);
        }
    };
    useEffect(() => {
        UserService.checkPersonalisExist().then(
            (response) => {
                setAccess(response.data)

            },
            (error) => {
                setAccess(error.response.data)
            }
        );

        if (user !== null) {
            navigate("/main")
        }
    });
    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            {access ?
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={8}>
                            <CCardGroup>
                                <CCard className="p-4">
                                    <CCardBody>
                                        <Form onSubmit={handleLogin} ref={form}>
                                            <h1>Login</h1>
                                            <p className="text-medium-emphasis">Sign In to your account</p>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilUser}/>
                                                </CInputGroupText>
                                                <CFormInput placeholder="Username" autoComplete="username" type="text"
                                                            className="form-control"
                                                            name="username"
                                                            value={username}
                                                            onChange={onChangeUsername}
                                                            validations={[required]}/>
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
                                                    validations={[required]}
                                                />
                                            </CInputGroup>

                                            <CButton color="primary" className="px-4" type="submit">
                                                Login
                                            </CButton>

                                            {message && (
                                                <div
                                                    className={"alert alert-danger"}
                                                    role="alert"
                                                >
                                                    {message}
                                                </div>
                                            )}
                                            <CheckButton style={{display: "none"}} ref={checkBtn}/>
                                        </Form>
                                    </CCardBody>
                                </CCard>
                                <CCard className="text-white bg-primary py-5" style={{width: '44%'}}>
                                    <CCardBody className="text-center">
                                        <div>
                                            <h2>Welcome!!!</h2>
                                            <p>It seems that personal account was created &nbsp;
                                                That means you can log in and start working!!!
                                                &nbsp; If employee account was made then is also available to log in
                                            </p>
                                        </div>
                                    </CCardBody>
                                </CCard>
                            </CCardGroup>
                        </CCol>
                    </CRow>
                </CContainer> : <Error />
            }


        </div>
    );
};

export default Login;
