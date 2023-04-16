import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8082/api/test/";


const checkPersonalisExist = () => {
  return axios.get(API_URL + "check");
};

const getAllEmployee = () => {
  return axios.get(API_URL + "all", { headers: authHeader() });
};

const getTimeOfJob = () => {
  return axios.get(API_URL + "timeOfJob", { headers: authHeader() });
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};


const UserService = {
  checkPersonalisExist,
  getAllEmployee,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getTimeOfJob
};

export default UserService;
