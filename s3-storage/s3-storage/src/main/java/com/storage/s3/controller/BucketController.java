package com.storage.s3.controller;

import com.storage.s3.dto.BucketDTO;
import com.storage.s3.service.BucketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/buckets")
@RequiredArgsConstructor
public class BucketController {
    
    private final BucketService bucketService;
    
    @PostMapping
    public ResponseEntity<BucketDTO> createBucket(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        Boolean isPublic = (Boolean) request.getOrDefault("isPublic", false);
        
        BucketDTO bucket = bucketService.createBucket(name, isPublic);
        return new ResponseEntity<>(bucket, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<BucketDTO>> listBuckets() {
        System.out.println("🔍 BucketController.listBuckets() called"); // Add logging
        List<BucketDTO> buckets = bucketService.listBuckets();
        System.out.println("📦 Found " + buckets.size() + " buckets"); // Add logging
        return ResponseEntity.ok(buckets);
    }
    
    @GetMapping("/{name}")
    public ResponseEntity<BucketDTO> getBucket(@PathVariable String name) {
        return ResponseEntity.ok(bucketService.getBucket(name));
    }
    
    @DeleteMapping("/{name}")
    public ResponseEntity<Map<String, String>> deleteBucket(@PathVariable String name) {
        bucketService.deleteBucket(name);
        return ResponseEntity.ok(Map.of("message", "Bucket deleted successfully"));
    }
    
    @PatchMapping("/{name}")
    public ResponseEntity<BucketDTO> updateBucketVisibility(
            @PathVariable String name,
            @RequestBody Map<String, Boolean> request) {
        Boolean isPublic = request.get("isPublic");
        return ResponseEntity.ok(bucketService.updateBucketVisibility(name, isPublic));
    }
}