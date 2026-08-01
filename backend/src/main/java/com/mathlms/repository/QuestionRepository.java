package com.mathlms.repository;

import com.mathlms.entity.Difficulty;
import com.mathlms.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByGradeAndTopicAndDifficulty(String grade, String topic, Difficulty difficulty);
    List<Question> findByGradeAndTopicAndDifficulty(String grade, String topic, Difficulty difficulty, org.springframework.data.domain.Pageable pageable);
    List<Question> findByAddedByTeacherId(Long teacherId);
    
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT q.topic FROM Question q WHERE q.grade = :grade")
    List<String> findDistinctTopicsByGrade(@org.springframework.data.repository.query.Param("grade") String grade);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT q.topic FROM Question q WHERE q.grade = :grade AND q.difficulty = :difficulty")
    List<String> findDistinctTopicsByGradeAndDifficulty(@org.springframework.data.repository.query.Param("grade") String grade, @org.springframework.data.repository.query.Param("difficulty") Difficulty difficulty);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT q.grade FROM Question q")
    List<String> findDistinctGrades();
}
