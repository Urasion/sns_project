package com.example.sns_project.service;

import com.amazonaws.services.s3.AmazonS3;
import com.example.sns_project.dto.*;
import com.example.sns_project.entity.Board;
import com.example.sns_project.entity.Comment;
import com.example.sns_project.entity.Files;
import com.example.sns_project.entity.Member;
import com.example.sns_project.repository.BoardRepository;
import com.example.sns_project.repository.CommentRepository;
import com.example.sns_project.repository.FileRepository;
import com.example.sns_project.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardService {
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;
    private final AmazonS3 amazonS3;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Transactional
    public Board saveBoard(String username, BoardDto boardDto){
        log.info("title : {}", boardDto.getTitle());
        Member member = memberRepository.findByUsername(username).get(0);
        Board board = new Board(member, boardDto.getTitle(), boardDto.getContent(), LocalDateTime.now(), boardDto.getHashTag());
        log.info("보드 정보 : {}",board);
        boardRepository.save(board);
        return board;
    }
    public ResponseDto getBoard(String name)  {
        List<Board> result = boardRepository.findBoardByName(name);
        List<BoardDataDto> boardList = new ArrayList<>();
        for (Board board : result) {
            boardList.add(board.convertDto());
        }
        return new ResponseDto(HttpStatus.OK.value(), "성공적으로 반환완료", boardList);
    }
    public ResponseDto getBoardByContent(String content) throws MalformedURLException {
        List<Board> result = boardRepository.findBoardByContent(content);
        List<BoardDataDto> boardList = new ArrayList<>();
        for (Board board : result) {
            boardList.add(board.convertDto());
        }
        return new ResponseDto(HttpStatus.OK.value(), "성공적으로 반환완료", boardList);
    }
    public ResponseDto getFriendBoard(List<FriendDto> friends) throws MalformedURLException {
        List<BoardDataDto> boardList = new ArrayList<>();
        for (FriendDto friend : friends) {
            List<Board> result = boardRepository.findBoardByName(friend.getMember().getName());
            for (Board board : result) {
                boardList.add(board.convertDto());
            }
        }
        return new ResponseDto(HttpStatus.OK.value(), "성공적으로 반환완료", boardList);
    }
    public ResponseDto deleteBoard(BoardDataDto boardDto){
        Board board = boardRepository.findById(boardDto.getId());
        List<Files> files = board.getFiles();
        for (Files file : files) {
            amazonS3.deleteObject(bucket, file.getPath());
        }
        boardRepository.deleteBoard(board);
        return new ResponseDto(HttpStatus.OK.value(), "게시글 삭제 완료", null);
    }
    @Transactional
    public ResponseDto saveComment(String username, CommentDto commentDto){
        Member member = memberRepository.findByUsername(username).get(0);
        Board board = boardRepository.findById(commentDto.getBoardId());
        Comment comment = new Comment(member, board, commentDto.getContent(), LocalDateTime.now(), commentDto.getState());
        commentRepository.save(comment);
        return new ResponseDto(HttpStatus.OK.value(), "댓글 작성 작성", commentDto);
    }
    @Transactional
    public ResponseDto deleteComment(CommentDto commentDto){
        Comment comment = commentRepository.findById(commentDto.getCommentId());
        commentRepository.delete(comment);
        return new ResponseDto(HttpStatus.OK.value(), "댓글 삭제 완료", null);
    }
    public ResponseDto updateComment(CommentDto commentDto){
        Comment comment = commentRepository.findById(commentDto.getCommentId());
        commentRepository.save(comment);
        return new ResponseDto(HttpStatus.OK.value(), "댓글 수정 완료", null);
    }
    public ResponseDto getComment(String boardId){
        Board board = boardRepository.findByIdFetchComment(Long.parseLong(boardId));
        List<Comment> comments = board.getComments();
        ArrayList<CommentDto> result = new ArrayList<>();
        for (Comment comment : comments) {
            CommentDto commentDto = comment.convertDto();
            commentDto.setBoardId(Long.parseLong(boardId));
            result.add(commentDto);
        }
        return new ResponseDto(HttpStatus.OK.value(), "댓글 가져오기 완료", result);
    }
    public ResponseDto getBoardById(String id){
        List<Board> boardList = boardRepository.findBoardById(id);
        ArrayList<BoardDataDto> result = new ArrayList<>();
        for (Board board : boardList) {
            result.add(board.convertDto());
        }
        return new ResponseDto(HttpStatus.OK.value(), "id로 게시글 가져오기 완료", result);
    }
}
