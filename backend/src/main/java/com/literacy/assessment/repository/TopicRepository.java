package com.literacy.assessment.repository;

import com.literacy.assessment.entity.Topic;
import com.literacy.assessment.entity.TopicType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByBookId(Long bookId);
    List<Topic> findByTopicType(TopicType topicType);
    List<Topic> findByDifficultyLevel(Integer difficultyLevel);
}
