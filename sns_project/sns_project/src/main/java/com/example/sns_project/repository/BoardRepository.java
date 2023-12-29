package com.example.sns_project.repository;

import com.example.sns_project.entity.Board;
import com.example.sns_project.entity.Comment;
import com.example.sns_project.entity.Profile;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BoardRepository {
    private final EntityManager em;

    public void save(Board board){
        if(board.getId() == null){
            em.persist(board);
        }else{
            em.merge(board);
        }
    }
    public List<Board> findBoardByNamePaging(String name, Integer pageStart, Integer pageCount){
        return em.createQuery("select b from Board b " +
                "left join fetch b.files f " +
                "where b.member.name like concat('%',:name,'%') ", Board.class)
                .setMaxResults(pageCount)
                .setFirstResult(pageStart)
                .setParameter("name", name).getResultList();
    }
    public List<Board> findBoardByName(String name){
        return em.createQuery("select b from Board b " +
                        "left join fetch b.files f " +
                        "where b.member.name like concat('%',:name,'%') ", Board.class)
                .setParameter("name", name).getResultList();
    }
    public List<Board> findBoardByContent(String content){
        return em.createQuery("select b from Board b " +
                "left join fetch b.files f " +
                "where b.content like concat('%',:content,'%') ", Board.class).setParameter("content", content).getResultList();

    }
    public Board findById(Long id){
        return em.createQuery("select b from Board b " +
                "left join fetch b.files f " +
                "where b.id = :id ", Board.class).setParameter("id", id)
                .getSingleResult();
    }
    public Board findByIdFetchComment(Long id){
        return em.createQuery("select b from Board b " +
                "left join fetch b.comments c " +
                "left join fetch c.member m " +
                "where b.id = :id", Board.class).setParameter("id", id).getSingleResult();
    }
    public void deleteBoard(Board board){
        em.remove(board);
    }
    public List<Board> findBoardById(String id, Integer pageStart, Integer pageCount){
        return em.createQuery("select b from Board b " +
                "left join fetch b.files f " +
                "where b.member.id = :id ", Board.class).setParameter("id", id)
                .setMaxResults(pageCount)
                .setFirstResult(pageStart)
                .getResultList();
    }
    public Board findByIdForDel(Long commentId){
        return em.find(Board.class, commentId);
    }
}
