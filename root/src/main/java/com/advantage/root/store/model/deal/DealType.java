package com.advantage.root.store.model.deal;

public enum DealType {

    DAILY(Integer.valueOf(10)),
    WEEKLY(Integer.valueOf(20));

    private final Integer dealTypeCode;

    private DealType(final Integer dealTypeCode) {

        assert dealTypeCode != null;

        this.dealTypeCode = dealTypeCode;
    }

    public Integer getDealTypeCode() {

        return dealTypeCode;
    }
}