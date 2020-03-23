package com.advantage.catalog.store.services;

import com.advantage.common.dto.MostPopularCommentDto;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.Future;

/**
 * @author Binyamin Regev on on 02/08/2016.
 */
@Service
public class MostPopularCommentService {

    // Artificial delay in milliseconds: 500L = 0.5 sec ; 10000L = 10 sec, etc.
    private static final long ASYNC_TIMEOUT = 500L;    //

    RestTemplate restTemplate = new RestTemplate();

    /**
     * Asynchronous method using <b><i>@Async</i></b> Spring annotation.
     * @param userCommentId
     * @return
     * @throws InterruptedException
     */
    @Async
    public Future<MostPopularCommentDto> findUserComment(int userCommentId) throws InterruptedException {
        System.out.println("Looking up user comment number " + userCommentId);

        //MostPopularCommentDto userComment = restTemplate.getForObject("http://api.github.com/users/" + userCommentId, MostPopularCommentDto.class);
        MostPopularCommentDto userComment = lookupUserComment(userCommentId);

        // Artificial delay of 1s for demonstration purposes
        Thread.sleep(ASYNC_TIMEOUT);

        return new AsyncResult<MostPopularCommentDto>(userComment);
    }

    /**
     * Lookup user comment and score according to <b>{@code userCommentId}</b>.
     * @param userCommentId
     * @return
     */
    private MostPopularCommentDto lookupUserComment(int userCommentId) {
        MostPopularCommentDto userComment;

        switch (userCommentId) {
            case 0:
                userComment = new MostPopularCommentDto("Great sound. It’s all about the bass.", 9.3);
                break;
            case 1:
                userComment = new MostPopularCommentDto("Very comfortable headphones. Felt very light on the ears.", 8.9);
                break;
            case 2:
                userComment = new MostPopularCommentDto("The noise cancelling feature worked great. I don’t even hear the bus on my commute home.", 9.7);
                break;
            case 3:
                userComment = new MostPopularCommentDto("My ears sweated a lot when wearing the headphones. Next time I won’t wear them in the sauna.", 7.6);
                break;
            case 4:
                userComment = new MostPopularCommentDto("The noise cancelling didn’t work that well. I could still hear my wife yelling at me.", 3.8);
                break;
            case 5:
                userComment = new MostPopularCommentDto("I really wish they came in other colors. Hot pink would match much better with my shirt.", 9.4);
                break;
            case 6:
                userComment = new MostPopularCommentDto("They didn’t fit great. I had to take off my bike helmet to get them on.", 7.8);
                break;
            case 7:
                userComment = new MostPopularCommentDto("The cable wasn’t very long. I couldn’t get to the bathroom with the earphones plugged in to my stereo.", 6.4);
                break;
            case 8:
                userComment = new MostPopularCommentDto("If they go on the ears, shouldn’t they be called earphones?", 9.9);
                break;
            case 9:
                userComment = new MostPopularCommentDto("I don’t get it – is 20 hours how long it takes to recharge the batteries or how long they last?", 7.1);
                break;
            default:
                userComment = new MostPopularCommentDto("User comment not found", 0.0);
        }

        return userComment;
    }
}
