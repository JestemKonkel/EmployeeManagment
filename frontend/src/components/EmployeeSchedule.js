import React, {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import {Card, Col, Container, Row} from "react-bootstrap";
import {CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow} from "@coreui/react";
import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';
import axios from "axios";
import authHeader from "../services/auth-header";
import Error from "./Error";
import Schedule from "../common/Schedule";



const Profile = () => {
    const user = AuthService.getCurrentUser();
    return (
        <>
            {user ?
                <Schedule/> : <Error/>}

        </ >
    );
};

export default Profile;
