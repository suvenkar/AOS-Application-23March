package com.advantage.order.store.services;

import com.advantage.common.Constants;
import com.advantage.common.Url_resources;
import com.advantage.common.dto.ColorAttributeDto;
import com.advantage.common.dto.DemoAppConfigParameter;
import com.advantage.common.dto.ProductDto;
import com.advantage.order.store.dao.ShoppingCartRepository;
import com.advantage.order.store.dto.ShoppingCartDto;
import com.advantage.order.store.dto.ShoppingCartResponse;
import com.advantage.order.store.dto.ShoppingCartResponseDto;
import com.advantage.order.store.model.ShoppingCart;
import com.advantage.root.util.ArgumentValidationHelper;
import com.advantage.root.util.RestApiHelper;
import com.advantage.root.util.ValidationHelper;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Calendar;
import java.util.List;

/**
 * @author Binyamin Regev on 03/12/2015.
 */
@Service
public class ShoppingCartService {

    private static final String CATALOG_PRODUCT = "products/";
    private static final String CATALOG_PRODUCT_COLOR_ATTRIBUTE = "%s/color/%s";
    private static final Logger logger = Logger.getLogger(ShoppingCartService.class);

    ShoppingCartResponse shoppingCartResponse;

    @Autowired
    @Qualifier("shoppingCartRepository")
    public ShoppingCartRepository shoppingCartRepository;

    /**
     *
     * @param userId
     * @return
     */
    public ShoppingCartResponseDto getShoppingCartsByUserId(long userId) {
        return getUserShoppingCart(userId);
    }

    /**
     *
     * @param userId
     * @param productId
     * @param stringColor
     * @param quantity
     * @return
     */
    @Transactional
    public ShoppingCartResponse addProductToCart(long userId, Long productId, String stringColor, int quantity) {

        int color = ShoppingCart.convertHexColorToInt(stringColor);

        //  Validate Arguments
        ArgumentValidationHelper.validateLongArgumentIsPositive(userId, "user id");
        ArgumentValidationHelper.validateArgumentIsNotNull(productId, "product id");
        ArgumentValidationHelper.validateNumberArgumentIsPositiveOrZero(color, "color decimal RGB value");
        ArgumentValidationHelper.validateNumberArgumentIsPositive(quantity, "quantity");

        shoppingCartResponse = new ShoppingCartResponse(false, "Initial values", 0);

        if (isProductExists(productId, ShoppingCart.convertIntColorToHex(color))) {

            ShoppingCart shoppingCart = shoppingCartRepository.find(userId, productId, color);

            //  Check if there is this ShoppingCart already exists
            int totalQuantity = 0;
            if (shoppingCart != null) {
                totalQuantity = shoppingCart.getQuantity() + quantity;
            } else {
                totalQuantity = quantity;
            }

            totalQuantity = validateProductInCartQuantityVsInStock(productId, color, totalQuantity);

            if (shoppingCart != null) {
                shoppingCartRepository.update(userId, productId, color, totalQuantity);
            } else {
                shoppingCartRepository.add(new ShoppingCart(userId, Calendar.getInstance().getTime().getTime(), productId, color, totalQuantity));
                shoppingCartResponse.setId(productId);
            }

        } else {
            //  Most unlikely, but need to cover this case as well
            shoppingCartResponse = new ShoppingCartResponse(false,
                    ShoppingCart.MESSAGE_PRODUCT_NOT_FOUND_IN_CATALOG,
                    productId);
        }

        return shoppingCartResponse;
    }

    /**
     *
     * @param productId
     * @param colorCode
     * @return
     */
    private ColorAttributeDto getColorAttributeByProductIdAndColorCode(Long productId, int colorCode) {
        ArgumentValidationHelper.validateLongArgumentIsPositive(productId.longValue(), "product id");
        ArgumentValidationHelper.validateNumberArgumentIsPositiveOrZero(colorCode, "color RGB hexadecimal value");

        String hexColor = ShoppingCart.convertIntColorToHex(colorCode).toUpperCase();

        //  Create a URL for Catalog service -> products
        URL productsPrefixUrl = null;
        try {
            productsPrefixUrl = new URL(Url_resources.getUrlCatalog(), CATALOG_PRODUCT);
        } catch (MalformedURLException e) {
            logger.error(productsPrefixUrl, e);
        }

        //  Create a URL with product-id and color RGB Hexadecimal value
        URL getColorAttributeByProdctIdAndColorCode = null;
        try {
            getColorAttributeByProdctIdAndColorCode = new URL(productsPrefixUrl, String.format(CATALOG_PRODUCT_COLOR_ATTRIBUTE, String.valueOf(productId), hexColor));
        } catch (MalformedURLException e) {
            logger.error(getColorAttributeByProdctIdAndColorCode, e);
        }

        if (logger.isInfoEnabled()) {
            logger.info("stringURL=\"" + getColorAttributeByProdctIdAndColorCode.toString() + "\"");
        }

        ColorAttributeDto dto = null;
        try {
            String stringResponse = RestApiHelper.httpGet(getColorAttributeByProdctIdAndColorCode, "order");
            if (!stringResponse.equalsIgnoreCase(Constants.NOT_FOUND)) {
                dto = getColorAttributeDtofromJsonObjectString(stringResponse);
            } else {
                //  Product not found (409)
                dto = new ColorAttributeDto(hexColor, Constants.NOT_FOUND, -1);
            }
        } catch (IOException e) {
            logger.error("Calling httpGet(" + getColorAttributeByProdctIdAndColorCode.toString() + ") throws IOException: ", e);
        }

        return dto;
    }

    /*
        productId   color       Quantity
        1           YELLOW      5
        1           BLUE        4

        Action: { productId=1, color=BLUE, newColor=YELLOW, Quantity=1 }
     */
    public ShoppingCartResponse updateProductInCart(long userId, Long productId, String hexColor, String hexColorNew, int quantity) {

        if (((!ValidationHelper.isValidColorHexNumber(hexColor)) ||
                (!ValidationHelper.isValidColorHexNumber(hexColorNew)) ||
                (hexColor.equalsIgnoreCase(hexColorNew))) && (quantity < 0)) {
            return new ShoppingCartResponse(false,
                    "Error: Bad request, Nothing to do",
                    productId);
        }

        shoppingCartResponse = new ShoppingCartResponse(false, "shoppingCartResponse", -1);

        //  Get parameter "Error_500_in_update_cart" value from DemoAppConfig.xml
        String parameterValue = RestApiHelper.getDemoAppConfigParameterValue("Error_500_in_update_cart");

//        LOGGER.info("Updating product " + productId + " in cart.");
//        LOGGER.info("Updating product details with color: " + ((hexColorNew.equals("-1"))? ColorPalletEnum.getColorByCode(hexColor).toString().toLowerCase() : ColorPalletEnum.getColorByCode(hexColorNew).toString().toLowerCase()) + " and quantity: " + quantity + ".");
//        LOGGER.info("Verifying that updated product is available at vendor shop.");
//        if (parameterValue.equalsIgnoreCase("No")) {
        if ((parameterValue == null) || (parameterValue.equalsIgnoreCase("No"))) {

            int color = ShoppingCart.convertHexColorToInt(hexColor);

            /*  Update COLOR CHANGE of product in user cart */
            if ((ValidationHelper.isValidColorHexNumber(hexColor)) &&
                    (ValidationHelper.isValidColorHexNumber(hexColorNew)) &&
                    (!hexColor.equalsIgnoreCase(hexColorNew))) {
                /*  *****************************************
                    Color has changed for the product in cart
                    *****************************************   */

                /*  Find a product with productId and new color in the user's cart  */
                int totalQuantity = 0;
                int newColor = ShoppingCart.convertHexColorToInt(hexColorNew);
                ShoppingCart shoppingCart = shoppingCartRepository.find(userId, productId, newColor);

                if (shoppingCart != null) {
                    /*
                        There's already a product with the new color:
                        1. Delete product with previous color, it's quantity is the parameter to the method.
                        2. Add quantity of product with previous color to product with new color.
                     */
                    int result = shoppingCartRepository.removeProductFromUserCart(userId, productId, color);
                    shoppingCartResponse = shoppingCartRepository.getShoppingCartResponse();
                    if (shoppingCartResponse.isSuccess()) {
                        totalQuantity = shoppingCart.getQuantity();
                    } else {
                        shoppingCartResponse.setReason("Error: failed to change product's color");
                    }

                    //  Add updated quantity to total
                    totalQuantity += quantity;

                    totalQuantity = validateProductInCartQuantityVsInStock(productId, newColor, totalQuantity);
                    shoppingCartRepository.update(userId, productId, newColor, totalQuantity);

                } else {
                    /*
                        product with productId and hexColorNew doesn't exists in the cart yet:
                        Add a new product with the new color to user cart
                     */
                    quantity = validateProductInCartQuantityVsInStock(productId, newColor, quantity);
                    shoppingCartRepository.removeProductFromUserCart(userId, productId, color);
                    shoppingCartRepository.add(new ShoppingCart(userId, productId, newColor, quantity));
                }
            } else {
                /*  Update QUANTITY of product in user cart - No change in product's color  */
                if (quantity > 0) {

                    quantity = validateProductInCartQuantityVsInStock(productId, color, quantity);

                    /* Update product quantity in cart  */
                    System.out.println("ShoppingCartService.update(" + userId + ", " + productId + ", " + color + ", " + quantity + ")");
                    //shoppingCartResponse = shoppingCartRepository.update(userId, productId, color, quantity);
                    shoppingCartRepository.update(userId, productId, color, quantity);

                } else {
                    //  Nothing to update - Bad Request
                    shoppingCartResponse.setSuccess(false);
                    shoppingCartResponse.setReason("Error: Bad request. Product's color was not changed");
                    shoppingCartResponse.setId(productId);
                }
            }

        } else if (parameterValue.equalsIgnoreCase("Yes")) {
			//  Simulate error 500
            logger.error("A problem occurred while updating cart.");
            throw new RuntimeException("A problem occurred while updating cart.");
        }

        return shoppingCartResponse;
    }

    /**
     *
     * @param userId
     * @param shoppingCarts
     * @return
     */
    public ShoppingCartResponse replaceUserCart(long userId, List<ShoppingCartDto> shoppingCarts) {
        ShoppingCartResponse shoppingCartResponse = new ShoppingCartResponse(true, "", 0);

        for (ShoppingCartDto shoppingCartDto : shoppingCarts) {
            int color = ShoppingCart.convertHexColorToInt(shoppingCartDto.getHexColor());
            ColorAttributeDto dto = getColorAttributeByProductIdAndColorCode(shoppingCartDto.getProductId().longValue(), color);

            int quantity = validateProductInCartQuantityVsInStock(shoppingCartDto.getProductId(), color, shoppingCartDto.getQuantity());
            if (quantity != shoppingCartDto.getQuantity()){
                shoppingCartResponse.setSuccess(true);  //  Has to be TRUE for OrderController
                shoppingCartDto.setQuantity(quantity);

                if (shoppingCartResponse.getReason().isEmpty()) {
                    shoppingCartResponse.setReason(ShoppingCart.MESSAGE_WE_UPDATED_YOUR_CART_BASED_ON_THE_ITEMS_IN_STOCK);
                }
            }
        }

        ShoppingCartResponse response = shoppingCartRepository.replace(userId, shoppingCarts);

        //  Database update successful?
        if (!response.isSuccess()) { shoppingCartResponse = response; }

        return shoppingCartResponse;
    }

    /**
     *
     * @param userId
     * @param productId
     * @param stringColor
     * @return
     */
    @Transactional
    public ShoppingCartResponse removeProductFromUserCart(long userId, Long productId, String stringColor) {
        int color = ShoppingCart.convertHexColorToInt(stringColor);
        int result = shoppingCartRepository.removeProductFromUserCart(userId, productId, color);
        return shoppingCartRepository.getShoppingCartResponse();
    }

    /**
     *
     * @param userId
     * @return
     */
    @Transactional
    public ShoppingCartResponse clearUserCart(long userId) {
        return shoppingCartRepository.clearUserCart(userId);
    }

    /**
     * Verify the quantity of each product in user cart exists in stock. If quantity
     * in user cart is greater than the quantity in stock than add the product with
     * the quantity in stock to {@link ShoppingCartResponseDto} {@code Response} JSON. <br/>
     *
     * @param userId               Unique user identity.
     * @param shoppingCartProducts {@link List} of {@link ShoppingCartDto} products in user cart to verify quantities.
     * @return {@code null} when all quantities of the products in the user cart <b>are equal or Less than</b> the quantities in
     * stock. If the quantity of any cart product <b>is greater than</b> the quantity in stock then the product will be added to
     * the list of products in the cart with the <ul>quantity in stock</ul>.
     */
    @Transactional
    public ShoppingCartResponseDto verifyProductsQuantitiesInUserCart(long userId, List<ShoppingCartDto> shoppingCartProducts) {
        logger.info("ShoppingCartService -> verifyProductsQuantitiesInUserCart(): userId=" + userId);

        ShoppingCartResponseDto responseDto = new ShoppingCartResponseDto(userId);

        for (ShoppingCartDto cartProduct : shoppingCartProducts) {

            ShoppingCartResponseDto.CartProduct cartProductDto = getCartProductDetails(cartProduct.getProductId(), cartProduct.getHexColor(), cartProduct.getQuantity());

            if (cartProduct.getQuantity() > cartProductDto.getColor().getInStock()) {

                ShoppingCart shoppingCart = shoppingCartRepository.find(userId,
                        cartProduct.getProductId(),
                        ShoppingCart.convertHexColorToInt(cartProductDto.getColor().getCode()));

                if (shoppingCart != null) {
                    //  Update quantity of cart product to product's quantity in stock
                    shoppingCartRepository.update(userId,
                            cartProduct.getProductId(),
                            ShoppingCart.convertHexColorToInt(cartProductDto.getColor().getCode()),
                            cartProductDto.getColor().getInStock());
                } else {
                    //  Unlikely to occur, since we already got the product details and compare its
                    //  quantity in stock to the same product in cart. But, still need to be covered.
                    logger.warn("Product \"" + cartProductDto.getProductName() + "\" exists in table and in user " + userId + " cart, but cannot be found using primary-key.");
                }

                responseDto.addCartProduct(cartProductDto.getProductId(),
                        cartProductDto.getProductName(),
                        cartProductDto.getPrice(),
                        cartProductDto.getColor().getInStock(),
                        cartProductDto.getImageUrl(),
                        cartProductDto.getColor().getCode(),
                        cartProductDto.getColor().getName(),
                        cartProductDto.getColor().getInStock());
            }
        }

        //return shoppingCartRepository.verifyProductsQuantitiesInUserCart(userId, shoppingCartProducts);
        return responseDto;

    }

    /**
     *
     * @param productId
     * @return
     */
    public ProductDto getProductDtoDetails(Long productId) {
        URL productsPrefixUrl = null;
        URL productByIdUrl = null;
        try {
            productsPrefixUrl = new URL(Url_resources.getUrlCatalog(), CATALOG_PRODUCT);
            logger.debug("Url_resources.getUrlCatalog()=" + Url_resources.getUrlCatalog().toString());
            logger.debug("productsPrefixUrl=" + productsPrefixUrl.toString());
        } catch (MalformedURLException e) {
            logger.error(productsPrefixUrl, e);
        }

        try {
            productByIdUrl = new URL(productsPrefixUrl, String.valueOf(productId));
            logger.debug("productByIdUrl=" + productByIdUrl.toString());
            logger.debug("productByIdUrl=" + productByIdUrl.toString());
        } catch (MalformedURLException e) {
            logger.error(productByIdUrl, e);
        }

        ProductDto dto = null;
        String stringResponse = null;
        try {
            stringResponse = RestApiHelper.httpGet(productByIdUrl, "order");
            logger.debug("ProductDto productDetails.getProductName().equalsIgnoreCase(Constants.NOT_FOUND)");
            if (stringResponse.equalsIgnoreCase(Constants.NOT_FOUND)) {
                //  Product not found (409)
                dto = new ProductDto(productId, -1L, Constants.NOT_FOUND, -999999.99, Constants.NOT_FOUND, Constants.NOT_FOUND, null, null, null);
            } else {
                dto = getProductDtofromJsonObjectString(stringResponse);
            }
        } catch (IOException e) {
            logger.debug("stringResponse = " + stringResponse);
            logger.debug("dto = " + dto);
            logger.error("Calling httpGet(" + productByIdUrl.toString() + ") throws IOException: ", e);
        }

        return dto;
    }

    /**
     *
     * @param userId
     * @return
     */
    public ShoppingCartResponseDto getUserShoppingCart(long userId) {
        List<ShoppingCart> shoppingCarts = shoppingCartRepository.getShoppingCartProductsByUserId(userId);

        ShoppingCartResponseDto shoppingCartResponse = new ShoppingCartResponseDto(userId);
        if ((shoppingCarts != null) && (shoppingCarts.size() > 0)) {
            shoppingCartResponse = getCartProductsDetails(userId, shoppingCarts);
        }

        return shoppingCartResponse;
    }

    /**
     *
     * @param userId
     * @param shoppingCarts
     * @return
     */
    public ShoppingCartResponseDto getCartProductsDetails(long userId, List<ShoppingCart> shoppingCarts) {
        /*
        //  Verify userId belongs to a registered user by calling "Account Service"
        //  REST API GET REQUEST using URI
        if (!isRegisteredUserExists(userId)) {
            shoppingCartResponse = new ShoppingCartResponse(false, ShoppingCart.MESSAGE_INVALID_USER_ID, -1);
            return null; //  userId is not a registered user
        }
         */
        ShoppingCartResponseDto userCart = new ShoppingCartResponseDto(userId);

        if (shoppingCarts != null) {
            if ((shoppingCarts.size() > 0) || (!shoppingCarts.isEmpty())) {

                /* Scan user shopping cart and add all product to userCart response object  */
                //for (ShoppingCart cart : shoppingCarts) {
                for (ShoppingCart cart : shoppingCarts) {

                    //ProductDto dto = getCartProductDetails(cart.getProductId(),
                    //                                        ShoppingCart.convertIntColorToHex(cart.getColor()));
                    ShoppingCartResponseDto.CartProduct cartProduct = getCartProductDetails(cart.getProductId(),
                            ShoppingCart.convertIntColorToHex(cart.getColor()).toUpperCase(),
                            cart.getQuantity());

                    if (cartProduct != null) {
                        if (!cartProduct.getProductName().equalsIgnoreCase(Constants.NOT_FOUND)) {
                            /*  Add a product to user shopping cart response class  */
                            userCart.addCartProduct(cartProduct.getProductId(),
                                    cartProduct.getProductName(),
                                    cartProduct.getPrice(),
                                    cart.getQuantity(),
                                    cartProduct.getImageUrl(),
                                    cartProduct.getColor().getCode(),
                                    cartProduct.getColor().getName(),
                                    cartProduct.getColor().getInStock());
                        } else {
//                          /*  Product in cart not found in catalog database schema    */
//                          userCart.addCartProduct(cartProduct.getProductId(),
//                                  cartProduct.getProductName(),   //  "NOT FOUND"
//                                  cartProduct.getPrice(),         //  -999999.99
//                                  cartProduct.getQuantity(),      //  0
//                                  cartProduct.getImageUrl(),      //  "NOT FOUND"
//                                  "000000",
//                                  "BLACK",
//                                  0,
//                                  false); //  isExists = false
                        }
                    }
                }
            }
            //else {
            //    //ShoppingCart.MESSAGE_SHOPPING_CART_IS_EMPTY
            //    userCart.setProductsInCart(new ArrayList<>());
            //}
        }
        //else {
        //    //ShoppingCart.MESSAGE_SHOPPING_CART_IS_EMPTY
        //    userCart.setProductsInCart(new ArrayList<>());
        //}

        //return ((userCart == null) || (userCart.isEmpty())) ? null : userCart;
        return userCart;
    }


    /**
     * Get details of a single {@code Product} from catalog database schema using <b>REST API</b> <i><b>GET</b></i> request.
     * The method also validates the <i>quantity</i> of the product and color, by comaring it with the value of
     * the product color <i>In Stock</i> property value. <br/>
     * The returned cart product (of class {@link ShoppingCartResponseDto.CartProduct}) hold the correct
     * quantity for purchase.
     * @param productId Idetity of the product to get details.
     * @return {@link ProductDto} containing the JSON with requsted product details.
     */
    public ShoppingCartResponseDto.CartProduct getCartProductDetails(Long productId, String hexColor, int quantity) {

        ProductDto dto = this.getProductDtoDetails(productId);

        ShoppingCartResponseDto.CartProduct cartProduct;

        if (dto != null) {
            if (dto.getProductName() != null) {
                if (!dto.getProductName().equalsIgnoreCase(Constants.NOT_FOUND)) {

                    ColorAttributeDto colorAttrib = getProductColorAttribute(hexColor.toUpperCase(), dto.getColors());

                    if (colorAttrib != null) {
                        cartProduct = new ShoppingCartResponseDto()
                                .createCartProduct(dto.getProductId(),
                                        dto.getProductName(),
                                        dto.getPrice(),
                                        0,
                                        dto.getImageUrl(),
                                        true);

                        if (quantity > colorAttrib.getInStock()) {
                            quantity = colorAttrib.getInStock();
                        }

                        cartProduct.setColor(colorAttrib.getCode().toUpperCase(),
                                colorAttrib.getName().toUpperCase(),
                                quantity);

                        if (logger.isDebugEnabled()) {
                            StringBuilder sb = new StringBuilder("Received Product information: ");
                            sb.append("\n   product id = ").append(dto.getProductId());
                            sb.append("\n   product name = ").append(dto.getProductName());
                            sb.append("\n   price per item = ").append(dto.getPrice());
                            sb.append("\n   managedImageId = \"").append(dto.getImageUrl()).append("\"");
                            sb.append("\n   ColorAttrubute.Code (hex) = \'").append(colorAttrib.getCode().toUpperCase()).append("\'");
                            sb.append("\n   ColorAttrubute.Color (name) = \"").append(colorAttrib.getName().toUpperCase()).append("\"");
                            sb.append("\n   ColorAttrubute.inStock = ").append(colorAttrib.getInStock());
                            logger.debug(sb);
                        }
                    } else {
                        //  Product with specific color NOT FOUND in Product table in CATALOG schema
                        cartProduct = setNotFoundCartProduct(productId);
                    }
                } else {
                    //  Product with this productId not found in Product table in CATALOG schema (409)
                    cartProduct = setNotFoundCartProduct(productId);
                }
            } else {
                //  dto.getProductName() == null
                cartProduct = null;
            }
        } else {
            // (dto == null)
            if (logger.isDebugEnabled()) {
                StringBuilder sb = new StringBuilder("ShoppingCartResponseDto.CartProduct is NULL.");
                logger.debug(sb);
            }

            cartProduct = null;
        }

        return cartProduct;
    }

    /**
     *
     * @param hexColor
     * @param colors
     * @return
     */
    public ColorAttributeDto getProductColorAttribute(String hexColor, List<ColorAttributeDto> colors) {
        ColorAttributeDto returnColor = null;

        if ((colors != null) && (colors.size() > 0)) {
            for (ColorAttributeDto color : colors) {
                //  Better to compare integers than Strings - no problem with leading zeros
                /*if (color.getCode().equalsIgnoreCase(hexColor)) {*/
                if (ShoppingCart.convertHexColorToInt(color.getCode()) == ShoppingCart.convertHexColorToInt(hexColor)) {
                    returnColor = color;
                }
            }
        } else {
            logger.warn("Colors list is empty");
        }

        return returnColor;
    }

    /**
     *
     * @param jsonObjectString
     * @return
     * @throws IOException
     */
    private static ProductDto getProductDtofromJsonObjectString(String jsonObjectString) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper().setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        ProductDto dto = objectMapper.readValue(jsonObjectString, ProductDto.class);
        return dto;
    }

    /**
     *
     * @param jsonObjectString
     * @return
     * @throws IOException
     */
    private static ColorAttributeDto getColorAttributeDtofromJsonObjectString(String jsonObjectString) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper().setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        ColorAttributeDto dto = objectMapper.readValue(jsonObjectString, ColorAttributeDto.class);
        return dto;
    }

    /**
     *
     * @param productId
     * @param color
     * @param quantity
     * @return
     */
    private int validateProductInCartQuantityVsInStock(Long productId, int color, int quantity) {

        shoppingCartResponse = new ShoppingCartResponse(false, "shoppingCartResponse", -1);
        ColorAttributeDto dto = getColorAttributeByProductIdAndColorCode(productId, color);

        if (dto != null) {
            if (quantity > dto.getInStock()) {
                quantity = dto.getInStock();
                shoppingCartResponse.setReason(String.format(ShoppingCart.MESSAGE_OOPS_WE_ONLY_HAVE_X_IN_STOCK, String.valueOf(dto.getInStock())));
                shoppingCartResponse.setSuccess(false);
            } else {
                shoppingCartResponse.setReason("");
                shoppingCartResponse.setSuccess(true);
            }

            shoppingCartResponse.setId(productId);

        } else {
            shoppingCartResponse.setSuccess(false); //  product not found in catalog
            shoppingCartResponse.setId(productId);

            shoppingCartResponse.setReason("Error: Product with id=" + productId + " and color-code=\"" + ShoppingCart.convertIntColorToHex(color) + "\" (" + color + ") was not found in catalog");
        }

        return quantity;
    }

    /**
     *
     * @param productId
     * @return
     */
    public ShoppingCartResponseDto.CartProduct setNotFoundCartProduct(Long productId) {
        return new ShoppingCartResponseDto().createCartProduct(productId, Constants.NOT_FOUND, -999999.99, 0, Constants.NOT_FOUND, false);
    }

    /**
     *
     * @param productId
     * @param hexColor
     * @return
     */
    public boolean isProductExists(Long productId, String hexColor) {
        boolean result = false;

        ProductDto productDetails = getProductDtoDetails(productId);
        if (productDetails != null) {
            if (! productDetails.getProductName().isEmpty()) {
                if (!productDetails.getProductName().equalsIgnoreCase(Constants.NOT_FOUND)) {
                    List<ColorAttributeDto> colors = productDetails.getColors();
                    for (ColorAttributeDto color : colors) {
                        //  Better to compare integers than Strings - no problem with leading zeros
                        if (ShoppingCart.convertHexColorToInt(color.getCode()) == ShoppingCart.convertHexColorToInt(hexColor)) {
                            result = true;
                        }
                    }
                } else {
                    logger.debug("ProductDto productDetails.getProductName().equalsIgnoreCase(Constants.NOT_FOUND)");
                }
            } else {
                logger.error("ProductDto productDetails.getProductName() is empty");
            }
        } else {
            logger.error("ProductDto productDetails is NULL");
        }
        return result;
    }

    /**
     *
     * @return
     */
    @Override
    public String toString() {
        return "ShoppingCartService{" +
                "shoppingCartRepository=" + shoppingCartRepository +
                '}';
    }
}

