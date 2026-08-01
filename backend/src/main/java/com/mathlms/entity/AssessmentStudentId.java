package com.mathlms.entity;

import java.io.Serializable;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentStudentId implements Serializable {
    private Long assessment;
    private Long student;
}
