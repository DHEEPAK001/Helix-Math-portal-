package com.mathlms.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class TeacherAnalyticsDto {
    private int totalStudents;
    private int totalTestsTaken;
    private double averageClassScore;
    private List<TopicPerformanceDto> topicPerformance;
    
    @Getter
    @Setter
    public static class TopicPerformanceDto {
        private String topic;
        private double averageAccuracy;
    }
}
