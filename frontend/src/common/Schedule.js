import React, {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import {Card, Container, Row} from "react-bootstrap";
import {CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow} from "@coreui/react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import axios from "axios";
import authHeader from "../services/auth-header";



const Profile = () => {
    const user = AuthService.getCurrentUser();
    const [schedule, setSchedule] = useState(undefined)
    const API_SHIFTS = "http://localhost:8082/api/shift/";

    useEffect(() => {
        if (user) {
            axios.get(API_SHIFTS + `employeeSchedule?user=${localStorage.getItem("detail")}`, { headers: authHeader() }).then(
                (response) => {
                    setSchedule(response.data);

                },
                (error) => {
                    const _content =
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString();

                    setSchedule(_content);
                }
            );
        }

    }, [])


    return (
        <>
        <Container className="bg-light min-vh-100">
                <Card className="shadow-lg border rounded-3 mt-5 mb-3">
                    <Card.Body>
                        <h1 style={{textAlign: "Left"}}>Schedule</h1>
                        <Row>
                            <div>
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell scope="col">Day</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">From</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">To</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Hours</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {schedule && schedule.map((x) => {
                                            return (
                                                <CTableRow>
                                                    <CTableDataCell scope="row">{x.startData}</CTableDataCell>
                                                    <CTableDataCell scope="row">{x.startTime}</CTableDataCell>
                                                    <CTableDataCell>{x.endTime}</CTableDataCell>
                                                    <CTableDataCell scope="row">{x.hours}</CTableDataCell>
                                                </CTableRow>
                                            )
                                        })}
                                    </CTableBody>
                                </CTable>
                            </div>
                        </Row>
                    </Card.Body>
                </Card>
        </Container>

        </ >
    );
};

export default Profile;
