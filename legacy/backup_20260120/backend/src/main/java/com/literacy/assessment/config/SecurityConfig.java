package com.literacy.assessment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .authorizeRequests()
                .antMatchers("/api/health", "/api/", "/api/h2-console/**").permitAll()
                .anyRequest().permitAll() // 개발 단계에서 모든 요청 허용
            .and()
            .headers().frameOptions().disable(); // H2 콘솔을 위해 필요

        return http.build();
    }
}
