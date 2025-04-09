package com.expensetracker.backend.controller;


import com.expensetracker.backend.dto.ExpenseRequestDTO;
import com.expensetracker.backend.dto.ExpenseResponseDTO;

import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.respository.UserRepository;
import com.expensetracker.backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")

public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserRepository userRepository;


    @PostMapping
    public ExpenseResponseDTO addExpense(@RequestBody ExpenseRequestDTO requestDTO, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());

        // Convert DTO to Entity manually (or use mapper if needed)
        Expense expense = new Expense();
        expense.setDescription(requestDTO.getDescription());
        expense.setAmount(requestDTO.getAmount());
        expense.setDate(requestDTO.getDate() != null ? requestDTO.getDate() : LocalDate.now());
        expense.setCategory(requestDTO.getCategory());

        return expenseService.addExpense(expense, user);
    }

    // Fetch expenses (GET)
    @GetMapping
    public List<ExpenseResponseDTO> getUserExpenses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        return expenseService.getUserExpenses(user);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        expenseService.deleteExpense(id, user);
    }

    @PutMapping("/{id}")
    public void updateExpense(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Expense updatedExpenseData
    ) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        expenseService.updateExpense(id, updatedExpenseData, user);
    }

}