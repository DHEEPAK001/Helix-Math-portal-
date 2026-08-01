package com.mathlms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assessment_students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(AssessmentStudentId.class)
public class AssessmentStudent {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Assessment assessment;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private User student;

    @Column(name = "is_completed")
    private boolean isCompleted = false;
}
