package com.literacy.assessment.service;

import com.literacy.assessment.dto.UserDto;
import com.literacy.assessment.entity.User;
import com.literacy.assessment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return convertToDto(user);
    }
    
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return convertToDto(user);
    }
    
    @Transactional
    public UserDto createUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already exists: " + userDto.getEmail());
        }
        
        User user = User.builder()
                .email(userDto.getEmail())
                .userType(userDto.getUserType())
                .name(userDto.getName())
                .birthDate(userDto.getBirthDate())
                .phone(userDto.getPhone())
                .schoolName(userDto.getSchoolName())
                .grade(userDto.getGrade())
                .profileImageUrl(userDto.getProfileImageUrl())
                .isActive(true)
                .build();
        
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Transactional
    public UserDto updateUser(Long userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (userDto.getEmail() != null && !userDto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDto.getEmail())) {
                throw new RuntimeException("Email already exists: " + userDto.getEmail());
            }
            user.setEmail(userDto.getEmail());
        }

        if (userDto.getUserType() != null) {
            user.setUserType(userDto.getUserType());
        }
        if (userDto.getName() != null) {
            user.setName(userDto.getName());
        }
        if (userDto.getBirthDate() != null) {
            user.setBirthDate(userDto.getBirthDate());
        }
        if (userDto.getPhone() != null) {
            user.setPhone(userDto.getPhone());
        }
        if (userDto.getSchoolName() != null) {
            user.setSchoolName(userDto.getSchoolName());
        }
        if (userDto.getGrade() != null) {
            user.setGrade(userDto.getGrade());
        }
        if (userDto.getProfileImageUrl() != null) {
            user.setProfileImageUrl(userDto.getProfileImageUrl());
        }
        if (userDto.getIsActive() != null) {
            user.setIsActive(userDto.getIsActive());
        }

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Transactional
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setIsActive(false);
        userRepository.save(user);
    }
    
    private UserDto convertToDto(User user) {
        return UserDto.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .userType(user.getUserType())
                .name(user.getName())
                .birthDate(user.getBirthDate())
                .phone(user.getPhone())
                .schoolName(user.getSchoolName())
                .grade(user.getGrade())
                .profileImageUrl(user.getProfileImageUrl())
                .isActive(user.getIsActive())
                .build();
    }
}
