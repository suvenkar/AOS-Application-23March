package com.advantage.order.store.dto;

import java.util.List;

/**
 * @author Ostrovski Moti on 26/05/2016.
 */
public class HistoryOrdersDto {
    private List<HistoryOrderHeaderDto> ordersHistory;

    //region constructors
    public HistoryOrdersDto(){}

    public HistoryOrdersDto(List<HistoryOrderHeaderDto> ordersHistory) {
        this.ordersHistory = ordersHistory;
    }
    //endregion constructor

    public List<HistoryOrderHeaderDto> getOrdersHistory() {
        return ordersHistory;
    }

    public void setOrdersHistory(List<HistoryOrderHeaderDto> ordersHistory) {
        this.ordersHistory = ordersHistory;
    }
}
