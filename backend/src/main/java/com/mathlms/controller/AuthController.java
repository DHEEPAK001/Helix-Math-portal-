package com.mathlms.controller;

import com.mathlms.dto.JwtResponse;
import com.mathlms.dto.LoginRequest;
import com.mathlms.dto.MessageResponse;
import com.mathlms.dto.SignupRequest;
import com.mathlms.security.JwtUtils;
import com.mathlms.security.UserDetailsImpl;
import com.mathlms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.mathlms.entity.TeacherProfile;
import com.mathlms.repository.TeacherProfileRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    AuthService authService;
    
    @Autowired
    TeacherProfileRepository teacherProfileRepository;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            authService.registerUser(signUpRequest);
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<Map<String, Object>>> getApprovedTeachers() {
        List<TeacherProfile> teachers = teacherProfileRepository.findByApprovedTrue();
        List<Map<String, Object>> response = teachers.stream().map(t -> 
            Map.of(
                "id", (Object) t.getUser().getId(),
                "name", (Object) t.getName(),
                "expertise", (Object) (t.getExpertise() != null ? t.getExpertise().name() : "")
            )
        ).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
