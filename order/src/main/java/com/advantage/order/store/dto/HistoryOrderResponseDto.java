package com.advantage.order.store.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * @author ostrovsm on 30/05/2016.
 */
public class HistoryOrderResponseDto {

    private String message;
    List<HistoryOrderHeaderDto> ordersHistory;

    public HistoryOrderResponseDto(){
        ordersHistory = new ArrayList<HistoryOrderHeaderDto>(){};
    }

    public List<HistoryOrderHeaderDto> getOrdersHistory() {
        ordersHistory = ordersHistory ==null ? new ArrayList<HistoryOrderHeaderDto>(){}: ordersHistory;
        return ordersHistory;
    }

    public void setOrdersHistory(List<HistoryOrderHeaderDto> ordersHistory) {
        this.ordersHistory = ordersHistory;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void addOrderHistoryDto(HistoryOrderHeaderDto historyOrderHeaderDto){
        ordersHistory = ordersHistory ==null ? new ArrayList<HistoryOrderHeaderDto>(){}: ordersHistory;
        ordersHistory.add(historyOrderHeaderDto);
    }
}
