package com.advantage.catalog.store.services;

import com.advantage.catalog.store.dao.deal.DealRepository;
import com.advantage.common.dto.CatalogResponse;
import com.advantage.common.dto.PromotedProductDto;
import com.advantage.catalog.store.model.deal.Deal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DealService {

    @Autowired
    @Qualifier("dealRepository")
    public DealRepository dealRepository;
    @Autowired
    private ProductService productService;

    @Transactional(readOnly = true)
    public List<Deal> getAllDeals() {

        return dealRepository.getAll();
    }

    @Transactional(readOnly = true)
    public Deal getDealOfTheDay() {

        return dealRepository.getDealOfTheDay();
    }

    public Deal getDealOfTheDay(Long categoryId) {

        return dealRepository.getDealOfTheDay(categoryId);
    }

    public PromotedProductDto getPromotedProductDtoInCategory(Long categoryId) {
        return getPromotedProductDto(getDealOfTheDay(categoryId));
    }

    private PromotedProductDto getPromotedProductDto(Deal promotion) {
        return promotion == null ? null :
                new PromotedProductDto(promotion.getStaringPrice(), promotion.getPromotionHeader(),
                        promotion.getPromotionSubHeader(), promotion.getManagedImageId(),
                        productService.getDtoByEntity(promotion.getProduct()));
    }
}