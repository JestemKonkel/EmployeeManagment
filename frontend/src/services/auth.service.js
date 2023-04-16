import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8082/api/auth/";
const API_SHIFTS = "http://localhost:8082/api/shift/";

const register = (username, name, lastname, email, time, perHour, password, role) => {
  return axios.post(API_URL + "signup", {
    username,
    name,
    lastname,
    email,
    time,
      perHour,
    password,
    role,
  }, { headers: authHeader() });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const addSchedule = (startData, endData, startTime, endTime ,user ,hours) => {
  return axios.post(API_SHIFTS + "add", {
        user,
        startData,
        endData,
        startTime,
        endTime,
        hours
      }, { headers: authHeader() });
};

const changePass = (oldPass, newPass, user) => {
    return axios.put(API_URL + "changePass", {
        oldPass,
        newPass,
        user
    });
};


const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
    addSchedule,
  login,
  logout,
  getCurrentUser,
    changePass
};

export default AuthService;
