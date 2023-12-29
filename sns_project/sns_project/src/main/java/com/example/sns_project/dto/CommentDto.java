package com.example.sns_project.dto;

import com.example.sns_project.entity.Member;
import com.example.sns_project.enums.CommentEnum;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private Long commentId;
    private Long boardId;
    private String content;
    private CommentEnum state;
    private MemberDto member;

}
