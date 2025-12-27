package com.literacy.assessment.entity;

import lombok.*;
import javax.persistence.*;

@Entity
@Table(name = "topics")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long topicId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String topicText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TopicType topicType;

    @Column(nullable = false)
    private Integer difficultyLevel;

    @Column(columnDefinition = "TEXT")
    private String keywords;

    @Column(columnDefinition = "JSON")
    private String evaluationCriteria;
}
