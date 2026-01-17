package com.literacy.assessment.entity;

import lombok.*;
import javax.persistence.*;

@Entity
@Table(name = "corrections")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Correction extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "correction_id")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id", nullable = false)
    private Evaluation evaluation;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "correction_type", nullable = false)
    private CorrectionType correctionType;
    
    @Column(name = "start_position", nullable = false)
    private Integer startPosition;  // 시작 위치
    
    @Column(name = "end_position", nullable = false)
    private Integer endPosition;  // 끝 위치
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String originalText;  // 원본 텍스트
    
    @Column(columnDefinition = "TEXT")
    private String correctedText;  // 수정 제안 텍스트
    
    @Column(columnDefinition = "TEXT")
    private String description;  // 설명
    
    @Column(nullable = false)
    @Builder.Default
    private Integer severity = 1;  // 심각도 (1-3)
}
