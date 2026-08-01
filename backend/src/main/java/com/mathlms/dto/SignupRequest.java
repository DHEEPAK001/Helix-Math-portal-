package com.mathlms.dto;

import com.mathlms.entity.Role;
import com.mathlms.entity.TeacherExpertise;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SignupRequest {
    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Role role; // STUDENT or TEACHER

    // Common Profile Fields
    @NotBlank
    private String institutionName;
    @NotBlank
    private String location;

    // Student Specific
    private List<String> gradesInterested;
    private Long assignedTeacherId;

    // Teacher Specific
    private TeacherExpertise expertise;
    private String bio;
    private Integer experience;
}
