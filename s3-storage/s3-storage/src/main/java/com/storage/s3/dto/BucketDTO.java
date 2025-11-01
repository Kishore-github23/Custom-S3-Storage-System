package com.storage.s3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BucketDTO {
    private Long id;
    private String name;
    private Boolean isPublic;
    private Long objectCount;
    private LocalDateTime createdAt;
}