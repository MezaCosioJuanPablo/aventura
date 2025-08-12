package com.aca.postservice.service;

import com.aca.postservice.dto.CreateCommentRequest;
import com.aca.postservice.model.Comment;

import java.util.List;

public interface CommentService {
    
    Comment createComment(CreateCommentRequest request);
    
    List<Comment> getCommentsByPostId(Long postId);
    
    void deleteComment(Long id);
    
    void deleteCommentsByPostId(Long postId);
}
