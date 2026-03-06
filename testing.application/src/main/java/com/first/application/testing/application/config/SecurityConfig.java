//package com.first.application.testing.application.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import java.util.Arrays;
//import java.util.List;
//
//@Configuration
//@EnableWebSecurity
//
//public class SecurityConfig {
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                 1. Enable CORS using the bean defined below
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//
//                 2. Disable CSRF ONLY if this is a stateless REST API (like one using JWT).
//                 If you are serving HTML pages (Thymeleaf/MVC), leave this enabled!
//                .csrf(csrf -> csrf.disable())
//
//                 3. Configure endpoint routing
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/api/public/**").permitAll() // Open to anyone
//                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Restricted role
//                        .anyRequest().authenticated() // All other endpoints require authentication
//                )
//
//                 4. Set authentication method (Basic Auth shown here for simplicity)
//                .httpBasic(Customizer.withDefaults());
//
//        return http.build();
//    }
//
//     CORS Configuration Bean
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//
//         IMPORTANT: Never use "*" (allow all) in production.
//         Explicitly list your frontend domains to prevent unauthorized websites from calling your API.
//        configuration.setAllowedOrigins(List.of("", ""));
//
//         Specify which HTTP methods are allowed
//        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//
//         Specify which headers the frontend can send
//        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
//
//         Allow credentials (like cookies or authorization headers)
//        configuration.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         Apply these CORS rules to all endpoints
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//}
