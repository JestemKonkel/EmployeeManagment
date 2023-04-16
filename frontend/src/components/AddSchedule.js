import React, {useEffect, useState} from "react";
import UserService from "../services/user.service";
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CFormLabel,
    CFormSelect,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from "@coreui/react";
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/en-gb';
import {MobileDateTimePicker} from "@mui/x-date-pickers";
import Navbar from "../common/Navbar";
import AuthService from "../services/auth.service";
import Swal from "sweetalert2";
import axios from "axios";
import authHeader from "../services/auth-header";
import {Typography} from "@mui/material";
import CIcon from "@coreui/icons-react";
import {cilArrowLeft, cilArrowRight, cilList} from "@coreui/icons";
import dayjs from "dayjs";
import Error from "./Error";


const Profile = () => {
    const [employee, setEmployee] = useState(undefined)
    const [day, setDay] = useState(new Date())
    const [schedule, setSchedule] = useState(undefined)
    const [startPicker, setStartPicker] = useState("")
    const [endPicker, setEndPicker] = useState("")
    const [checkEmployee, setCheckEmployee] = useState("")
    const [access, setAccess] = useState(false)

    const API_SHIFTS = "http://localhost:8082/api/shift/";
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


    const fetchData = day.toLocaleDateString("zh-Hans-CN")
    useEffect(() => {
        axios.get(API_SHIFTS + `personalSchedule?date=${fetchData}`, {headers: authHeader()}).then(
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


    }, [])
    const determineDateAndTime = () => {
        const employeeFind = employee.find(x => {
            return x.id == checkEmployee;
        })
        const newStartDate = new Date(startPicker)
        const startDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), newStartDate.getDate()).toLocaleDateString('en-GB');
        const startTime = new Date(0, 0, 0, newStartDate.getHours(), newStartDate.getMinutes()).toLocaleTimeString();

        const newEndDate = new Date(endPicker)
        const endDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth(), newEndDate.getDate()).toLocaleDateString('en-GB');
        const endTime = new Date(0, 0, 0, newEndDate.getHours(), newEndDate.getMinutes()).toLocaleTimeString();

        if(startDate != "Invalid Date" && endDate != "Invalid Date" && startTime != "Invalid Date" && endTime != "Invalid Date"){
            let diffHours = (newEndDate.getTime() - newStartDate.getTime()) / 1000;
            diffHours /= (60 * 60).toFixed(2);
            diffHours -= 0.25

            AuthService.addSchedule(startDate, endDate, startTime, endTime, employeeFind, diffHours).then(
                (response) => {
                    if(response.status == 201){
                        Swal.fire({
                            icon: 'success',
                            titleText: `Shift add successfuly for ${employeeFind.name} ${employeeFind.lastname}`,
                            text: response.data.message
                        })
                    }

                },
                (error) => {
                    const resMessage =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString();

                    Swal.fire({
                        titleText: "Error occurs while adding shift!",
                        icon: 'warning',
                        text: resMessage

                    })

                }
            );
        }
        else{
            Swal.fire({
                icon: 'warning',
                text: 'Provide date and time from pickers'

            })
        }
    }
    const now = dayjs();
    const nextMonth = now.month(now.month() + 1).date(1).hour(0).minute(0).second(0);
    const lastMonth = now.month(now.month() + 2).date(0).hour(0).minute(0).second(0);

    return (
        <>
            <Navbar/>
            {access ?
                <CContainer className="bg-light min-vh-100">
                <CCard className="shadow-lg border rounded-3 mt-5 mb-3">
                    <CCardBody>
                        <h1 style={{textAlign: "left"}}>Schedule Managment</h1>

                        <CRow>

                            <CCol>
                                <CFormLabel htmlFor="validationCustom02">Start work</CFormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                                    <DemoContainer components={['MobileDateTimePicker']}>
                                        <MobileDateTimePicker minutesStep={15} minDate={nextMonth} maxDate={lastMonth}  onChange={(e) => setStartPicker(e)}/>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </CCol>
                            <CCol>
                                <CFormLabel htmlFor="validationCustom02">End Work</CFormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                                    <DemoContainer components={['MobileDateTimePicker']}>
                                        <MobileDateTimePicker minutesStep={15} minDate={nextMonth} maxDate={lastMonth} onChange={(e) => setEndPicker(e)}/>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </CCol>

                        </CRow>
                        <hr/>
                        <CRow>
                            <CCol md="4">
                                <CFormSelect id="validationCustom02" onChange={(e) => setCheckEmployee(e.target.value)}>
                                    <option value="Employee...">Employee...</option>
                                    {employee && employee.map((x) => {
                                        return (
                                            <option value={x.id}>{x.name} {x.lastname}</option>
                                        )
                                    })}
                                </CFormSelect>
                            </CCol>

                            <CCol>
                                <CButton onClick={determineDateAndTime}>
                                    Add shift
                                </CButton>
                            </CCol>

                        </CRow>
                    </CCardBody>
                </CCard>
                <CRow >
                    <CCol><CIcon icon={cilArrowLeft} size="lg"/></CCol>
                    <CCol><Typography style={{textAlign: "center"}}>{day.toLocaleDateString("zh-Hans-CN")}</Typography></CCol>
                    <CCol><Typography style={{textAlign: "right"}}><CButton><CIcon icon={cilArrowRight} size="lg"/></CButton></Typography></CCol>
                </CRow>
                <hr/>
                <CTable>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">Name & Lastname</CTableHeaderCell>
                            <CTableHeaderCell scope="col">From</CTableHeaderCell>
                            <CTableHeaderCell scope="col">To</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Hours</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {schedule && schedule.map((x) => {
                            return (
                                <CTableRow>
                                    <CTableDataCell scope="row">{x.user.name} {x.user.lastname}</CTableDataCell>
                                    <CTableDataCell scope="row">{x.startTime}</CTableDataCell>
                                    <CTableDataCell>{x.endTime}</CTableDataCell>
                                    <CTableDataCell scope="row">{x.hours}</CTableDataCell>
                                </CTableRow>
                            )
                        })}
                    </CTableBody>
                </CTable>
            </ CContainer> : <Error/>}

        </ >
    );
};

export default Profile;
