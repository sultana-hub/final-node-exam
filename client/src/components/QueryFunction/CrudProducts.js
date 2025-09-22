
import axiosInstance from '../../api/axiosInstance';
import { endPoints } from '../../api/api-url';

export const getAllProducts = async () => {
  try {
    const res = await axiosInstance.get(endPoints.list);
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
};


export const getSingleProduct = async (id) => {
  try {
    const response = await axiosInstance.get(`${endPoints.single}/${id}`);
    console.log("response from api", response);
    return response.data; // or response.data.data based on your backend
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error.message);
    throw error; // rethrow to handle in the component
  }
};



export const searchProduct = async (keyword) => {
  try {
    const response = await axiosInstance.get(`${endPoints.search}?keyword=${keyword}`);
    return response.data; 
  } catch (error) {
    console.error(`Error searching products with keyword "${keyword}":`, error.message);
    throw error; 
  }
};


