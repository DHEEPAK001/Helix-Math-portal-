package com.mathlms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mathlms.dto.SignupRequest;
import com.mathlms.entity.*;
import com.mathlms.repository.StudentProfileRepository;
import com.mathlms.repository.StudentTeacherRepository;
import com.mathlms.repository.TeacherProfileRepository;
import com.mathlms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private StudentTeacherRepository studentTeacherRepository;

    @Autowired
    private TeacherProfileRepository teacherProfileRepository;

    @Autowired
    private PasswordEncoder encoder;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public User registerUser(SignupRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(encoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole());
        user.setEmailVerified(false);

        user.setAccountStatus(AccountStatus.ACTIVE);

        user = userRepository.save(user);

        // Infer Institution Type
        InstitutionType inferredType = inferInstitutionType(signUpRequest);

        if (signUpRequest.getRole() == Role.STUDENT) {
            StudentProfile profile = new StudentProfile();
            profile.setUser(user);
            profile.setName(signUpRequest.getName());
            profile.setInstitutionName(signUpRequest.getInstitutionName());
            profile.setInstitutionType(inferredType);
            profile.setLocation(signUpRequest.getLocation());
            
            try {
                profile.setGradesInterested(objectMapper.writeValueAsString(signUpRequest.getGradesInterested()));
            } catch (JsonProcessingException e) {
                profile.setGradesInterested("[]");
            }

            // Map teacher if provided
            if (signUpRequest.getAssignedTeacherId() != null) {
                User teacher = userRepository.findById(signUpRequest.getAssignedTeacherId()).orElse(null);
                
                
                if (teacher != null) {
                    StudentTeacher st = new StudentTeacher();
                    st.setStudent(user);
                    st.setTeacher(teacher);
                    studentTeacherRepository.save(st);
                }
            }

            studentProfileRepository.save(profile);
            
        } else if (signUpRequest.getRole() == Role.TEACHER) {
            TeacherProfile profile = new TeacherProfile();
            profile.setUser(user);
            profile.setName(signUpRequest.getName());
            profile.setExpertise(signUpRequest.getExpertise());
            profile.setInstitutionName(signUpRequest.getInstitutionName());
            profile.setInstitutionType(inferredType);
            profile.setLocation(signUpRequest.getLocation());
            profile.setBio(signUpRequest.getBio());
            profile.setExperience(signUpRequest.getExperience() != null ? signUpRequest.getExperience() : 0);
            profile.setApproved(true);

            teacherProfileRepository.save(profile);
        }
        
        return user;
    }

    private InstitutionType inferInstitutionType(SignupRequest request) {
        if (request.getRole() == Role.STUDENT && request.getGradesInterested() != null) {
            if (request.getGradesInterested().contains("Engineering Mathematics")) {
                return InstitutionType.COLLEGE;
            }
            return InstitutionType.SCHOOL;
        } else if (request.getRole() == Role.TEACHER && request.getExpertise() != null) {
            if (request.getExpertise() == TeacherExpertise.ENGINEERING) {
                return InstitutionType.COLLEGE;
            }
            return InstitutionType.SCHOOL;
        }
        return InstitutionType.SCHOOL; // default
    }
}
