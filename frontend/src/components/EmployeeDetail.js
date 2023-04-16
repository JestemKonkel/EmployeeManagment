import React, {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import {Card, Container, Row} from "react-bootstrap";
import Navbar from "../common/Navbar";

import {
    CCard,
    CCardBody,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow
} from "@coreui/react";
import axios from "axios";
import authHeader from "../services/auth-header";
import Error from "./Error";
import Schedule from "../common/Schedule";

const Main = () => {
    const [profile, setProfile] = useState("")
    const API_USER = "http://localhost:8082/api/user/";
    const user = AuthService.getCurrentUser();

    useEffect(() => {
        if(user != null){
            axios.get(API_USER + `find/${localStorage.getItem("detail")}`, { headers: authHeader() }).then(
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
                <Schedule/> : <Error/>
            }

        </ >


    );
};

export default Main;
