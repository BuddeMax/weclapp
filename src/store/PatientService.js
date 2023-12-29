import axios from "axios";

const PATIENT_API_BASE_URL = "http://localhost:8080/patients";
const PATIENTDETAILS_API_BASE_URL = "http://localhost:8080/patient";

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



