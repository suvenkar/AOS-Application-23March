package com.advantage.catalog.store.services;

import com.advantage.catalog.store.config.ImageManagementConfiguration;
import com.advantage.catalog.store.dao.attribute.AttributeRepository;
import com.advantage.catalog.store.dao.product.ProductRepository;
import com.advantage.catalog.store.image.ImageManagement;
import com.advantage.catalog.store.image.ImageManagementAccess;
import com.advantage.catalog.store.image.ManagedImage;
import com.advantage.catalog.store.model.attribute.Attribute;
import com.advantage.catalog.store.model.category.Category;
import com.advantage.catalog.store.model.category.CategoryAttributeFilter;
import com.advantage.catalog.store.model.product.*;
import com.advantage.catalog.util.ArgumentValidationHelper;
import com.advantage.catalog.util.fs.FileSystemHelper;
import com.advantage.common.dto.*;
import com.advantage.common.enums.ProductStatusEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private static final int PRODUCT_USER_COMMENTS_NUMBER = 10;

    @Autowired
    public ProductRepository productRepository;
    @Autowired
    public AttributeRepository attributeRepository;
    @Autowired
    CategoryService categoryService;
    @Autowired
    private AttributeService attributeService;
    @Autowired
    private MostPopularCommentService mostPopularCommentService;
    @Autowired
    private Environment environment;

    public List<Product> getAllProducts() {
        return productRepository.getAll();
    }

    public List<Product> filterByName(String pattern, int quantity) {
        List<Category> categories = categoryService.getAllCategories();
        Long categoryId = -1L;
        for (Category category : categories) {
            if (category.getCategoryName().equalsIgnoreCase(pattern)) {
                categoryId = category.getCategoryId();
                break;
            }
        }
        List<Product> products = new ArrayList<Product>();
        if (categoryId.longValue() >= 0) {
            products = productRepository.filterByCategoryId(categoryId, quantity);
        } else {
            products = quantity > 0 ? productRepository.filterByName(pattern, quantity) : filterByName(pattern);
        }
        return products;
    }

    public List<Product> filterByName(String pattern) {
        return productRepository.filterByName(pattern);
    }

    public List<Product> filterByCategoryId(Long categoryId, int quantity) {
        return quantity > 0 ? productRepository.filterByCategoryId(categoryId, quantity) : filterByCategoryId(categoryId);
    }

    public List<Product> filterByCategoryId(Long categoryId) {
        return productRepository.filterByCategoryId(categoryId);
    }

    public List<Product> getCategoryProducts(final Long categoryId) {
        ArgumentValidationHelper.validateArgumentIsNotNull(categoryId, "category id");
        return productRepository.getCategoryProducts(categoryId);
    }

    public Product getProductById(Long id) {
        return productRepository.get(id);
    }

    @Transactional
    public ProductResponseDto createProduct(ProductDto dto) {
        Category category = categoryService.getCategory(dto.getCategoryId());

        if (category == null) return new ProductResponseDto(false, -1, "Could not find category");

        if(!ProductStatusEnum.contains(dto.getProductStatus()))return new ProductResponseDto(false, -1, "Product wasn't created, productStatus not valid");
        Product product = productRepository.create(dto.getProductName(), dto.getDescription(), dto.getPrice(),
                dto.getImageUrl(), category, dto.getProductStatus());

        if (product == null) return new ProductResponseDto(false, -1, "Product wasn't created");

        for (AttributeItem item : dto.getAttributes()) {
            ProductAttributes productAttributes = new ProductAttributes();
            productAttributes.setAttributeValue(item.getAttributeValue());
            productAttributes.setProduct(product);

            Attribute attribute = getAttributeByDto(item);
            if (attribute == null) {
                attribute = attributeService.createAttribute(item.getAttributeName());
            }

            productAttributes.setAttribute(attribute);
            product.getProductAttributes().add(productAttributes);
        }

        if (dto.getImages().size() == 0) {
            dto.getImages().add(product.getManagedImageId());
        }

        product.setColors(getColorAttributes(dto.getColors(), product));
        product.setImages(getImageAttribute(dto.getImages(), product));

        ProductResponseDto productResponseDto = new ProductResponseDto(true, product.getId(), "Product was created successful");
        return productResponseDto;
    }

    @Transactional(rollbackFor = Exception.class)
    public ProductResponseDto updateProduct(ProductDto dto, Long id) {
        Product product = productRepository.get(id);

        if (product == null) return new ProductResponseDto(false, -1, "Product not found");

        if(!ProductStatusEnum.contains(dto.getProductStatus()))return new ProductResponseDto(false, -1, "Product not created, productStatus not valid");
        Category category = categoryService.getCategory(dto.getCategoryId());
        if (category == null) return new ProductResponseDto(false, -1, "Could not find category");

        product.setColors(getColorAttributes(dto.getColors(), product));

        productRepository.update(dto, id);

        return new ProductResponseDto(true, product.getId(), "Product was updated successful");
    }

    /**
     * Delete a product with all its attributes, colors and images.
     */
    @Transactional
    public ProductResponseDto deleteProduct(Long productId) {
        ArgumentValidationHelper.validateLongArgumentIsPositive(productId, "product id");

        ProductResponseDto productResponse;

        Product productToDelete = productRepository.get(productId);
        if (productToDelete != null) {
            int result = productRepository.delete(productToDelete);
            if (result == 1) {
                productResponse = new ProductResponseDto(true, productToDelete.getId(), "Product was deleted successful");
            } else {
                productResponse = new ProductResponseDto(false, productToDelete.getId(), "Product was not deleted");
            }
        } else {
            productResponse = new ProductResponseDto(false, productToDelete.getId(), "Product id=" + productId + " was not found in products catalog");
        }

        return productResponse;
    }

    @Transactional(rollbackFor = Exception.class)
    public ImageUrlResponseDto fileUpload(MultipartFile file) {
        String imageManagementRepository =
                environment.getProperty(ImageManagementConfiguration.PROPERTY_IMAGE_MANAGEMENT_REPOSITORY);
        try {
            if(!FileSystemHelper.extractFileExtension(file.getOriginalFilename()).equalsIgnoreCase("jpg") ){
                return new ImageUrlResponseDto("-1", false, "file type should be .JPG only");
            }

            byte[] bytes = file.getBytes();
            String originalFileName = file.getOriginalFilename();
            ImageManagement imageManagement = ImageManagementAccess.getImageManagement(
                    ImageManagementConfiguration.getPath(imageManagementRepository));

            ManagedImage managedImage = imageManagement.addManagedImage(bytes, originalFileName, true);
            imageManagement.persist();

            return new ImageUrlResponseDto(managedImage.getId(), true, "Image successfully uploaded");
        } catch (Exception e) {
            return new ImageUrlResponseDto("", false, "Failed to upload " + e.getMessage());
        }
    }

    @Transactional
    public ProductCollectionDto getProductCollectionDto() {
        List<Product> products = getAllProducts();
        ProductCollectionDto dto = new ProductCollectionDto();
        dto.setProducts(fillProducts(products));
        dto.setColors(getColorsSet(products));
        dto.setMinPrice(getMinPrice(products));
        dto.setMaxPrice(getMaxPrice(products));

        return dto;
    }

    /**
     * Return colors unique set from Products collection
     *
     * @param products {@link Collection} Product collection
     * @return {@link HashSet} unique set of products colors
     */
    public Set<String> getColorsSet(Collection<Product> products) {
        Set<String> colors = new HashSet<>();
        for (Product product : products) {
            Set<ColorAttribute> set = product.getColors();
            colors.addAll(set.stream().map(ColorAttribute::getCode).collect(Collectors.toList()));
        }

        return colors;
    }

    /**
     * Return minimum price value from Product collection
     *
     * @param products {@link Collection} Product collection
     * @return {@link Double} price value
     */
    public String getMinPrice(Collection<Product> products) {
        double price = products.stream().min(Comparator.comparing(Product::getPrice)).get().getPrice();

        return Double.toString(price);
    }

    /**
     * Return maximum price value from Product collection
     *
     * @param products {@link Collection} Product collection
     * @return {@link Double} price value
     */
    public String getMaxPrice(Collection<Product> products) {
        double price = products.stream().max(Comparator.comparing(Product::getPrice)).get().getPrice();

        return Double.toString(price);
    }

    /**
     * Fill all products DTO parameters
     *
     * @param products {@link Collection} Collection of products
     * @return {@link List} ProductDto collection
     */
    public List<ProductDto> fillProducts(Collection<Product> products) {
        if (products == null) return null;
        List<ProductDto> productDtos = new ArrayList<>(products.size());

        for (Product product : products) {
            ProductDto productDto = getDtoByEntity(product);
            productDtos.add(productDto);
        }

        return productDtos;
    }

    /**
     * Fill default products DTO parameters
     *
     * @param products {@link Collection} Collection products
     * @return {@link List} ProductDto collection
     */
    public List<ProductDto> fillPureProducts(Collection<Product> products) {
        if (products == null) return null;
        List<ProductDto> productDtos = new ArrayList<>(products.size());

        for (Product product : products) {
            ProductDto productDto = new ProductDto();
            productDto.setProductId(product.getId());
            productDto.setCategoryId(product.getCategory().getCategoryId());
            productDto.setProductName(product.getProductName());
            productDto.setPrice(product.getPrice());
            productDto.setImageUrl(product.getManagedImageId());

            productDtos.add(productDto);
        }

        return productDtos;
    }

    /**
     * Determine DTO object by entity object
     * @param product {@link List} Product object
     * @return {@link ProductDto} product DTO
     */
    public ProductDto getDtoByEntity(Product product) {
        return new ProductDto(product.getId(),
                product.getCategory().getCategoryId(),
                product.getProductName(),
                product.getPrice(),
                product.getDescription(),
                product.getManagedImageId(),
                fillAttributes(product),
                fillColorAttributes(product),
                fillImages(product.getImages()),product.getProductStatus());

    }

    public CategoryProductDto getCategoryProductsDtoByEntity(Product product) {
        return new CategoryProductDto(product.getId(),
                product.getCategory().getCategoryId(),
                product.getProductName(),
                product.getPrice(),
                product.getDescription(),
                product.getManagedImageId(),
                fillCategoryProductAttributes(product),
                fillColorAttributes(product),
                fillImages(product.getImages()),product.getProductStatus());

    }
//
    /**
     * Determine collection DTO from entities collection
     * @param products {@link List} collection of Products
     * @return {@link List} product DTO collection
     */
    public List<ProductDto> getDtoByEntityCollection(List<Product> products) {
        List<ProductDto> productDtos = new ArrayList<>(products.size());
        for (Product categoryProduct : products) {
            ProductDto productDto = getDtoByEntity(categoryProduct);

            productDtos.add(productDto);
        }

        return productDtos;
    }

    public List<CategoryProductDto> getCategoryProductDtoByEntityCollection(List<Product> products) {
        List<CategoryProductDto> productDtos = new ArrayList<>(products.size());

        for (Product categoryProduct : products) {
            CategoryProductDto productDto = getCategoryProductsDtoByEntity(categoryProduct);

            productDtos.add(productDto);
        }

        return productDtos;
    }

    //  region Attributes, ColorAttributes, Images, etc.
    /**
     * Determine entity object from DTO
     * @param images {@link Collection} collection of images ids
     * @param product {@link Product}
     * @return {@link Set} set of ImageAttribute
     */
    public Set<ImageAttribute> getImageAttribute(Collection<String> images, Product product) {
        Set<ImageAttribute> imageAttributes = new HashSet<>();
        for (String s : images) {
            ImageAttribute image = new ImageAttribute(s);
            image.setProduct(product);
            imageAttributes.add(image);
        }

        return imageAttributes;
    }

    /**
     * Determine entity object from DTO
     * @param colors {@link Collection} ColorAttributeDto collection
     * @param product {@link Product} Product entity
     * @return {@link Set} set of ColorAttributes
     */
    public Set<ColorAttribute> getColorAttributes(Collection<ColorAttributeDto> colors, Product product) {
        Set<ColorAttribute> colorAttributes = new HashSet<>(product.getColors());
        for (ColorAttributeDto s : colors) {
            ////  Binyamin Regev 2016-03-31: Allow quantity = 0 in color of a new product
            //if (!(s.getInStock() > 0))
            //    s.setInStock(Integer.parseInt(environment.getProperty(Constants.ENV_PRODUCT_INSTOCK_DEFAULT_VALUE)));
            ////  Binyamin Regev 2016-03-31 - End
            Optional<ColorAttribute> attribute =
                    colorAttributes.stream().filter(x -> x.getName().equalsIgnoreCase(s.getName())).findFirst();
            if (attribute.isPresent() && attribute.get().getInStock() != s.getInStock()) {
                attribute.get().setInStock(s.getInStock());
            }
            s.setName(s.getName().toUpperCase());
            s.setCode(s.getCode().toUpperCase());
            ColorAttribute colorAttribute = new ColorAttribute(s.getName(), s.getCode(), s.getInStock());
            colorAttribute.setProduct(product);
            colorAttributes.add(colorAttribute);
        }

        return colorAttributes;
    }

    public ColorAttributeDto getColorAttributeByProductIdAndColorCode(Long productId, String hexColor) {
        ArgumentValidationHelper.validateArgumentIsNotNull(productId, "product id");
        ArgumentValidationHelper.validateStringArgumentIsNotNullAndNotBlank(hexColor, "color hex RGB value");

        List<ColorAttribute> colorAttributes = productRepository.getColorAttributeByProductIdAndColorCode(productId, hexColor);
        ColorAttributeDto colorAttributeDto = new ColorAttributeDto(colorAttributes.get(0).getCode(),
                colorAttributes.get(0).getName(), colorAttributes.get(0).getInStock());

        //for (ColorAttribute colorAttribute : colorAttributes) {
        //    ColorAttributeDto colorAttribDto = new ColorAttributeDto(colorAttribute.getCode(),
        //            colorAttribute.getName(), colorAttribute.getInStock());
        //    colorAttributesDto.add(colorAttribDto);
        //}

        return colorAttributeDto;
    }

    /**
     * Convert ProductAttributes collection to AttributeItem DTO
     *
     * @param attributes - ProductAttributes collection
     * @return AttributeItem DTO collection
     */
    public List<AttributeItem> productAttributesToAttributeValues(Collection<ProductAttributes> attributes) {
        List<AttributeItem> items = new ArrayList<>();
        for (ProductAttributes attribute : attributes) {
            String name = attribute.getAttribute().getName();
            String value = attribute.getAttributeValue();
            items.add(new AttributeItem(name, value));
        }

        return items;
    }

    /**
     * Build images IDs collection
     *
     * @param imageAttributes {@link Set} ImageAttribute collection
     * @return {@link List} images
     */
    private List<String> fillImages(Set<ImageAttribute> imageAttributes) {
        List<String> images = new ArrayList<>(imageAttributes.size());
        for (ImageAttribute image : imageAttributes) {
            images.add(image.getImageUrl());
        }

        return images;
    }

    /**
     * Build AttributeItem collection from Products attributes
     *
     * @param product {@link Product} Product object
     * @return {@link List} collection of attributes
     */
    private List<AttributeItem> fillAttributes(Product product) {
        Set<ProductAttributes> productAttributes = product.getProductAttributes();
        List<AttributeItem> items = new ArrayList<>(productAttributes.size());
        for (ProductAttributes attribute : productAttributes) {
            items.add(new AttributeItem(attribute.getAttribute().getName(), attribute.getAttributeValue()));
        }

        return items;
    }

    /**
     * Build AttributeItem collection from Products attributes
     *
     * @param product {@link Product} Product object
     * @return {@link List} collection of attributes
     */
    private List<CategoryProductAttributeItem> fillCategoryProductAttributes(Product product) {
        Set<ProductAttributes> productAttributes = product.getProductAttributes();
        List<CategoryProductAttributeItem> items = new ArrayList<>(productAttributes.size());
        for (ProductAttributes attribute : productAttributes) {
            CategoryAttributeFilter categoryAttributeFilter = categoryService.findCategoryAttributeFilter(product.getCategory().getCategoryId(), attribute.getAttribute().getId());

            items.add(new CategoryProductAttributeItem(attribute.getAttribute().getName(), attribute.getAttributeValue(), categoryAttributeFilter.isShowInFilter()));
        }

        return items;
    }

    /**
     * Build ColorAttributeDto collection from Products attributes
     * @param product {@link Product} Product object
     * @return {@link List} collection of ColorAttributesDto
     */
    private List<ColorAttributeDto> fillColorAttributes(Product product) {
        Set<ColorAttribute> colorAttributes = product.getColors();
        List<ColorAttributeDto> dtos = new ArrayList<>(colorAttributes.size());
        for (ColorAttribute colorAttribute : colorAttributes) {
            dtos.add(new ColorAttributeDto(colorAttribute.getCode(), colorAttribute.getName(),
                    colorAttribute.getInStock()));
        }

        return dtos;
    }

    /**
     * Determine Attribute entity by DTO
     * @param attribute {@link AttributeItem} DTO
     * @return {@link Attribute} Attribute entity
     */
    public Attribute getAttributeByDto(AttributeItem attribute) {
        return attributeRepository.get(attribute.getAttributeName());
    }
    //  endregion

    //  region Last Update
    public List<LastUpdate> getAllLastUpdates() {
        List<LastUpdate> listLastUpdates = productRepository.getAllLastUpdates();
        return listLastUpdates;
    }

    public LastUpdate getLastUpdate(Long lastUpdateId) {
        LastUpdate lastUpdate = productRepository.getLastUpdate(lastUpdateId);
        return lastUpdate;
    }

    public LastUpdate getLastUpdateByName(final String lastUpdateName) {
        LastUpdate lastUpdate = productRepository.getLastUpdateByName(lastUpdateName);
        return lastUpdate;
    }

    public LastUpdate createLastUpdate(String lastUpdateName, long lastUpdateTimestamp) {

        if (lastUpdateTimestamp <= 0) {
            lastUpdateTimestamp = new Date().getTime();
        }

        //  Already exists?
        LastUpdate lastUpdate = this.getLastUpdateByName(lastUpdateName);
        if (lastUpdate != null) {
            long id = lastUpdate.getLastUpdateId();

            lastUpdate.setLastUpdate(lastUpdateTimestamp);
            lastUpdate = updateLastUpdate(lastUpdate, id);
        } else {
            lastUpdate = productRepository.createLastUpdate(lastUpdateName, lastUpdateTimestamp);
        }

        return lastUpdate;
    }

    public LastUpdate updateLastUpdate(LastUpdate lastUpdateDto, long id) {

        LastUpdate lastUpdate = productRepository.updateLastUpdate(lastUpdateDto, id);

        return lastUpdate;
    }
    //  endregion

    //  region Most Popular Comments
    public MostPopularCommentsResponse getTop10MostPopularComments(HttpServletRequest req,
                                                                   HttpServletResponse res) {

        //  10-millisecond pause between each check
        //  TODO-Benny - Timeout should be 10sec. changed to 2s for Efi to implement Front-End
        final int MILLISECONDS_BETWEEN_CHECKS = 2;  //  Timeout should be 10s

        MostPopularCommentsResponse response = new MostPopularCommentsResponse();
        List<MostPopularCommentDto> userComments = new ArrayList<MostPopularCommentDto>();

        try {
            // Start the clock
            long start = System.currentTimeMillis();

            Future<MostPopularCommentDto> userComment = null;

            // Kick of multiple, asynchronous lookups
            for (int i = 0; i < PRODUCT_USER_COMMENTS_NUMBER; i++) {
                userComment = mostPopularCommentService.findUserComment(i);
                response.addUserComment(userComment.get());
            }

            // Wait until they are all done
            while (!userComment.isDone()) {
                Thread.sleep(MILLISECONDS_BETWEEN_CHECKS);
            }

            // Print results, including elapsed time
            System.out.println("Elapsed time: " + (System.currentTimeMillis() - start) + " milliseconds");

            response.setSuccess(true);
            response.setException(null);
            response.setReason("Completed Successfully, " + response.getUserComments().size() + " comments received");

            for (int i = 0; i < userComments.size(); i++) {
                System.out.println(userComments.get(i).getComment() + " - " + userComments.get(i).getScore());
            }

        } catch (ExecutionException | InterruptedException e ) {
            response.setSuccess(false);
            response.setException(e);
            response.setReason(response.getUserComments().size() + " comments received.\n" + e.getLocalizedMessage() );

            e.printStackTrace();
        }

        return response;
    }
    //  endregion

    //  region Database Restore Factory Settings
    @Transactional(rollbackFor = Exception.class)
    public CatalogResponse dbRestoreFactorySettings() {
        CatalogResponse response = productRepository.dbRestoreFactorySettings();

        System.out.println("Response: " + response.isSuccess() + ", " + response.getReason());

        return response;
    }
    //  endregion

}
