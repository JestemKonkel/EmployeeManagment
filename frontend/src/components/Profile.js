import React, {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import {Card, Col, Container, Row} from "react-bootstrap";
import Navbar from "../common/Navbar";
import UserService from "../services/user.service";
import EmployeeList from "./EmployeeSchedule";
import EmployeeDetail from "./EmployeeList";
import {
    CCard,
    CCardBody, CDropdownItem, CNavItem, CNavLink,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow
} from "@coreui/react";
import axios from "axios";
import authHeader from "../services/auth-header";
import {NavLink} from "react-router-dom";
import CIcon from "@coreui/icons-react";
import {cilArrowLeft, cilUser} from "@coreui/icons";
import Error from "./Error";


const Main = () => {
    const [profile, setProfile] = useState("")
    const API_USER = "http://localhost:8082/api/user/";
    const user = AuthService.getCurrentUser();

    useEffect(() => {
        if(user != null){
            axios.get(API_USER + `find/${user.id}`, { headers: authHeader() }).then(
                (response) => {
                    setProfile(response.data);

                },
                (error) => {
                    const _content =
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString();

                    setProfile(_content);
                }
            );
        }
    }, [])
    return (
        <>
            <Navbar />
            {user != null ?
                <Container className="bg-light min-vh-100 ">
                    <CCard className="shadow-lg border rounded-3 mt-5 mb-3">
                        <CCardBody>
                            <h1 style={{textAlign: "Left"}}>Employee Detail</h1>
                            <Row>
                                <div>
                                    <CTable>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell scope="col">User</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Lastname</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            <CTableRow>
                                                <CTableDataCell scope="row">{profile.username}</CTableDataCell>
                                                <CTableDataCell>{profile.email}</CTableDataCell>
                                                <CTableDataCell scope="row">{profile.name}</CTableDataCell>
                                                <CTableDataCell>{profile.lastname}</CTableDataCell>
                                            </CTableRow>
                                        </CTableBody>
                                    </CTable>
                                </div>
                            </Row>
                        </CCardBody>
                    </CCard>

                </Container> : <Error/>
            }

        </ >


    );
};

export default Main;
