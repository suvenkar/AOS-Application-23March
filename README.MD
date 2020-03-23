# ***** ****
File Path: adm-demo-app/root/src/webapp/index.html
Purpose: UFT test failure case
Instruction: change title from line 193:  from DEMO to anything


# ***** ****
FilePath:adm-demo-app/root/src/main/webapp/app/views/shoppingCart.html
Purpose: chatops
Instruction: follow the comments in the file to create error/fix code changes for chatops user case.

# ***** ****
Purpose: SecureData code showcase
File Path: Encryption: adm-demo-app/root/src/webapp/app/order/services/orderServices.js
           Decryption: 1. Helper classs: adm-demo-app/mastercredit/src/main/java/com/advantage/mastercredit/util/DecryptionHelper.java
                       2. Calling class: adm-demo-app/mastercredit/src/main/java/com/advantage/mastercredit/payment/api/MasterCreditController.java
		   Tokenization: 1. Helper class:  adm-demo-app/accountservice/src/main/java/com/advantage/accountsoap/util/TokenizationHelper.java
		                 2. Calling class: adm-demo-app/accountservice/src/main/java/com/advantage/accountsoap/services/PaymentPreferencesService.java
Instructions: Ctrl+F to Search "Encryption" in .js file will find the piece of code. Search "Decryption" in calling class will find the decryption code. Search "Tokenization" in calling class will find tokenization code.


# ***** ****
File Path: adm-demo-app/order/src/main/java/com/advantage/order/store/services/OrderManagementService.java
Purpose: Trigger any Pipeine by comments
Instruction: add comments as code change


# ***** ****
Purpose:  LeanFT
Result File Path: adm-demo-app/leanft/RunResults/
File Path: adm-demo-app/leanft/src/main/java/com/advantage/shopping/AOSTest.java
Instruction: if re-run the tests for more than 1 time, change the account name in above file Path in line 40, usernameVal
