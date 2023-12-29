package com.example.sns_project.entity;

import com.example.sns_project.dto.CommentDto;
import com.example.sns_project.enums.CommentEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Comment {
    @Id
    @Column(name = "comment_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    private String content;

    private LocalDateTime createAt;

    @Enumerated(EnumType.STRING)
    private CommentEnum state;

    public Comment(Member member, Board board, String content, LocalDateTime createAt, CommentEnum state) {
        this.member = member;
        this.board = board;
        this.content = content;
        this.createAt = createAt;
        this.state = state;
    }
    public void update(String content){
        this.content = content;
    }
    public CommentDto convertDto(){
        return new CommentDto(this.id, this.board.getId(),this.content, this.state, this.member.convertDto());
    }
}
