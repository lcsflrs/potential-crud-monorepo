import axios from "axios"

const api = axios.create({
  baseURL: "https://potential-crud.herokuapp.com/developers",
})

export default api
