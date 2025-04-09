import createAxiosInstance from "../utils/axiosInstance";

const axiosInstance = createAxiosInstance(import.meta.env.VITE_EXPENSE_API_URL);

const getAllExpenses = async () => {
  try {
    const response = await axiosInstance.get('');
    
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getExpenseById = async (id) => {
  try {
    const response = await axiosInstance.get(`${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createExpense = async (expenseData) => {
  try {
    const response = await axiosInstance.post('', expenseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateExpense = async (id, expenseData) => {
  try {
    const response = await axiosInstance.put(`${id}`, expenseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteExpense = async (id) => {
  try {
    const response = await axiosInstance.delete(`${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const expenseService = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};

export default expenseService;
