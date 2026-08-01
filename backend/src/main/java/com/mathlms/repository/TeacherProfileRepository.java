package com.mathlms.repository;

import com.mathlms.entity.TeacherProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeacherProfileRepository extends JpaRepository<TeacherProfile, Long> {
    List<TeacherProfile> findByApprovedFalse();
    List<TeacherProfile> findByApprovedTrue();
}
