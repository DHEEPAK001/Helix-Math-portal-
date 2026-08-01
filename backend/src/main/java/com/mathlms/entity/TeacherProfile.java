package com.mathlms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "teacher_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherProfile {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private TeacherExpertise expertise;

    @Column(name = "institution_name")
    private String institutionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "institution_type")
    private InstitutionType institutionType;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private int experience;

    @Column(columnDefinition = "boolean default false")
    private boolean approved;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
