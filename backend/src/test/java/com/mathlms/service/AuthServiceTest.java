package com.mathlms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mathlms.dto.SignupRequest;
import com.mathlms.entity.AccountStatus;
import com.mathlms.entity.Role;
import com.mathlms.entity.User;
import com.mathlms.repository.StudentProfileRepository;
import com.mathlms.repository.TeacherProfileRepository;
import com.mathlms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private TeacherProfileRepository teacherProfileRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private AuthService authService;

    private SignupRequest studentRequest;
    private SignupRequest teacherRequest;

    @BeforeEach
    void setUp() {
        studentRequest = new SignupRequest();
        studentRequest.setEmail("student@test.com");
        studentRequest.setPassword("password123");
        studentRequest.setRole(Role.STUDENT);
        studentRequest.setName("John Doe");
        
        teacherRequest = new SignupRequest();
        teacherRequest.setEmail("teacher@test.com");
        teacherRequest.setPassword("password123");
        teacherRequest.setRole(Role.TEACHER);
        teacherRequest.setName("Jane Smith");
    }

    @Test
    void testRegisterUser_Student_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(encoder.encode(anyString())).thenReturn("hashedPassword");
        
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail(studentRequest.getEmail());
        savedUser.setRole(Role.STUDENT);
        savedUser.setAccountStatus(AccountStatus.ACTIVE);
        
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = authService.registerUser(studentRequest);

        assertNotNull(result);
        assertEquals(Role.STUDENT, result.getRole());
        assertEquals(AccountStatus.ACTIVE, result.getAccountStatus());
        
        verify(userRepository, times(1)).save(any(User.class));
        verify(studentProfileRepository, times(1)).save(any());
    }

    @Test
    void testRegisterUser_Teacher_PendingStatus() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(encoder.encode(anyString())).thenReturn("hashedPassword");
        
        User savedUser = new User();
        savedUser.setId(2L);
        savedUser.setEmail(teacherRequest.getEmail());
        savedUser.setRole(Role.TEACHER);
        savedUser.setAccountStatus(AccountStatus.PENDING);
        
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = authService.registerUser(teacherRequest);

        assertNotNull(result);
        assertEquals(Role.TEACHER, result.getRole());
        assertEquals(AccountStatus.PENDING, result.getAccountStatus());
        
        verify(userRepository, times(1)).save(any(User.class));
        verify(teacherProfileRepository, times(1)).save(any());
    }

    @Test
    void testRegisterUser_EmailAlreadyInUse() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(new User()));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.registerUser(studentRequest);
        });

        assertTrue(exception.getMessage().contains("Email is already in use"));
        verify(userRepository, never()).save(any(User.class));
    }
}
