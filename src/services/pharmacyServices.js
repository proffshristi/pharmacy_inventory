import axios from "axios";

const baseurl="http://localhost:1301/data";

const pharmacyServices = {
    getAll: async()=>(await axios.get((baseurl))).data,
    addData: async(rec)=>(await axios.post(`${baseurl}`,rec)).data,
    delData: async(id)=>(await axios.delete(`${baseurl}/${id}`)).data,
    updateData: async(id,rec)=>(await axios.put(`${baseurl}/${id}`,rec)).data
    
}

export default pharmacyServices;