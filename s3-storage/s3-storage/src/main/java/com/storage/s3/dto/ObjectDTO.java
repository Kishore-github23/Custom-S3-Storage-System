package com.storage.s3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ObjectDTO {
    private Long id;
    private String key;
    private Long size;
    private String contentType;
    private String etag;
    private LocalDateTime createdAt;
}