package com.advantage.common.dto;

/**
 * @author Binyamin Regev on on 02/08/2016.
 */
public class MostPopularCommentDto {
    private String comment;
    private double score;

    public MostPopularCommentDto() {
    }

    public MostPopularCommentDto(String comment, double score) {
        this.comment = comment;
        this.score = score;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
