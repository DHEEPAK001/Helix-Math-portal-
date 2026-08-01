package com.mathlms.service;

import com.mathlms.dto.QuizAnswerDto;
import com.mathlms.dto.QuizSubmissionRequest;
import com.mathlms.entity.*;
import com.mathlms.repository.QuestionRepository;
import com.mathlms.repository.QuizResultRepository;
import com.mathlms.repository.StudentAnswerRepository;
import com.mathlms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;

    @Autowired
    private QuizResultRepository quizResultRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AiService aiService;

    public List<Question> fetchQuizQuestions(String grade, String topic, String difficulty) {
        // Simple mock of 10 random questions: In a real scenario we'd do a random order query limit 10
        List<Question> questions = questionRepository.findByGradeAndTopicAndDifficulty(grade, topic, Difficulty.valueOf(difficulty.toUpperCase()));
        // For testing/mocking, if empty, we just return empty list. We will insert mock data in frontend or db script.
        return questions;
    }

    @Transactional
    public QuizResult submitQuiz(Long studentId, QuizSubmissionRequest request) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        int totalQuestions = request.getAnswers().size();
        int correctAnswers = 0;
        int wrongAnswers = 0;
        int totalTime = 0;

        List<Long> questionIds = request.getAnswers().stream()
                .map(QuizAnswerDto::getQuestionId).collect(Collectors.toList());

        Map<Long, Question> questionMap = questionRepository.findAllById(questionIds)
                .stream().collect(Collectors.toMap(Question::getId, q -> q));

        for (QuizAnswerDto answerDto : request.getAnswers()) {
            Question question = questionMap.get(answerDto.getQuestionId());
            boolean correct = false;

            if (answerDto.getSelectedOption() != null) {
                if (answerDto.getSelectedOption().equals(question.getCorrectOption())) {
                    correct = true;
                    correctAnswers++;
                } else {
                    wrongAnswers++;
                }
            }

            totalTime += (answerDto.getTimeTaken() != null ? answerDto.getTimeTaken() : 0);

            // Save Answer
            StudentAnswer studentAnswer = new StudentAnswer();
            studentAnswer.setStudent(student);
            studentAnswer.setQuestion(question);
            studentAnswer.setSelectedOption(answerDto.getSelectedOption());
            studentAnswer.setCorrect(correct);
            studentAnswer.setTimeTaken(answerDto.getTimeTaken());
            // Attempt logic can be added later
            studentAnswer.setAttemptNo(1);
            
            studentAnswerRepository.save(studentAnswer);
        }

        BigDecimal accuracy = BigDecimal.ZERO;
        if (totalQuestions > 0 && correctAnswers + wrongAnswers > 0) {
            accuracy = new BigDecimal(correctAnswers).divide(new BigDecimal(correctAnswers + wrongAnswers), 4, RoundingMode.HALF_UP).multiply(new BigDecimal(100));
        }

        BigDecimal score = new BigDecimal(correctAnswers); // simple 1 point per correct answer. Negative marking could be added here.

        QuizResult result = new QuizResult();
        result.setStudent(student);
        result.setScore(score);
        result.setAccuracy(accuracy);
        result.setTotalQuestions(totalQuestions);
        result.setCorrectAnswers(correctAnswers);
        result.setWrongAnswers(wrongAnswers);
        result.setAverageTime(totalQuestions > 0 ? totalTime / totalQuestions : 0);
        result.setDifficulty(Difficulty.valueOf(request.getDifficulty().toUpperCase()));
        result.setTopic(request.getTopic());
        
        // AI Summary
        String aiFeedback = aiService.generateFeedback(result);
        result.setAiSummary(aiFeedback);

        return quizResultRepository.save(result);
    }
}
