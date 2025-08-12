package com.aca.postservice.controller;

import com.aca.postservice.dto.CreatePostRequest;
import com.aca.postservice.dto.PostResponse;
import com.aca.postservice.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Post Controller", description = "API para gestión de publicaciones de aventuras")
public class PostController {
    
    private final PostService postService;
    
    @PostMapping
    @Operation(summary = "Crear nueva publicación", description = "Crea una nueva publicación de aventura")
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody CreatePostRequest request) {
        log.info("Recibida solicitud para crear publicación: {}", request.getTitle());
        PostResponse response = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener publicación por ID", description = "Obtiene una publicación específica por su ID")
    public ResponseEntity<PostResponse> getPostById(
            @Parameter(description = "ID de la publicación") @PathVariable Long id) {
        log.info("Solicitud para obtener publicación con ID: {}", id);
        PostResponse response = postService.getPostById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    @Operation(summary = "Obtener todas las publicaciones", description = "Obtiene todas las publicaciones con paginación")
    public ResponseEntity<Page<PostResponse>> getAllPosts(
            @Parameter(description = "Número de página (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de la página") @RequestParam(defaultValue = "10") int size) {
        log.info("Solicitud para obtener publicaciones - página: {}, tamaño: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponse> response = postService.getAllPosts(pageable);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Obtener publicaciones por usuario", description = "Obtiene todas las publicaciones de un usuario específico")
    public ResponseEntity<List<PostResponse>> getPostsByUserId(
            @Parameter(description = "ID del usuario") @PathVariable Long userId) {
        log.info("Solicitud para obtener publicaciones del usuario: {}", userId);
        List<PostResponse> response = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Buscar publicaciones", description = "Busca publicaciones por ubicación o tipo de aventura")
    public ResponseEntity<Page<PostResponse>> searchPosts(
            @Parameter(description = "Ubicación para buscar") @RequestParam(required = false) String location,
            @Parameter(description = "Tipo de aventura para buscar") @RequestParam(required = false) String adventureType,
            @Parameter(description = "Número de página (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de la página") @RequestParam(defaultValue = "10") int size) {
        log.info("Solicitud de búsqueda - ubicación: {}, tipo: {}, página: {}, tamaño: {}", 
                location, adventureType, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponse> response = postService.searchPosts(location, adventureType, pageable);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/feed")
    @Operation(summary = "Obtener feed de publicaciones", description = "Obtiene publicaciones de usuarios específicos para el feed")
    public ResponseEntity<List<PostResponse>> getFeedPosts(
            @Parameter(description = "Lista de IDs de usuarios a seguir") @RequestParam List<Long> userIds) {
        log.info("Solicitud para obtener feed de usuarios: {}", userIds);
        List<PostResponse> response = postService.getPostsByUserIds(userIds);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar publicación", description = "Actualiza una publicación existente")
    public ResponseEntity<PostResponse> updatePost(
            @Parameter(description = "ID de la publicación") @PathVariable Long id,
            @Valid @RequestBody CreatePostRequest request) {
        log.info("Solicitud para actualizar publicación con ID: {}", id);
        PostResponse response = postService.updatePost(id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar publicación", description = "Elimina una publicación existente")
    public ResponseEntity<Void> deletePost(
            @Parameter(description = "ID de la publicación") @PathVariable Long id) {
        log.info("Solicitud para eliminar publicación con ID: {}", id);
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/like")
    @Operation(summary = "Dar like a publicación", description = "Incrementa el contador de likes de una publicación")
    public ResponseEntity<Void> likePost(
            @Parameter(description = "ID de la publicación") @PathVariable Long id) {
        log.info("Solicitud para dar like a la publicación: {}", id);
        postService.likePost(id);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}/like")
    @Operation(summary = "Quitar like de publicación", description = "Decrementa el contador de likes de una publicación")
    public ResponseEntity<Void> unlikePost(
            @Parameter(description = "ID de la publicación") @PathVariable Long id) {
        log.info("Solicitud para quitar like de la publicación: {}", id);
        postService.unlikePost(id);
        return ResponseEntity.ok().build();
    }
}
