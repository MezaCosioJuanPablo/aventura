package com.aca.postservice.repository;

import com.aca.postservice.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
    
    void deleteByPostId(Long postId);
    
    long countByPostId(Long postId);
}
