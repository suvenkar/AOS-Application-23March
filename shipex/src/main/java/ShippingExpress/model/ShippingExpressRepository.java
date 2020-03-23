package ShippingExpress.model;

public interface ShippingExpressRepository {
    /**
     * Determines shipping cost to country by ISO name of country
     * @param countryIsoName {@link String} ISO name of country
     * @return {@link Double} shipping cost
     */
    double getShippingCostByCountry(String countryIsoName);

    /**
     * Determines shipping cost for all countries that does not exist in the config
     * @return {@link Double} shipping cost
     */
    double getDefaultShippingCost();

    /**
     * Determines number of ordered items for free shipping
     * @return {@link Integer}
     */
    int getFreeShippingOption();

    /**
     * Determines currency name
     * @return {@link String} 3 chars Currency
     */
    String getCurrency();

}
