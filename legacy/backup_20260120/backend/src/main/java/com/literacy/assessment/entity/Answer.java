package com.literacy.assessment.entity;

import lombok.*;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "answers")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Answer extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false, unique = true)
    private Assessment assessment;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Column(name = "word_count")
    private Integer wordCount;
    
    @Column(name = "char_count")
    private Integer charCount;
    
    @Column(name = "paragraph_count")
    private Integer paragraphCount;
    
    @Column(name = "auto_saved_at")
    private LocalDateTime autoSavedAt;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;
}
