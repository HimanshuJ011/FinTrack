import React, { useState } from "react";
import expenseService from "../api/expenseService";

const AddExpenseForm = ({ onExpenseAdded, onClose }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const categories = [
    "Food",
    "Transportation",
    "Housing",
    "Entertainment",
    "Healthcare",
    "Education",
    "Shopping",
    "Utilities",
    "Travel",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!description || !amount || !date || !category) {
      setError("Please fill in all fields.");
      return;
    }

    const newExpense = {
      description,
      amount: parseFloat(amount),
      date,
      category,
    };

    try {
      await expenseService.createExpense(newExpense);
      onExpenseAdded();
      onClose();
      setDescription("");
      setAmount("");
      setDate("");
      setCategory("");
    } catch (err) {
      console.error(err);
      setError("Failed to add expense.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Description
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you spend on?"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Category
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;