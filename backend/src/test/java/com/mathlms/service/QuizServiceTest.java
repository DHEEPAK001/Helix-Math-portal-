package com.mathlms.service;

import com.mathlms.dto.QuizAnswerDto;
import com.mathlms.dto.QuizSubmissionRequest;
import com.mathlms.entity.Difficulty;
import com.mathlms.entity.Question;
import com.mathlms.entity.QuizResult;
import com.mathlms.entity.User;
import com.mathlms.repository.QuestionRepository;
import com.mathlms.repository.QuizResultRepository;
import com.mathlms.repository.StudentAnswerRepository;
import com.mathlms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class QuizServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private StudentAnswerRepository studentAnswerRepository;

    @Mock
    private QuizResultRepository quizResultRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AiService aiService;

    @InjectMocks
    private QuizService quizService;

    private User mockStudent;
    private QuizSubmissionRequest mockRequest;
    private Question mockQuestion;

    @BeforeEach
    void setUp() {
        mockStudent = new User();
        mockStudent.setId(1L);

        mockQuestion = new Question();
        mockQuestion.setId(100L);
        mockQuestion.setCorrectOption(2);

        QuizAnswerDto answer = new QuizAnswerDto();
        answer.setQuestionId(100L);
        answer.setSelectedOption(2); // Correct answer
        answer.setTimeTaken(15);

        mockRequest = new QuizSubmissionRequest();
        mockRequest.setGrade("5");
        mockRequest.setTopic("Fractions");
        mockRequest.setDifficulty("EASY");
        mockRequest.setAnswers(Arrays.asList(answer));
    }

    @Test
    void testSubmitQuiz_CalculatesScoreAndAccuracyCorrectly() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockStudent));
        when(questionRepository.findAllById(anyList())).thenReturn(Arrays.asList(mockQuestion));
        
        when(aiService.generateFeedback(any())).thenReturn("AI Feedback");
        
        when(quizResultRepository.save(any(QuizResult.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuizResult result = quizService.submitQuiz(1L, mockRequest);

        assertNotNull(result);
        assertEquals(1, result.getTotalQuestions());
        assertEquals(1, result.getCorrectAnswers());
        assertEquals(0, result.getWrongAnswers());
        assertEquals(new BigDecimal("100.0000"), result.getAccuracy()); // 100%
        assertEquals(new BigDecimal("1"), result.getScore());
        assertEquals("AI Feedback", result.getAiSummary());
        
        verify(studentAnswerRepository, times(1)).save(any());
        verify(quizResultRepository, times(1)).save(any());
    }

    @Test
    void testSubmitQuiz_StudentNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            quizService.submitQuiz(1L, mockRequest);
        });

        verify(quizResultRepository, never()).save(any());
    }
}
