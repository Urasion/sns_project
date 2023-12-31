package com.example.sns_project.Service;

import com.example.sns_project.dto.FriendDataDto;
import com.example.sns_project.dto.FriendDto;
import com.example.sns_project.dto.ResponseDto;
import com.example.sns_project.entity.Friend;
import com.example.sns_project.entity.Member;
import com.example.sns_project.enums.FriendEnum;
import com.example.sns_project.enums.MemberRole;
import com.example.sns_project.repository.FriendRepository;
import com.example.sns_project.repository.MemberRepository;
import com.example.sns_project.service.FriendService;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;

@SpringBootTest
@Transactional
public class FriendServiceTest {
    @Autowired
    private FriendService friendService;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private FriendRepository friendRepository;
    @Autowired
    private EntityManager em;

    @Test
    void getFriendList(){
        Member member = new Member("wldnjs3690","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member2 = new Member("wldnjs77","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member3 = new Member("wldnjs","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        memberRepository.save(member);
        memberRepository.save(member2);
        memberRepository.save(member3);
        em.clear();
        em.flush();
        Friend friend = new Friend(member, member2, FriendEnum.COMPLETE);
        Friend friend1 = new Friend(member, member3, FriendEnum.COMPLETE);
        friendRepository.save(friend);
        friendRepository.save(friend1);
        em.flush();
        em.clear();
        ResponseDto friendList = friendService.findFriendList(member.getId());
        Object result = friendList.getResult();
        System.out.println(result);
    }
    @Test
    void getWaitRequestList(){
        Member member = new Member("wldnjs3690","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member2 = new Member("wldnjs77","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member3 = new Member("wldnjs","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        memberRepository.save(member);
        memberRepository.save(member2);
        memberRepository.save(member3);
        em.clear();
        em.flush();
        Friend friend = new Friend(member, member2, FriendEnum.WAIT);
        Friend friend1 = new Friend(member3, member, FriendEnum.WAIT);
        friendRepository.save(friend);
        friendRepository.save(friend1);
        ResponseDto friendList = friendService.findWaitRequestFriendList(member.getId());
        Object result = friendList.getResult();
        System.out.println(result);
    }
    @Test
    void getWaitRequestedList(){
        Member member = new Member("wldnjs3690","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member2 = new Member("wldnjs77","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member3 = new Member("wldnjs","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        memberRepository.save(member);
        memberRepository.save(member2);
        memberRepository.save(member3);
        em.clear();
        em.flush();
        Friend friend = new Friend(member, member2, FriendEnum.WAIT);
        Friend friend1 = new Friend(member3, member, FriendEnum.WAIT);
        friendRepository.save(friend);
        friendRepository.save(friend1);
        ResponseDto friendList = friendService.findWaitRequestedFriendList(member.getId());
        Object result = friendList.getResult();
        System.out.println(result);
    }
    @Test
    void addFriendTest(){
        Member member = new Member("wldnjs3690","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member2 = new Member("wldnjs77","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member3 = new Member("wldnjs","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        memberRepository.save(member);
        memberRepository.save(member2);
        memberRepository.save(member3);
        em.clear();
        em.flush();
        ResponseDto result1 = friendService.save(new FriendDataDto(member.getId(), member2.getId(),null));
        System.out.println(result1.getMessage());
        ResponseDto result2 = friendService.save(new FriendDataDto(member2.getId(), member.getId(),null));

        System.out.println(result2.getMessage());
    }
    @Test
    void checkFriendTest(){
        Member member = new Member("wldnjs3690","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member2 = new Member("wldnjs77","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member3 = new Member("wldnjs","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        memberRepository.save(member);
        memberRepository.save(member2);
        memberRepository.save(member3);
        em.clear();
        em.flush();
        friendService.save(new FriendDataDto(member.getId(), member2.getId(),null));
        System.out.println(friendService.checkFriendRequest(new FriendDataDto(member.getId(), member2.getId(),null)).getMessage());
        System.out.println(friendService.checkFriendRequest(new FriendDataDto(member.getId(), member3.getId(),null)).getMessage());
        System.out.println(friendService.checkFriendRequest(new FriendDataDto(member2.getId(), member.getId(),null)).getMessage());
    }
    @Test
    void acceptFriendTest(){
        Member member = new Member("wldnjs3690","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member2 = new Member("wldnjs77","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        Member member3 = new Member("wldnjs","1234","정지원","1234@gmail.com", LocalDateTime.now(),"origin","MALE",LocalDateTime.now(), MemberRole.ROLE_USER);
        memberRepository.save(member);
        memberRepository.save(member2);
        memberRepository.save(member3);
        em.clear();
        em.flush();
        friendService.save(new FriendDataDto(member.getId(), member2.getId(),null));
        ArrayList<FriendDto> result =
                (ArrayList<FriendDto>) friendService.findWaitRequestFriendList(member.getId()).getResult();
        em.clear();
        em.flush();
        System.out.println(result.get(0));
        friendService.acceptFriendRequest(result.get(0).getId());
        System.out.println(member.getId());
        System.out.println( friendService.findFriendList(member.getId()).getResult());
    }
}
