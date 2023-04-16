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
import Swal from "sweetalert2";
import Error from "./Error";


const ChangePassword = () => {
    let navigate = useNavigate();


    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [repeatNewPass, setRepeatNewPass] = useState("");
    const user = AuthService.getCurrentUser();

    const onChangeOldPass = (e) => {
        const pass = e.target.value;
        setOldPass(pass);
    };

    const onChangeNewPass = (e) => {
        const pass = e.target.value;
        setNewPass(pass);
    };
    const onChangeRepeat = (e) => {
        const pass = e.target.value;
        setRepeatNewPass(pass);
    };



    const handleRegister = () => {
            if(newPass == repeatNewPass) {
                AuthService.changePass(oldPass, repeatNewPass, user.id).then(
                    () => {
                        Swal.fire({
                            icon: 'success',
                            text: 'Password changed successfully'
                        })
                    navigate("/profile")

                    },
                    (error) => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();

                        Swal.fire({
                            icon: 'warning',
                            text: resMessage

                        })

                    }
                );
            }
            else{
                Swal.fire({
                    icon: 'warning',
                    text: "Passwords doesn't match"

                })
            }
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            {user != null ?
                <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={9} lg={7} xl={6}>
                        <CCard className="mx-4">
                            <CCardBody className="p-4">

                                <div>
                                    <h1>Change Password</h1>
                                    <p className="text-medium-emphasis">Provide old and new password</p>
                                    <CInputGroup className="mb-3">
                                        <CFormInput placeholder="Old password"
                                                    type="password"
                                                    value={oldPass}
                                                    onChange={onChangeOldPass}
                                        />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CFormInput placeholder="New password"
                                                    className="form-control"
                                                    type="password"
                                                    name="lastname"
                                                    value={newPass}
                                                    onChange={onChangeNewPass}
                                        />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CFormInput placeholder="Repeat new password"
                                                    className="form-control"
                                                    type="password"
                                                    name="lastname"
                                                    value={repeatNewPass}
                                                    onChange={onChangeRepeat}
                                        />
                                    </CInputGroup>
                                    <div className="d-grid">
                                        <CButton onClick={handleRegister} color="success">Changed Password</CButton>
                                    </div>
                                </div>

                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer> : <Error/>}

        </div>
    );
};

export default ChangePassword;
