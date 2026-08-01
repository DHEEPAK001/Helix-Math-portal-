package com.mathlms.config;

import com.mathlms.entity.AccountStatus;
import com.mathlms.entity.Role;
import com.mathlms.entity.User;
import com.mathlms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@mathlms.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@mathlms.com");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setAccountStatus(AccountStatus.ACTIVE);
                admin.setEmailVerified(true);
                userRepository.save(admin);
                System.out.println("Default Admin user created: admin@mathlms.com / admin123");
            }
        };
    }
}
