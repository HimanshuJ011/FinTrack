package com.expensetracker.backend;

import com.expensetracker.backend.model.User;
import com.expensetracker.backend.respository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // Allow login via either username or email
        User user = userRepository.findByUsernameOrEmail(identifier, identifier);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username or email: " + identifier);
        }

        // Return UserDetails with username (or email if you prefer that to be principal)
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(), // or user.getEmail() if you're using email as the principal
                user.getPassword(),
                Collections.emptyList()
        );
    }
}
