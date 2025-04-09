package com.expensetracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseResponseDTO {
    private Long id;
    private String description;
    private double amount;
    private LocalDate date;
    private String category;
    private String username;
}
