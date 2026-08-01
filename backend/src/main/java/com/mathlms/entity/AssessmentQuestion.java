package com.mathlms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assessment_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(AssessmentQuestionId.class)
public class AssessmentQuestion {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Assessment assessment;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;
}
