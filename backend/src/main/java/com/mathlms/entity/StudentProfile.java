package com.mathlms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "json")
    private String gradesInterested;

    @Column(name = "institution_name")
    private String institutionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "institution_type")
    private InstitutionType institutionType;

    private String location;


    @Column(name = "daily_streak", columnDefinition = "int default 0")
    private int dailyStreak;

    @Column(columnDefinition = "int default 0")
    private int coins;

    @Column(name = "experience_points", columnDefinition = "int default 0")
    private int experiencePoints;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
