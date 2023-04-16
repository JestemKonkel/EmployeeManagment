import React, {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import {Card, Col, Container, Row} from "react-bootstrap";
import Navbar from "../common/Navbar";
import UserService from "../services/user.service";
import {CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow} from "@coreui/react";
import EmployeeList from "./EmployeeSchedule";
import EmployeeDetail from "./EmployeeList";
import {Typography} from "@mui/material";


const Error = () => {
    return (
        <>
            <Container className="bg-light min-vh-100 d-flex flex-row">
                <Col>

                    <Container>
                        <Card>
                            <Card.Body>
                                <Typography>There is no authorized to access this resource</Typography>
                            </Card.Body>
                        </Card>
                    </Container>
                </Col>


            </Container>
        </ >


    );
};

export default Error;
