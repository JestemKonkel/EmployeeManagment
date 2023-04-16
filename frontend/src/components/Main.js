import React, {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import {Card, Col, Container, Row} from "react-bootstrap";
import Navbar from "../common/Navbar";
import UserService from "../services/user.service";
import {CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow} from "@coreui/react";
import EmployeeSchedule from "./EmployeeSchedule";
import EmployeeList from "./EmployeeList";


const Main = () => {

    const [showModeratorBoard, setShowModeratorBoard] = useState(false);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setShowModeratorBoard(user.roles.includes("PERSONAL"));
        }


    }, [])
    return (
        <>
            <Navbar/>
            <Container className="bg-light min-vh-100 d-flex flex-row">
                <Col>

                    <Container>
                        {showModeratorBoard ?
                            <EmployeeList/> : <EmployeeSchedule/>
                        }
                    </Container>
                </Col>


            </Container>
        </ >


    );
};

export default Main;
