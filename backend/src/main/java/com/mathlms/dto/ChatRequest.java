package com.mathlms.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRequest {
    private String message;
    private String context; // e.g., "Grade 5 Fractions"
}
