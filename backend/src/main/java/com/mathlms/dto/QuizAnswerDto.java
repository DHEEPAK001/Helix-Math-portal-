package com.mathlms.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizAnswerDto {
    private Long questionId;
    private Integer selectedOption; // can be null if skipped
    private Integer timeTaken;
}
