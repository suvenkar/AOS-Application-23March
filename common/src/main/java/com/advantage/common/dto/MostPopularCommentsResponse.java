package com.advantage.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Binyamin Regev on on 02/08/2016.
 */
public class MostPopularCommentsResponse {
    @JsonProperty("Success")
    private boolean success;
    @JsonProperty("Reason")
    private String reason;
    @JsonProperty("ExceptionText")
    private Exception exception;
    @JsonProperty("UserComments")
    private List<MostPopularCommentDto> userComments;

    public MostPopularCommentsResponse() {
        this.userComments = new ArrayList<MostPopularCommentDto>();
    }

    public MostPopularCommentsResponse(boolean success, String reason) {
        this.success = success;
        this.reason = reason;
        this.userComments = userComments;
    }

    public MostPopularCommentsResponse(boolean success, String reason, List<MostPopularCommentDto> userComments) {
        this.success = success;
        this.reason = reason;
        this.userComments = new ArrayList<MostPopularCommentDto>();
    }

    public MostPopularCommentsResponse(boolean success, String reason, Exception exception) {
        this.success = success;
        this.reason = reason;
        this.exception = exception;
        this.userComments = new ArrayList<MostPopularCommentDto>();
    }

    public MostPopularCommentsResponse(boolean success, String reason, Exception exception, List<MostPopularCommentDto> userComments) {
        this.success = success;
        this.reason = reason;
        this.exception = exception;
        this.userComments = userComments;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getReason() {
        return reason;
    }

    public Exception getException() {
        return exception;
    }

    public void setException(Exception exception) {
        this.exception = exception;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public List<MostPopularCommentDto> getUserComments() {
        return userComments;
    }

    public void setUserComments(List<MostPopularCommentDto> userComments) {
        this.userComments = userComments;
    }

    public void addUserComment(MostPopularCommentDto userComments) {
        this.getUserComments().add(userComments);
    }

    public void addUserComment(String comment, double score) {
        addUserComment(new MostPopularCommentDto(comment, score));
    }
}
