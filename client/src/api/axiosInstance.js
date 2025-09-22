import axios from 'axios'
import { baseUrl } from './api-url'

const axiosInstance=axios.create({
    baseURL:baseUrl
})




export default axiosInstance
//users image
export const usersImages=(path)=>{
  if (!path) return "";
  return `http://localhost:3000/${path.replace(/\\/g,'/')}`;
}