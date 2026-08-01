package com.mathlms.service;

import com.mathlms.dto.QuestionDto;
import com.mathlms.entity.QuizResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AiService {

    /**
     * Verifies if a teacher's question is mathematically sound and options make sense.
     * In production, this would call OpenAI API (e.g., GPT-4).
     */
    public boolean verifyQuestion(QuestionDto questionDto) {
        // MOCK IMPLEMENTATION
        // E.g., block if the question text is too short or doesn't look like math
        if (questionDto.getQuestionText() == null || questionDto.getQuestionText().length() < 5) {
            return false;
        }
        return true;
    }

    /**
     * Generates personalized feedback based on student's quiz performance.
     */
    public String generateFeedback(QuizResult result) {
        // MOCK IMPLEMENTATION
        BigDecimal accuracy = result.getAccuracy();
        String topic = result.getTopic();
        
        if (accuracy.compareTo(new BigDecimal(80)) >= 0) {
            return "Excellent work! You have a strong grasp of " + topic + ". Consider attempting the 'Hard' difficulty next to challenge yourself.";
        } else if (accuracy.compareTo(new BigDecimal(50)) >= 0) {
            return "Good effort on " + topic + ", but there is room for improvement. Review the interactive animations for the questions you missed.";
        } else {
            return "It looks like you're struggling with " + topic + ". Don't worry! I recommend watching the foundational video tutorials before attempting another quiz.";
        }
    }

    /**
     * Chatbot endpoint for students to ask math doubts.
     */
    public String chat(String message, String context) {
        // MOCK IMPLEMENTATION
        String lowerMsg = message.toLowerCase();
        
        if (lowerMsg.contains("fraction") || lowerMsg.contains("divide")) {
            return "To divide fractions, you can multiply the first fraction by the reciprocal (flip) of the second fraction. Do you want an example?";
        } else if (lowerMsg.contains("algebra") || lowerMsg.contains("x")) {
            return "In algebra, 'x' is just a placeholder for a number we don't know yet. To find 'x', you want to get it by itself on one side of the equals sign.";
        } else {
            return "That's a great question about " + (context != null ? context : "math") + "! I am your AI Math Tutor. (This is a mocked response. Connect OpenAI API for full capability).";
        }
    }
}
