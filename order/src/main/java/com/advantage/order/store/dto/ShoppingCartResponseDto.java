package com.advantage.order.store.dto;

import com.advantage.order.store.model.ShoppingCart;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.ArrayList;
import java.util.List;

/**
 * Return {@code userId} and user {@link ShoppingCart} with {@code Product} details. <br/>
 * Contains inner classes {@link CartProduct} and {@link CartProduct.ProductColor}. <br/>
 * To add a product to user cart use: <br/>
 * {@link #addCartProduct(Long, String, double, int, String, String, String, int)} <br/>
 * <b>or</b> <br/>
 * {@link #addCartProduct(Long, String, double, int, String, String, String, int, boolean)}
 *
 * @author Binyamin Regev on 16/12/2015.
 */

@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class ShoppingCartResponseDto {

    /**
     * Public inner class for products in user cart.
     */
    public class CartProduct {

        /**
         * Public inner class for color attribute of product in user cart.
         */
        public class ProductColor {

            /*  inner class ProductColor - properties  */
            private String code;
            private String name;
            private int inStock;

            /*  inner class ProductColor - Constructors    */
            public ProductColor(String code, String name, int inStock) {
                this.code = code;
                this.name = name;
                this.inStock = inStock;
            }

            /*  inner class ProductColor - Getters and Setters */
            public String getCode() {
                return code;
            }

            public void setCode(String code) {
                this.code = code;
            }

            public String getName() {
                return name;
            }

            public void setName(String name) {
                this.name = name;
            }

            public int getInStock() {
                return inStock;
            }

            public void setInStock(int inStock) {
                this.inStock = inStock;
            }
        }

        /*  inner class CartProduct - properties  */
        private Long productId;
        private String productName;
        private double price;
        private int quantity;
        private String imageUrl;
        private ProductColor color;     //  Inner class of ShoppingCartResponseDto
        private boolean exists;

        /*  inner class CartProduct - Construtors  */
        public CartProduct(Long productId) { this.productId = productId; }

        public CartProduct(Long productId, String productName, double price, int quantity, String imageUrl) {
            this.productId = productId;
            this.productName = productName;
            this.price = price;
            this.quantity = quantity;
            this.imageUrl = imageUrl;
            this.exists = true;
        }

        public CartProduct(Long productId, String productName, double price, int quantity, String imageUrl, boolean exists) {
            this.productId = productId;
            this.productName = productName;
            this.price = price;
            this.quantity = quantity;
            this.imageUrl = imageUrl;
            this.exists = exists;
        }

        public CartProduct(Long productId, String productName, double price, int quantity, String imageUrl, ProductColor color) {
            this.productId = productId;
            this.productName = productName;
            this.price = price;
            this.quantity = quantity;
            this.imageUrl = imageUrl;
            this.color = color;
            this.exists = true;
        }

        public CartProduct(Long productId, String productName, double price, int quantity, String imageUrl, String colorCode, String colorName, int inStock) {
            this.productId = productId;
            this.productName = productName;
            this.price = price;
            this.quantity = quantity;
            this.imageUrl = imageUrl;
            this.color = new ProductColor(colorCode, colorName, inStock);
            this.exists = true;
        }

        public CartProduct(Long productId, String productName, double price, int quantity, String imageUrl, String colorCode, String colorName, int inStock, boolean exists) {
            this.productId = productId;
            this.productName = productName;
            this.price = price;
            this.quantity = quantity;
            this.imageUrl = imageUrl;
            this.color = new ProductColor(colorCode, colorName, inStock);
            this.exists = exists;
        }

        /*  inner class CartProduct - Getters and Setters  */
        public Long getProductId() {
            return this.productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return this.productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public double getPrice() {
            return this.price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        public int getQuantity() {
            return this.quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public String getImageUrl() {
            return this.imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public ProductColor getColor() {
            return this.color;
        }

        public void setColor(ProductColor color) {
            this.color = color;
        }

        public void setColor(String code, String name, int inStock) {
            this.color = new ProductColor(code, name, inStock);
        }

        public void createProductColor(String code, String name, int inStock) {
            this.setColor(new ProductColor(code, name, inStock));
        }

        public boolean isExists() {
            return this.exists;
        }

        public void setExists(boolean exists) {
            this.exists = exists;
        }
    }

    /*  public class ShoppingCartResponseDto - properties   */
    private long userId;
    private String message;
    private List<CartProduct> productsInCart = new ArrayList<>();
    private String exceptionText;

    /* public class ShoppingCartResponseDto - Constructors  */
    public ShoppingCartResponseDto() {  }

    public ShoppingCartResponseDto(long userId) {
        this.userId = userId;
    }

    public ShoppingCartResponseDto(long userId, List<CartProduct> productsInCart) {
        this.userId = userId;
        this.productsInCart = productsInCart;
    }

    public ShoppingCartResponseDto(long userId, List<CartProduct> productsInCart, String message) {
        this.userId = userId;
        this.productsInCart = productsInCart;
        this.message = message;
    }

    /*  public class ShoppingCartResponseDto - Getters and Setters  */
    public long getUserId() {
        return this.userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public CartProduct createCartProduct(Long productId, String productName, double price, int quantity, String imageUrl, boolean exists) {
        return new CartProduct(productId, productName, price, quantity, imageUrl, exists);

    }

    public List<CartProduct> getProductsInCart() {
        return this.productsInCart;
    }

    public void setProductsInCart(List<CartProduct> productsInCart) {
        this.productsInCart = productsInCart;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getExceptionText() {
        return exceptionText;
    }

    public void setExceptionText(String exceptionText) {
        this.exceptionText = exceptionText;
    }

    public boolean addCartProduct(Long productId, String productName, double pricePerItem, int quantity, String imageUrl, String colorHexCode, String colorName, int inStock) {
        CartProduct cartProduct = new CartProduct(productId, productName, pricePerItem, quantity, imageUrl, colorHexCode, colorName, inStock);
        return this.getProductsInCart().add(cartProduct);
    }

    public boolean addCartProduct(Long productId, String productName, double pricePerItem, int quantity, String imageUrl, String colorHexCode, String colorName, int inStock, boolean exists) {
        CartProduct cartProduct = new CartProduct(productId, productName, pricePerItem, quantity, imageUrl, colorHexCode, colorName, inStock, exists);
        return this.getProductsInCart().add(cartProduct);
    }
}
