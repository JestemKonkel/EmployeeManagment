import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './scss/style.scss'

import Login from "./components/Login";
import Home from "./components/Home";
import Main from "./components/Main";

import AddEmployee from "./components/AddEmployee";
import AddSchedule from "./components/AddSchedule";
import ChangePassword from "./components/ChangePassword";
import Profile from "./components/Profile";
import EmployeeDetail from "./components/EmployeeDetail";


const App = () => {
  return (
    <div>


      <div className="bg-light min-vh-50 ">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/addEmployee" element={<AddEmployee/>} />
          <Route path="/addSchedule" element={<AddSchedule/>} />
          <Route path="/changePassword" element={<ChangePassword/>} />
          <Route path="/main" element={<Main/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/employeeDetail" element={<EmployeeDetail/>} />
        </Routes>
      </div>

    </div>
  );
};

export default App;
