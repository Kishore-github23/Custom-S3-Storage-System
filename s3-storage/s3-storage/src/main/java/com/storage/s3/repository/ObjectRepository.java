package com.storage.s3.repository;

import com.storage.s3.entity.StorageObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ObjectRepository extends JpaRepository<StorageObject, Long> {
    List<StorageObject> findByBucketId(Long bucketId);
    Optional<StorageObject> findByBucketIdAndObjectKey(Long bucketId, String objectKey);
    void deleteByBucketId(Long bucketId);
    long countByBucketId(Long bucketId);
}