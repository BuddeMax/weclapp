import axios from "axios";

const PATIENT_API_BASE_URL = "https://webtechprojekt.onrender.com/patients";
const PATIENTDETAILS_API_BASE_URL = "https://webtechprojekt.onrender.com/patient";

class PatientService {
  getPatients() {
    return axios.get(PATIENT_API_BASE_URL);
  }

  getPatient(patientId) {
    return axios.get(`${PATIENTDETAILS_API_BASE_URL}/${patientId}`);
  }
}

export default new PatientService();
//test



