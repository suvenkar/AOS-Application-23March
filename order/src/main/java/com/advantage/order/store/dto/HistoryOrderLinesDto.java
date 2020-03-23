package com.advantage.order.store.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.Date;
import java.util.List;

/**
 * @author Binyamin Regev on on 24/07/2016.
 */
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class HistoryOrderLinesDto {

    @JsonProperty("UserId")
    private long userId;
    @JsonProperty("OrderNumber")
    private long orderNumber;
    @JsonIgnore
    private long orderTimestamp;
    @JsonProperty("OrderDate")
    private Date orderDate;
    @JsonProperty("TotalOrderPrice")
    private double totalPrice;
    @JsonProperty("OrderLines")
    private List<HistoryOrderLineDto> orderLines;


    public HistoryOrderLinesDto() {
    }

    public HistoryOrderLinesDto(long userId, long orderNumber, long orderTimestamp) {
        this.userId = userId;
        this.orderNumber = orderNumber;
        this.orderTimestamp = orderTimestamp;
    }

    public HistoryOrderLinesDto(long userId, long orderNumber, Date orderDate) {
        this.userId = userId;
        this.orderNumber = orderNumber;
        this.orderDate = orderDate;
    }

    public HistoryOrderLinesDto(long userId, long orderNumber, long orderTimestamp, double totalPrice, List<HistoryOrderLineDto> orderLines) {
        this.userId = userId;
        this.orderNumber = orderNumber;
        this.orderTimestamp = orderTimestamp;
        this.totalPrice = totalPrice;
        this.orderLines = orderLines;
    }

    public HistoryOrderLinesDto(long userId, long orderNumber, Date orderDate, double totalPrice, List<HistoryOrderLineDto> orderLines) {
        this.userId = userId;
        this.orderNumber = orderNumber;
        this.orderDate = orderDate;
        this.totalPrice = totalPrice;
        this.orderLines = orderLines;
    }

    public HistoryOrderLinesDto(long userId, long orderNumber, long orderTimestamp, Date orderDate, double totalPrice, List<HistoryOrderLineDto> orderLines) {
        this.userId = userId;
        this.orderNumber = orderNumber;
        this.orderTimestamp = orderTimestamp;
        this.orderDate = orderDate;
        this.totalPrice = totalPrice;
        this.orderLines = orderLines;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(long orderNumber) {
        this.orderNumber = orderNumber;
    }

    public long getOrderTimestamp() {
        return orderTimestamp;
    }

    public void setOrderTimestamp(long orderTimestamp) {
        this.orderTimestamp = orderTimestamp;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<HistoryOrderLineDto> getOrderLines() {
        return orderLines;
    }

    public void setOrderLines(List<HistoryOrderLineDto> orderLines) {
        this.orderLines = orderLines;
    }

    public void addOrderLine(HistoryOrderLineDto orderLine) {
        totalPrice += (orderLine.getPricePerItem() * orderLine.getQuantity());
        orderLines.add(orderLine);
    }

    public void addOrderLine(long userId, long orderNumber, long orderTimestamp, Long productId, String productImageUrl, String productName, int productColor, double pricePerItem, int quantity) {
        addOrderLine(new HistoryOrderLineDto(
                userId,
                orderNumber,
                orderTimestamp,
                productId,
                productImageUrl,
                productName,
                productColor,
                pricePerItem,
                quantity));
    }

    public void removeOrderLine(HistoryOrderLineDto orderLine) {
        totalPrice -= (orderLine.getPricePerItem() * orderLine.getQuantity());
        orderLines.remove(orderLine);
    }

    public void clearOrderLines() {
        totalPrice = 0;
        orderLines.clear();
    }

}
