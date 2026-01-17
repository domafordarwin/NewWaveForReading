package com.literacy.assessment.repository;

import com.literacy.assessment.entity.Book;
import com.literacy.assessment.entity.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    List<Book> findByDifficultyLevel(DifficultyLevel difficultyLevel);
    List<Book> findByTitleContaining(String title);
    List<Book> findByAuthorContaining(String author);
}
