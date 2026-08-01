package com.mathlms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "question_tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(QuestionTagId.class)
public class QuestionTag {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @Id
    private String tag;
}
