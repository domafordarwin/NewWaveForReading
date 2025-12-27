package com.literacy.assessment.config;

import com.literacy.assessment.entity.*;
import com.literacy.assessment.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("!prod")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 데이터 초기화 임시 비활성화
        System.out.println("========================================");
        System.out.println("데이터 초기화가 비활성화되어 있습니다.");
        System.out.println("API를 통해 데이터를 추가하세요.");
        System.out.println("========================================");
    }
}
