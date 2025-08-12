package com.aca.postservice.service.impl;

import com.aca.postservice.dto.CreatePostRequest;
import com.aca.postservice.dto.PostResponse;
import com.aca.postservice.event.PostCreatedEvent;
import com.aca.postservice.model.Post;
import com.aca.postservice.repository.PostRepository;
import com.aca.postservice.service.EventPublisherService;
import com.aca.postservice.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PostServiceImpl implements PostService {
    
    private final PostRepository postRepository;
    private final EventPublisherService eventPublisherService;
    
    @Override
    public PostResponse createPost(CreatePostRequest request) {
        log.info("Creando nueva publicación: {}", request.getTitle());
        
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setLocation(request.getLocation());
        post.setAdventureType(request.getAdventureType());
        post.setDifficultyLevel(request.getDifficultyLevel());
        post.setEstimatedDuration(request.getEstimatedDuration());
        post.setUserId(request.getUserId());
        post.setUserName(request.getUserName());
        post.setPhotos(request.getPhotos());
        
        Post savedPost = postRepository.save(post);
        log.info("Publicación creada exitosamente con ID: {}", savedPost.getId());
        
        // Publicar evento
        PostCreatedEvent event = new PostCreatedEvent(
            savedPost.getId(),
            savedPost.getTitle(),
            savedPost.getLocation(),
            savedPost.getAdventureType(),
            savedPost.getUserId(),
            savedPost.getUserName(),
            savedPost.getPhotos(),
            savedPost.getCreatedAt()
        );
        eventPublisherService.publishPostCreatedEvent(event);
        
        return mapToPostResponse(savedPost);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PostResponse getPostById(Long id) {
        log.info("Buscando publicación con ID: {}", id);
        
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada con ID: " + id));
        
        return mapToPostResponse(post);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPosts(Pageable pageable) {
        log.info("Obteniendo todas las publicaciones con paginación");
        
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return posts.map(this::mapToPostResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByUserId(Long userId) {
        log.info("Obteniendo publicaciones del usuario: {}", userId);
        
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return posts.stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<PostResponse> searchPosts(String location, String adventureType, Pageable pageable) {
        log.info("Buscando publicaciones con ubicación: {} y tipo de aventura: {}", location, adventureType);
        
        Page<Post> posts = postRepository.findByLocationOrAdventureType(location, adventureType, pageable);
        return posts.map(this::mapToPostResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByUserIds(List<Long> userIds) {
        log.info("Obteniendo publicaciones de usuarios: {}", userIds);
        
        List<Post> posts = postRepository.findByUserIdsOrderByCreatedAtDesc(userIds);
        return posts.stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public PostResponse updatePost(Long id, CreatePostRequest request) {
        log.info("Actualizando publicación con ID: {}", id);
        
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada con ID: " + id));
        
        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setLocation(request.getLocation());
        post.setAdventureType(request.getAdventureType());
        post.setDifficultyLevel(request.getDifficultyLevel());
        post.setEstimatedDuration(request.getEstimatedDuration());
        post.setPhotos(request.getPhotos());
        
        Post updatedPost = postRepository.save(post);
        log.info("Publicación actualizada exitosamente");
        
        return mapToPostResponse(updatedPost);
    }
    
    @Override
    public void deletePost(Long id) {
        log.info("Eliminando publicación con ID: {}", id);
        
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Publicación no encontrada con ID: " + id);
        }
        
        postRepository.deleteById(id);
        log.info("Publicación eliminada exitosamente");
    }
    
    @Override
    public void likePost(Long postId) {
        log.info("Dando like a la publicación: {}", postId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada con ID: " + postId));
        
        post.setLikesCount(post.getLikesCount() + 1);
        postRepository.save(post);
        log.info("Like agregado a la publicación: {}", postId);
    }
    
    @Override
    public void unlikePost(Long postId) {
        log.info("Quitando like de la publicación: {}", postId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada con ID: " + postId));
        
        if (post.getLikesCount() > 0) {
            post.setLikesCount(post.getLikesCount() - 1);
            postRepository.save(post);
            log.info("Like removido de la publicación: {}", postId);
        }
    }
    
    private PostResponse mapToPostResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setDescription(post.getDescription());
        response.setLocation(post.getLocation());
        response.setAdventureType(post.getAdventureType());
        response.setDifficultyLevel(post.getDifficultyLevel());
        response.setEstimatedDuration(post.getEstimatedDuration());
        response.setUserId(post.getUserId());
        response.setUserName(post.getUserName());
        response.setPhotos(post.getPhotos());
        response.setLikesCount(post.getLikesCount());
        response.setCommentsCount(post.getCommentsCount());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        return response;
    }
}
