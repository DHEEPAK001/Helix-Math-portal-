package com.mathlms.repository;

import com.mathlms.entity.StudentTeacher;
import com.mathlms.entity.StudentTeacherId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentTeacherRepository extends JpaRepository<StudentTeacher, StudentTeacherId> {
    List<StudentTeacher> findByTeacherId(Long teacherId);
    List<StudentTeacher> findByStudentId(Long studentId);
}
