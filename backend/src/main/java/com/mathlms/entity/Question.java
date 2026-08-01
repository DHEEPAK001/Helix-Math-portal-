package com.mathlms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String grade;
    private String topic;
    
    @Column(name = "sub_topic")
    private String subTopic;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    private String option1;
    private String option2;
    private String option3;
    private String option4;

    @Column(name = "correct_option", nullable = false)
    private int correctOption;

    @Column(name = "tutorial_video")
    private String tutorialVideo;

    @Column(columnDefinition = "TEXT")
    private String documentation;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by_teacher_id")
    private User addedByTeacher;

    @Enumerated(EnumType.STRING)
    private QuestionStatus status = QuestionStatus.ACTIVE;

    @Column(name = "ai_verified")
    private boolean aiVerified;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
