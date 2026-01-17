package com.literacy.assessment.service;

import com.literacy.assessment.dto.BookDto;
import com.literacy.assessment.entity.Book;
import com.literacy.assessment.entity.DifficultyLevel;
import com.literacy.assessment.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {
    
    private final BookRepository bookRepository;
    
    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public BookDto getBookById(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found: " + bookId));
        return convertToDto(book);
    }
    
    public List<BookDto> getBooksByDifficultyLevel(DifficultyLevel difficultyLevel) {
        return bookRepository.findByDifficultyLevel(difficultyLevel).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public BookDto createBook(BookDto bookDto) {
        Book book = Book.builder()
                .title(bookDto.getTitle())
                .author(bookDto.getAuthor())
                .publisher(bookDto.getPublisher())
                .publishedYear(bookDto.getPublishedYear())
                .isbn(bookDto.getIsbn())
                .category(bookDto.getCategory())
                .description(bookDto.getDescription())
                .coverImageUrl(bookDto.getCoverImageUrl())
                .difficultyLevel(bookDto.getDifficultyLevel())
                .build();
        
        Book savedBook = bookRepository.save(book);
        return convertToDto(savedBook);
    }
    
    private BookDto convertToDto(Book book) {
        return BookDto.builder()
                .bookId(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .publishedYear(book.getPublishedYear())
                .isbn(book.getIsbn())
                .category(book.getCategory())
                .description(book.getDescription())
                .coverImageUrl(book.getCoverImageUrl())
                .difficultyLevel(book.getDifficultyLevel())
                .build();
    }
}
