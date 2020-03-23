package com.advantage.mastercredit.util;


import com.voltage.payments.host.*;
import org.apache.log4j.Logger;
/**
 * Created by hechuang on 10/19/2017.
 */
public class DecryptionHelper {
    private static final String CONFIG_PIE_DISTRICT  = "modeloffice.org";
    private static final String CONFIG_HOST_DISTRICT = "modeloffice.org";
    private static final String CONFIG_AUTH_METHOD   =
            HostContext.AUTH_METHOD_SHARED_SECRET;
    private static final String CONFIG_AUTH_INFO     = "voltage123";
    private static final String CONFIG_MERCHANT_ID   = "AOS";
    private static final String CONFIG_DECRYPT_TIME  = null;
    private Logger logger = Logger.getLogger(DecryptionHelper.class);

    // Plaintext sample data: A PAN, a CVV, and a string.


    // PIE-protected sample data: different types of PAN and CVV, string, and integrity.
    //private static final String ciphertextSampleExternalPAN       = "4886121651919012";
    //private static final String ciphertextSampleExternalCVV       = "174";
    //private static final String ciphertextSampleExternalIntegrity = "8dd2614398f2fcea";

    // Key identifiers and phase bits to accompany the sample PIE-protected data.
    // keyId1 corresponds to embedded card data and the no tweak string encryption.
    // keyId2 corresponds to the external card data and the tweaked string encryption.
    //private static final long keyId    = 365887685;
    //private static final long phaseBit = 0;

    // The encryption types demonstrated here.
    private static final String pieCardDataEncryptionTypes[] = {
            "External PAN/CVV without Integrity value",
            "External PAN/CVV with partial Integrity value" };

    // Count of card data in the sample, and their encryption types.
    private static final int CARD_DATA_COUNT = pieCardDataEncryptionTypes.length;

    public String getOutPlainPAN() {
        return outPlainPAN;
    }

    public void setOutPlainPAN(String outPlainPAN) {
        this.outPlainPAN = outPlainPAN;
    }

    public String getOutPlainCVV() {
        return outPlainCVV;
    }

    public void setOutPlainCVV(String outPlainCVV) {
        this.outPlainCVV = outPlainCVV;
    }

    //
    private String outPlainPAN,outPlainCVV;

    public DecryptionHelper()
    {

    }

    public void DecryptExternalWithIntegrity(String ciphertextSampleExternalPAN,String ciphertextSampleExternalCVV,long keyId2,long phaseBit,String  ciphertextSampleExternalIntegrity)
    {
        System.out.println("====================================================");
        System.out.println("Host SDK Java Sample Program for PIE-Protected Data");
        System.out.println("  - Decrypts PIE-protected PANs and CVVs,");
        System.out.println("    in several encryption formats.");
        System.out.println("====================================================");

        // Return value and error count tracking variables.
        int     perItemStatus   = 0;
        int     dataMismatch    = 0;
        boolean exceptionThrown = false;

        try {

            // Load the DLL containing the native C code.
            System.loadLibrary("vphostjava");

            // Get and print the Host SDK version information.
            HostVersionInfo versionInfo = HostContext.getVersionInfo();
            short  currCryptoProtocolVersion = versionInfo.getCryptoProtocolVersion();
            long   hostVersionNumber         = versionInfo.getHostVersionNumber();
            String hostVersionString         = versionInfo.getHostVersionString();

            /*******************
            System.out.println();
            System.out.println("Result of call to retrieve Host SDK version:");
            System.out.println();
            System.out.println("  Crypto Protocol Version: " +
                    currCryptoProtocolVersion);
            System.out.println("  Host SDK Version Number: " +
                    String.format("0x%6s",
                            Long.toHexString(
                                    hostVersionNumber)).replace(' ', '0'));
            System.out.println("  Host SDK Version String: " + hostVersionString);
            System.out.println();

            System.out.println("Constructing the HostContext...");
            System.out.println();
             ***************/

            // Create the HostContext using memory storage.1
            HostContext hostContext =
                    new HostContext(
                            HostContext.FLAGS_MEMORY_STORAGE,       // use memory storage
                            CONFIG_PIE_DISTRICT,                     // POS district name
                            "https://voltage-pp-0000." +
                                    CONFIG_HOST_DISTRICT +                // host district name
                                    "/policy/clientPolicy.xml",
                            null,               // no directory when using memory storage
                            null,               // no storage password for memory storage
                            // the next param, trustStore, is ignored on Windows
                            //null);
                            "/opt/HPE-SecureData-Payments-Host-SDK-Linux-64bit-4.2.0-r218900/trust-store");

            // PIE PAN/CVV data decryption code starts here.

            // Dev Guide Code Snippet: PIE2PLAIN_PREP_INPUT_ARRAY; LC:39
            // Establish three sets of PIE-protected card data.
            HostPIECardData[] pieProtectedCardDataArray =
                    new HostPIECardData[CARD_DATA_COUNT];

            // Input card data setup for external PIE without integrity checking.
            pieProtectedCardDataArray[0] =
                    new HostPIECardData(HostPIECardData.FLAGS_PIE_TYPE_EXTERNAL,
                            ciphertextSampleExternalPAN,
                            ciphertextSampleExternalCVV,
                            keyId2,
                            phaseBit);

            // Input card data setup for external PIE with integrity checking.
            pieProtectedCardDataArray[1] =
                    new HostPIECardData(
                            HostPIECardData.FLAGS_PIE_TYPE_EXTERNAL_WITH_INTEGRITY,
                            ciphertextSampleExternalPAN,
                            ciphertextSampleExternalCVV,
                            keyId2,
                            phaseBit,
                            ciphertextSampleExternalIntegrity);

            /*****
            System.out.println("Calling method translatePIECardData(" +
                    "PIE->plaintext)...");
            *****/

            // Dev Guide Code Snippet: PIE2PLAIN_TRANSLATE; LC:13
            // Decrypt PIE-protected ciphertext card data.
            HostPIETranslateResult[] plaintextCardDataResultArray =
                    hostContext.translatePIECardData(
                            1,                                      // PIE version - always 1
                            CONFIG_MERCHANT_ID,      // merchant identifier for key retrieval
                            CONFIG_AUTH_METHOD,                      // authentication method
                            CONFIG_AUTH_INFO,             // auth info - e.g. a shared secret
                            CONFIG_DECRYPT_TIME,            // decrypt time for key retrieval
                            HostEncryptionSettings.SETTINGS_UNENCRYPTED,  // output plaintext
                            null,                         // no output identity for plaintext
                            null,                       // no output tweak data for plaintext
                            0,                              // CVV encryption type - always 0
                            pieProtectedCardDataArray);     // sample PIE-encrypted card data

            // Print the results of the translation call.
            System.out.println();
            System.out.println("[PROTECT] Translation results:");
            System.out.println();
            System.out.println("  From: PIE-encrypted data (PAN and CVV)");
            System.out.println("  To:   Recovered plaintext (PAN and CVV)");
            System.out.println();

            for( int i = 0; i < plaintextCardDataResultArray.length; i++ ) {

                // Print the type of encryption for this data.
                System.out.println("    Sample data is: " +
                        pieCardDataEncryptionTypes[i]);
                System.out.println();

                // Dev Guide Code Snippet: PIE2PLAIN_PER_ITEM_STATUS_1; LC:7
                // Check the per-item status for the decrypted array.
                if (plaintextCardDataResultArray[i].getStatus() != 0) {
                    System.out.println("      Found a per-item error code: " +
                            plaintextCardDataResultArray[i].getStatus());
                    System.out.println();
                    perItemStatus++;
                }
                else {

                    // Convert returned byte array to a String for output.
                    String tempPiePAN = new String(pieProtectedCardDataArray[i]
                            .getPAN());

                    // Print sample PAN values and recovered plaintext.

                    System.out.println("     PIE-encrypted PAN: " + tempPiePAN);
                    // Dev Guide Code Snippet: PIE2PLAIN_GET_INTEGRITY; LC:8
                    if( (pieProtectedCardDataArray[i].getDataType() &
                            HostPIECardData.FLAGS_PIE_TYPE_INTEGRITY_BIT) != 0 ) {
                        // Convert returned byte array to a String for output.
                        String tempIntegrity =
                                new String(pieProtectedCardDataArray[i].getIntegrity());
                        System.out.println("       Integrity value: " +
                                tempIntegrity);
                    }

                    // Dev Guide Code Snippet: PIE2PLAIN_GET_CARD_DATA_RESULTS; LC:4
                    // Convert returned byte array to a String for output.
                    String tempRecovPAN =
                            new String(plaintextCardDataResultArray[i].getPAN());
                    System.out.println("         Recovered PAN: " + tempRecovPAN);
                    this.setOutPlainPAN(tempRecovPAN);


                    // Dev Guide Code Snippet: PIE2PLAIN_GET_CVV_DATA; LC:5
                    // Convert returned byte arrays to Strings for output.
                    String tempPieCVV =
                            new String(pieProtectedCardDataArray[i].getCVV());
                    String tempRecovCVV =
                            new String(plaintextCardDataResultArray[i].getCVV());


                    System.out.println("     PIE-encrypted CVV: " + tempPieCVV);
                    System.out.println("         Recovered CVV: " + tempRecovCVV);
                    this.setOutPlainCVV(tempRecovCVV);

                }
            }

            /**********
             System.out.println("Deleting the array elements...");
            System.out.println();
             **********/

            // Dev Guide Code Snippet: PIE2PLAIN_ARRAY_DELETE; LC:7
            // Delete the card data array elements.
            for (int i = 0; i < pieProtectedCardDataArray.length; i++) {
                pieProtectedCardDataArray[i].delete();
            }
            for (int i = 0; i < plaintextCardDataResultArray.length; i++) {
                plaintextCardDataResultArray[i].delete();
            }

            // Dev Guide Code Snippet: PIE2PLAIN_STR_ARRAY_DELETE; LC:7

            /**********
            System.out.println("Deleting the versionInfo object...");
            System.out.println();
            **********/

            // Delete the versioInfo instance.
            versionInfo.delete();

            /**********
            System.out.println("Deleting the HostContext...");
            System.out.println();
            **********/

            // Always delete the HostContext explicitly.
            hostContext.delete();
        }

        // Catch exceptions related to the Host SDK.
        catch ( HostException e ) {

            System.out.println();
            System.out.println("Host SDK exception thrown...");

            // Print the error code.
            System.out.println();
            System.out.println("Method getErrorCode returned: " + e.getErrorCode());

            // Print the full message.
            System.out.println();
            System.out.println("Method getMessage returned:");
            System.out.println(e.getMessage());

            // Print the toolkit error stack.
            System.out.println();
            System.out.println("Method getToolkitErrorMessage returned:");
            System.out.println(e.getToolkitErrorMessage());
            exceptionThrown = true;
        }

        // If no error status, per-item errors, or data mismatches, the sample worked.
        if ( (exceptionThrown == false) &&
                (perItemStatus == 0) &&
                (dataMismatch == 0) ) {
            System.out.println("Sample completed successfully.");
        }

        // If an exception was thrown, print output that says so.
        else if ( exceptionThrown == true ) {
            System.out.println();
            System.out.println("Sample failed unexpectedly due to thrown exception.");
        }

        // Report the count of any per-item error status values, if any.
        if ( perItemStatus != 0 ) {
            System.out.println();
            System.out.println("Error: " +  perItemStatus + " per-item status "
                    + "values were not zero.");
        }



    }

}
