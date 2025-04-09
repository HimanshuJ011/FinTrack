package com.expensetracker.backend.serviceImpl;


import com.expensetracker.backend.dto.ExpenseResponseDTO;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.respository.ExpenseRepository;
import com.expensetracker.backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private final ExpenseRepository expenseRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }


    @Override
    public ExpenseResponseDTO addExpense(Expense expense, User user) {
        expense.setUser(user);
        Expense saved = expenseRepository.save(expense);
        return convertToDTO(saved);
    }

    @Override
    public List<ExpenseResponseDTO> getUserExpenses(User user) {
        List<Expense> expenses = expenseRepository.findByUser(user);
        return expenses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public void deleteExpense(Long id, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can't delete this expense");
        }
        expenseRepository.delete(expense);
    }

    @Override
    public void updateExpense(Long id, Expense updatedExpenseData, User user) {
        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!existingExpense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can't update this expense");
        }

        // Update the fields
        existingExpense.setDescription(updatedExpenseData.getDescription());
        existingExpense.setAmount(updatedExpenseData.getAmount());
        existingExpense.setDate(updatedExpenseData.getDate());
        existingExpense.setCategory(updatedExpenseData.getCategory());

        // Save updated expense
        expenseRepository.save(existingExpense);
    }


    private ExpenseResponseDTO convertToDTO(Expense expense) {
        return new ExpenseResponseDTO(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getDate(),
                expense.getCategory(),
                expense.getUser().getUsername()
        );
    }

}
