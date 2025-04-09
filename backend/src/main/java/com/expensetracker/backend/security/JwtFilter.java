package com.expensetracker.backend.security;

import com.expensetracker.backend.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Service
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authToken = request.getHeader("Authorization");

        if (authToken == null || !authToken.startsWith("Bearer")) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = authToken.substring(7);
        String userName = jwtUtil.extractUserName(token);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (userName != null && authentication == null ) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userName);

            if ( jwtUtil.validateToken(token, userDetails)) {

                UsernamePasswordAuthenticationToken authenticated =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticated.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set Authentication in Security Context
                SecurityContextHolder.getContext().setAuthentication(authenticated);
            }
        }
        filterChain.doFilter(request, response);
    }
}
