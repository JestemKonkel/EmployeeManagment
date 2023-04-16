import React, {useEffect, useState} from "react";
import {Card, Col, Container, Row} from "react-bootstrap";
import UserService from "../services/user.service";
import {CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow} from "@coreui/react";
import AuthService from "../services/auth.service";
import Error from "./Error";
import {useNavigate} from "react-router-dom";



const Profile = () => {
    const [employee, setEmployee] = useState(undefined)
    const [access, setAccess] = useState(false)
    let navigate = useNavigate();

    useEffect(() => {
        UserService.getAllEmployee().then(
            (response) => {
                setEmployee(response.data);

            },
            (error) => {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();

                setEmployee(_content);
            }
        );


    }, [])

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setAccess(user.roles.includes("PERSONAL"));
        }
    }, [])
    return (
        <>
            {access ?
                <Card className="shadow-lg border rounded-3 mt-5 mb-3">
                <Card.Body>
                    <h1 style={{textAlign: "Left"}}>Employee list</h1>
                    <Row>
                        <div>
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">User</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Lastname</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Part of Job</CTableHeaderCell>
                                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {employee && employee.map((x) => {
                                        return (
                                            <CTableRow>
                                                <CTableDataCell scope="row">{x.username}</CTableDataCell>
                                                <CTableDataCell>{x.email}</CTableDataCell>
                                                <CTableDataCell scope="row">{x.name}</CTableDataCell>
                                                <CTableDataCell>{x.lastname}</CTableDataCell>
                                                <CTableDataCell>{x.time}</CTableDataCell>
                                                <CTableHeaderCell scope="col"><CButton onClick={() =>{
                                                    localStorage.setItem("detail", x.id);
                                                    navigate(`/employeeDetail?id=${x.id}`)}}>Details</CButton></CTableHeaderCell>
                                            </CTableRow>
                                        )
                                    })}
                                </CTableBody>
                            </CTable>
                        </div>
                    </Row>
                </Card.Body>
            </Card> : <Error/>}

        </ >
    );
};

export default Profile;
