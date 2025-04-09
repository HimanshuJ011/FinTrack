import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area
} from 'recharts';

const ExpenseChart = ({ expenses }) => {
  const [chartData, setChartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [averageAmount, setAverageAmount] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [isPositiveChange, setIsPositiveChange] = useState(true);
  const [expenseCount, setExpenseCount] = useState(0);

  useEffect(() => {
    if (!expenses || expenses.length === 0) {
      setChartData([]);
      setTotalAmount(0);
      setAverageAmount(0);
      setPercentageChange(0);
      setExpenseCount(0);
      return;
    }

    const processExpensesData = () => {
      const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 7);

      const thisWeekExpenses = sortedExpenses.filter(expense =>
        new Date(expense.date) >= startOfWeek
      );

      const dailyTotals = thisWeekExpenses.reduce((acc, expense) => {
        const date = expense.date.substring(0, 10);
        const amount = parseFloat(expense.amount || 0);
        acc[date] = (acc[date] || 0) + amount;
        return acc;
      }, {});

      if (thisWeekExpenses.length > 0) {
        const firstDate = new Date(thisWeekExpenses[0].date);
        const lastDate = new Date(thisWeekExpenses[thisWeekExpenses.length - 1].date);

        for (let d = new Date(firstDate); d <= lastDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().substring(0, 10);
          if (!dailyTotals[dateStr]) dailyTotals[dateStr] = 0;
        }
      }

      const data = Object.entries(dailyTotals).map(([date, amount]) => {
        const displayDate = new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        return {
          date: displayDate,
          fullDate: date,
          amount: parseFloat(amount.toFixed(2))
        };
      }).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

      const total = thisWeekExpenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      const count = thisWeekExpenses.length;
      const average = count > 0 ? total / count : 0;

      const previousWeekStart = new Date(startOfWeek);
      previousWeekStart.setDate(previousWeekStart.getDate() - 7);

      const previousWeekExpenses = sortedExpenses.filter(expense =>
        new Date(expense.date) >= previousWeekStart && new Date(expense.date) < startOfWeek
      );
      const previousWeekTotal = previousWeekExpenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

      let change = 0;
      if (previousWeekTotal > 0) {
        change = ((total - previousWeekTotal) / previousWeekTotal) * 100;
      }

      setTotalAmount(total);
      setAverageAmount(average);
      setPercentageChange(Math.abs(change).toFixed(1));
      setIsPositiveChange(change >= 0);
      setExpenseCount(count);

      return data;
    };

    setChartData(processExpensesData());
  }, [expenses]);

  const formatYAxis = value => `$${value}`;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-md">
          <p className="text-sm font-semibold text-gray-800">{payload[0].payload.date}</p>
          <p className="text-teal-600 text-lg font-bold">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h4 className="text-gray-500 text-sm font-medium mb-1">Total Expenses</h4>
          <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
          <p className={`text-sm mt-1 ${isPositiveChange ? 'text-red-500' : 'text-green-500'}`}>
            {percentageChange}% {isPositiveChange ? '↑' : '↓'} from last week
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h4 className="text-gray-500 text-sm font-medium mb-1">Average Expense</h4>
          <p className="text-2xl font-bold text-gray-900">${averageAmount.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h4 className="text-gray-500 text-sm font-medium mb-1">Number of Expenses</h4>
          <p className="text-2xl font-bold text-gray-900">{expenseCount}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-gray-700 text-lg font-semibold mb-4">Expenses Over Time</h3>
        <div className="h-64">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatYAxis} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                <Line type="monotone" dataKey="amount" stroke="#14b8a6" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: "#14b8a6", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No expense data available for this week
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
