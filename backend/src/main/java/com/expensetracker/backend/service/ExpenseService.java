package com.expensetracker.backend.service;



import com.expensetracker.backend.dto.ExpenseResponseDTO;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.User;

import java.util.List;

public interface ExpenseService {
    ExpenseResponseDTO addExpense(Expense expense, User user);
    List<ExpenseResponseDTO> getUserExpenses(User user);
    void deleteExpense(Long id, User user);
    void updateExpense(Long id, Expense updatedExpenseData, User user);
}
