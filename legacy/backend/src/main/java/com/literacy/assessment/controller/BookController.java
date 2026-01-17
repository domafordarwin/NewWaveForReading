package com.literacy.assessment.controller;

import com.literacy.assessment.dto.BookDto;
import com.literacy.assessment.entity.DifficultyLevel;
import com.literacy.assessment.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BookController {
    
    private final BookService bookService;
    
    @GetMapping
    public ResponseEntity<List<BookDto>> getAllBooks() {
        List<BookDto> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/{bookId}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long bookId) {
        BookDto book = bookService.getBookById(bookId);
        return ResponseEntity.ok(book);
    }
    
    @GetMapping("/difficulty/{level}")
    public ResponseEntity<List<BookDto>> getBooksByDifficulty(@PathVariable DifficultyLevel level) {
        List<BookDto> books = bookService.getBooksByDifficultyLevel(level);
        return ResponseEntity.ok(books);
    }
    
    @PostMapping
    public ResponseEntity<BookDto> createBook(@RequestBody BookDto bookDto) {
        BookDto createdBook = bookService.createBook(bookDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
    }
}
