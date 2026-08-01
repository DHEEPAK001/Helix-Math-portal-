package com.mathlms.controller;

import com.mathlms.dto.MessageResponse;
import com.mathlms.dto.PlatformStatsDto;
import com.mathlms.entity.TeacherProfile;
import com.mathlms.entity.User;
import com.mathlms.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/teachers/pending")
    public ResponseEntity<List<TeacherProfile>> getPendingTeachers() {
        return ResponseEntity.ok(adminService.getPendingTeachers());
    }

    @PutMapping("/teachers/{id}/approve")
    public ResponseEntity<MessageResponse> approveTeacher(@PathVariable Long id) {
        adminService.approveTeacher(id);
        return ResponseEntity.ok(new MessageResponse("Teacher approved successfully."));
    }
    
    @PutMapping("/teachers/{id}/reject")
    public ResponseEntity<MessageResponse> rejectTeacher(@PathVariable Long id) {
        adminService.rejectTeacher(id);
        return ResponseEntity.ok(new MessageResponse("Teacher rejected successfully."));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/stats")
    public ResponseEntity<PlatformStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }
}
