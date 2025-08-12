package com.aca.postservice.controller;

import com.aca.postservice.dto.CreateCommentRequest;
import com.aca.postservice.model.Comment;
import com.aca.postservice.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Comment Controller", description = "API para gestión de comentarios en publicaciones")
public class CommentController {
    
    private final CommentService commentService;
    
    @PostMapping
    @Operation(summary = "Crear nuevo comentario", description = "Crea un nuevo comentario en una publicación")
    public ResponseEntity<Comment> createComment(@Valid @RequestBody CreateCommentRequest request) {
        log.info("Recibida solicitud para crear comentario en el post: {}", request.getPostId());
        Comment response = commentService.createComment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/post/{postId}")
    @Operation(summary = "Obtener comentarios por post", description = "Obtiene todos los comentarios de una publicación específica")
    public ResponseEntity<List<Comment>> getCommentsByPostId(
            @Parameter(description = "ID de la publicación") @PathVariable Long postId) {
        log.info("Solicitud para obtener comentarios del post: {}", postId);
        List<Comment> response = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar comentario", description = "Elimina un comentario específico")
    public ResponseEntity<Void> deleteComment(
            @Parameter(description = "ID del comentario") @PathVariable Long id) {
        log.info("Solicitud para eliminar comentario con ID: {}", id);
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
