package com.literacy.assessment.dto;

import com.literacy.assessment.entity.UserType;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long userId;
    private String email;
    private UserType userType;
    private String name;
    private LocalDate birthDate;
    private String phone;
    private String schoolName;
    private Integer grade;
    private String profileImageUrl;
    private Boolean isActive;
}
