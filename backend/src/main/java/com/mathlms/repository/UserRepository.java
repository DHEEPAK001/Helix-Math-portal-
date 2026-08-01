package com.mathlms.repository;

import com.mathlms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.role = 'STUDENT' AND u.id NOT IN (SELECT st.student.id FROM StudentTeacher st WHERE st.teacher.id = :teacherId)")
    java.util.List<User> findStudentsNotAssignedToTeacher(@org.springframework.data.repository.query.Param("teacherId") Long teacherId);
}
