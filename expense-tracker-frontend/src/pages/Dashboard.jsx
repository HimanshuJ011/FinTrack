import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import expenseService from "../api/expenseService";
import { useAuth } from "../context/AuthContext";
import ExpenseList from "../components/ExpenseList";
import AddExpenseForm from "../components/ExpenseForm";
import ExpenseChart from "../components/ExpenseChart";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Add this function to handle toggle
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await expenseService.deleteExpense(id);
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        setError("Failed to delete expense.");
      }
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await expenseService.updateExpense(currentExpense.id, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      await fetchExpenses(); // refresh the list
      setShowModal(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount || 0),
    0
  );

  const categories = {};
  expenses.forEach((expense) => {
    if (categories[expense.category]) {
      categories[expense.category] += parseFloat(expense.amount || 0);
    } else {
      categories[expense.category] = parseFloat(expense.amount || 0);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4 sm:gap-0 sm:flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-2xl font-bold text-center md:text-left">
            <span className="text-green-300">Fin</span>Track
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-300 flex items-center justify-center mr-2">
                {currentUser?.sub?.charAt(0)}
              </div>
              <span className="text-sm sm:text-base">{currentUser?.sub}</span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-white text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-1 md:col-span-3">
            <ExpenseChart expenses={expenses} />
          </div>
        </div>

        {/* Add Expense Button */}
        <div className="mb-6 flex justify-end">
          <button
            className={`px-4 py-2 rounded-md ${
              showAddForm ? "bg-gray-500" : "bg-indigo-600"
            } text-white hover:opacity-90 transition-colors`}
            onClick={toggleAddForm}
          >
            {showAddForm ? "Close Form" : "Add Expense"}
          </button>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <AddExpenseForm
              onExpenseAdded={fetchExpenses}
              onClose={toggleAddForm}
            />
          </div>
        )}

        {/* Expenses List */}
        {loading ? (
          <div className="flex justify-center items-center h-32 bg-white rounded-lg shadow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ExpenseList
              expenses={expenses}
              onDelete={handleDeleteExpense}
              onEdit={handleEdit}
            />
          </div>
        )}
        {expenses.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 py-6">
            No expenses added yet. Start by adding a new one!
          </div>
        )}

        {/* Categories Summary */}
        {expenses.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categories).map(([category, amount]) => (
                <div key={category} className="border rounded-md p-4">
                  <h3 className="font-medium text-gray-700">
                    {category || "Uncategorized"}
                  </h3>
                  <p className="text-lg font-bold">${amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {((amount / totalExpenses) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xl font-semibold">Update Expense</h5>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            <span className="text-green-500">Fin</span>Track Dashboard &copy;
            2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
