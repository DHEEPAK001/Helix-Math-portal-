package com.mathlms.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlatformStatsDto {
    private long totalUsers;
    private long totalStudents;
    private long totalTeachers;
    private long pendingApprovals;
    private long totalQuestions;
    private long totalAssessments;
}
