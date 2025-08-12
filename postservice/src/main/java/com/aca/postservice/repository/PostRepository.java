package com.aca.postservice.repository;

import com.aca.postservice.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT p FROM Post p WHERE p.location LIKE %:location% OR p.adventureType LIKE %:adventureType%")
    Page<Post> findByLocationOrAdventureType(@Param("location") String location, 
                                           @Param("adventureType") String adventureType, 
                                           Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.userId IN :userIds ORDER BY p.createdAt DESC")
    List<Post> findByUserIdsOrderByCreatedAtDesc(@Param("userIds") List<Long> userIds);
}
