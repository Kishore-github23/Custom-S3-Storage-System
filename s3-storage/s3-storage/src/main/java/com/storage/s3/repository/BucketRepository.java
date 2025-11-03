package com.storage.s3.repository;

import com.storage.s3.entity.Bucket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BucketRepository extends JpaRepository<Bucket, Long> {
    List<Bucket> findByOwnerId(Long ownerId);
    Optional<Bucket> findByName(String name);
    boolean existsByName(String name);
    Optional<Bucket> findByNameAndOwnerId(String name, Long ownerId);
}