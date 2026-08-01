package com.mathlms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_teachers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(StudentTeacherId.class)
public class StudentTeacher {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User student;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User teacher;
}
