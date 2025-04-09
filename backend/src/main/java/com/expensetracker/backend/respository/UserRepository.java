package com.expensetracker.backend.respository;

import com.expensetracker.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByUsernameOrEmail(String username, String email);
    boolean existsByUsername(String username);
}
