package com.aca.postservice.service.impl;

import com.aca.postservice.dto.CreateCommentRequest;
import com.aca.postservice.model.Comment;
import com.aca.postservice.repository.CommentRepository;
import com.aca.postservice.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CommentServiceImpl implements CommentService {
    
    private final CommentRepository commentRepository;
    
    @Override
    public Comment createComment(CreateCommentRequest request) {
        log.info("Creando nuevo comentario para el post: {}", request.getPostId());
        
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPostId(request.getPostId());
        comment.setUserId(request.getUserId());
        comment.setUserName(request.getUserName());
        
        Comment savedComment = commentRepository.save(comment);
        log.info("Comentario creado exitosamente con ID: {}", savedComment.getId());
        
        return savedComment;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Comment> getCommentsByPostId(Long postId) {
        log.info("Obteniendo comentarios del post: {}", postId);
        
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }
    
    @Override
    public void deleteComment(Long id) {
        log.info("Eliminando comentario con ID: {}", id);
        
        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("Comentario no encontrado con ID: " + id);
        }
        
        commentRepository.deleteById(id);
        log.info("Comentario eliminado exitosamente");
    }
    
    @Override
    public void deleteCommentsByPostId(Long postId) {
        log.info("Eliminando todos los comentarios del post: {}", postId);
        
        commentRepository.deleteByPostId(postId);
        log.info("Comentarios eliminados exitosamente");
    }
}
