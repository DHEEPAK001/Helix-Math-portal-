package com.mathlms.service;

import com.mathlms.dto.PlatformStatsDto;
import com.mathlms.entity.AccountStatus;
import com.mathlms.entity.Role;
import com.mathlms.entity.TeacherProfile;
import com.mathlms.entity.User;
import com.mathlms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherProfileRepository teacherProfileRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    public List<TeacherProfile> getPendingTeachers() {
        return teacherProfileRepository.findByApprovedFalse();
    }

    @Transactional
    public TeacherProfile approveTeacher(Long profileId) {
        TeacherProfile profile = teacherProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        
        profile.setApproved(true);
        User user = profile.getUser();
        user.setAccountStatus(AccountStatus.ACTIVE);
        
        userRepository.save(user);
        return teacherProfileRepository.save(profile);
    }

    @Transactional
    public TeacherProfile rejectTeacher(Long profileId) {
        TeacherProfile profile = teacherProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        
        User user = profile.getUser();
        user.setAccountStatus(AccountStatus.SUSPENDED); // Or delete
        
        userRepository.save(user);
        return profile;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public PlatformStatsDto getPlatformStats() {
        PlatformStatsDto stats = new PlatformStatsDto();
        stats.setTotalUsers(userRepository.count());
        
        long teachers = userRepository.findAll().stream().filter(u -> u.getRole() == Role.TEACHER).count();
        long students = userRepository.findAll().stream().filter(u -> u.getRole() == Role.STUDENT).count();
        
        stats.setTotalTeachers(teachers);
        stats.setTotalStudents(students);
        stats.setPendingApprovals(teacherProfileRepository.findByApprovedFalse().size());
        stats.setTotalQuestions(questionRepository.count());
        stats.setTotalAssessments(assessmentRepository.count());
        
        return stats;
    }
}
