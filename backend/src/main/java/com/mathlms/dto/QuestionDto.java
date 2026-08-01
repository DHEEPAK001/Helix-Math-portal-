package com.mathlms.dto;

import com.mathlms.entity.Difficulty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionDto {
    private String grade;
    private String topic;
    private String subTopic;
    private Difficulty difficulty;
    private String questionText;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private int correctOption;
    private String tutorialVideo;
    private String documentation;
}
