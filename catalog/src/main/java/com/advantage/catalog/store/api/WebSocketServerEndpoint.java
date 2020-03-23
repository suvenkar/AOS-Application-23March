package com.advantage.catalog.store.api;

import com.advantage.common.Constants;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

/**
 * This class handles MOCK chat with support. Bad language is prohibited, use of
 * &quot;dirty words&quot; is prohibited as well. <br/>
 * Use <i>&quot;Hello&quot;</i> to reset the chat and start over.<br/>
 * Use <i>&quot;close&quot;</i> to end the chat at anytime and disconnect
 * the client.<br/>
 * <ul>Web Socket chat URL is:</ul>
 * <pre>
 *      ws://localhost:8080/WebSocketPrj01/serverendpointdemo
 * </pre>
 * @author Binyamin Regev on 24/03/2016.
 */
@ServerEndpoint("/websocketserverendpoint")
public class WebSocketServerEndpoint {
    private static String REPLY_WHAT_IS_YOUR_NAME = "Hello, what's your name? ";
    private static String REPLY_INTERESTING_IS_THAT_REALLY_YOUR_NAME = "Interesting! %s, Is that really your name? ";
    private static String REPLY_SO_PLEASE_ENTER_YOUR_NAME = "So please enter your name, start with 'my name is' ";
    private static String REPLY_COOL_NAME_ARE_YOU_INTERESTED_IN_SPECIFIC_CATEGORY = "Cool Name %s, are you interested in a specific category of products? ";
    private static String REPLY_EXCUSE_ME_DO_YOU_UNDERSTAND_ENGLISH = "Excuse me, do you understand English? ";
    private static String REPLY_OK_ARE_YOU_INTERESTED_IN_SPECIFIC_CATEGORY_OF_PRODUCT = "Ok %s, are you interested in a specific category of products? ";
    private static String REPLY_GOOD_WHICH_CATEGORY = "Good, which category? ";
    private static String REPLY_ARE_YOU_INTERESTED_IN_SPECIFIC_PRODUCT_IN_THAT_CATEGORY = "Great. %s, are you interested in a specific product from %s category? ";
    private static String REPLY_UNKNOWN_CATEGORY_ARE_YOU_INTERESTED_IN_PARTICULAR_CATEGORY = "Category name %s is unknown, are you interested in a particular category %s? ";
    private static String REPLY_ARE_YOU_INTERESTED_IN_SPECIFIC_PRODUCT = "%s, Are you interested in a specific product?";
    private static String REPLY_GREAT_WHICH_PRODUCT_YOU_ARE_INTERESTED_IN = "Great, which product are you interested in? ";
    private static String REPLY_ARE_YOU_INTERESTED_IN_CATEGORY_IN_GENERAL = "%s, are you interested in category %s in general?";
    private static String REPLY_ARE_EXCELLENT_CHOICE_GREAT_PRODUCT_HOW_CAN_I_HELP = "Excellent choice %s, great product. Please, leave your phone number or email and a professional representative will contact you.";
    private static String REPLY_PLEASE_LEAVE_ME_PHONE_NUMBER_OR_EMAIL = "Please %s, leave me you phone number or e-mail and a specialized support person will contact you. ";
    private static String REPLY_THANK_YOU_FOR_CONTACTING_ADVANTAGE_SUPPORT = "Thank you for contacting Advantage support %s, have a wonderful ";
    private static String REPLY_SORRY_YOU_NEED_TO_ANSWER_THE_QUESTION = "I'm sorry %s, you need to answer the question.";

    private static int replyNumber = 0;
    private String userName = "Guest20110326";
    private String tempUserName = "temp20110326";
    private int selectedSupportTeamMember = 0;
    private String category;

    private Set<String> categories = new HashSet<String>();

    private static String supportTeam[] = {
            "Adi",
            "Alex",
            "Bar",
            "Ben",
            "Daniel",
            "David",
            "Dom",
            "Efi",
            "Goofy",
            "Halo",
            "Irina",
            "Jana",
            "Jordan",
            "Julia",
            "Maria",
            "Mars",
            "Miki",
            "Mercury",
            "Shay",
            "Shir",
            "Sofia",
            "Summer",
            "Sveta",
            "Tobi",
            "Venus",
            "Yam",
            "Zoe"
    };

    /**
     * Open a connection with the client
     */
    @OnOpen
    public void handleOpen() {
        categories.add("LAPTOPS");
        categories.add("HEADPHONES");
        categories.add("TABLETS");
        categories.add("SPEAKERS");
        categories.add("MICE");

        System.out.println("Client is now connected...");
    }

    /**
     * Exchanging messages with the client
     * @param message
     * @return
     */
    @OnMessage
    public String handleMessage(String message) {
        String replyMessage;

        if (message.equalsIgnoreCase("Hello")) {
            replyNumber = 0;
        } else if (containsBadLanguage(message)) {
            return "Use of bad language is not allowed, we have ZERO TOLERANCE for it. Goodbye. ";
        }

        switch (replyNumber) {
            case 0:
                replyNumber ++;			//	Now = 1
                this.selectedSupportTeamMember = new Random().nextInt((supportTeam.length + 1));
                replyMessage = REPLY_WHAT_IS_YOUR_NAME;
                break;
			/* ----------------------------------------------------------------------------- */
            case 1:
                if (! message.toLowerCase().contains("my name is")) {
                    replyNumber ++;		//	Now = 2
                    this.tempUserName = message;
                    replyMessage = String.format(REPLY_INTERESTING_IS_THAT_REALLY_YOUR_NAME, tempUserName);
                } else {
                    replyNumber += 2;	//	Now = 3
                    this.userName = message.substring(11);
                    replyMessage = String.format(REPLY_OK_ARE_YOU_INTERESTED_IN_SPECIFIC_CATEGORY_OF_PRODUCT, userName);
                }
                break;
			/* ----------------------------------------------------------------------------- */
            case 2:
                this.userName = this.tempUserName;
                if (message.toUpperCase().contains("NO")) {
                    replyNumber --;		//	Now = 1
                    replyMessage = REPLY_SO_PLEASE_ENTER_YOUR_NAME;
                } else if  (message.toUpperCase().contains("YES")) {
                    replyNumber ++;		//	Now = 3
                    replyMessage = String.format(REPLY_COOL_NAME_ARE_YOU_INTERESTED_IN_SPECIFIC_CATEGORY, tempUserName);
                } else {
                    replyNumber = 0;
                    replyMessage = REPLY_EXCUSE_ME_DO_YOU_UNDERSTAND_ENGLISH;
                }
                break;
			/* ----------------------------------------------------------------------------- */
            case 3:
                if (message.toUpperCase().contains("YES")) {
                    replyNumber ++;		//	Now = 4
                    replyMessage = REPLY_GOOD_WHICH_CATEGORY;
                } else if (message.toUpperCase().contains("NO")) {
                    replyNumber += 4;	//	Now = 7
                    replyMessage = String.format(REPLY_ARE_YOU_INTERESTED_IN_SPECIFIC_PRODUCT, userName);
                } else {
                    replyNumber = 0;	//	Now = 0
                    replyMessage = REPLY_EXCUSE_ME_DO_YOU_UNDERSTAND_ENGLISH;
                }
                break;
			/* ----------------------------------------------------------------------------- */
            case 4:
                boolean isCategoryExist = categories.stream().anyMatch(i -> i.equalsIgnoreCase(message));
                if (isCategoryExist) {
                    replyNumber ++;		//	Now = 5
                    category = message;
                    replyMessage = String.format(REPLY_ARE_YOU_INTERESTED_IN_SPECIFIC_PRODUCT_IN_THAT_CATEGORY, userName, message);
                } else {
                    replyNumber --;		//	Now = 3
                    replyMessage = String.format(REPLY_UNKNOWN_CATEGORY_ARE_YOU_INTERESTED_IN_PARTICULAR_CATEGORY, message, userName);
                }
                break;
			/* ----------------------------------------------------------------------------- */
            case 5:
                if (message.toUpperCase().contains("YES")) {
                    replyNumber += 2;	//	Now = 7
                    replyMessage = REPLY_GREAT_WHICH_PRODUCT_YOU_ARE_INTERESTED_IN;
                } else {
                    replyNumber ++;		//	Now = 6
                    replyMessage = String.format(REPLY_ARE_YOU_INTERESTED_IN_CATEGORY_IN_GENERAL, userName, category);
                }
                break;
			/* ----------------------------------------------------------------------------- */
            case 6:
                replyNumber += 3;	//	Now = 9
                replyMessage = String.format(REPLY_PLEASE_LEAVE_ME_PHONE_NUMBER_OR_EMAIL, userName);
                break;
			/* ----------------------------------------------------------------------------- */
            case 7:
                if (message.toUpperCase().contains("YES")) {
                    replyNumber ++;		//	Now = 8
                    replyMessage = String.format(REPLY_ARE_EXCELLENT_CHOICE_GREAT_PRODUCT_HOW_CAN_I_HELP, userName);
                } else {
                    replyNumber += 2;	//	Now = 9
                    replyMessage = String.format(REPLY_PLEASE_LEAVE_ME_PHONE_NUMBER_OR_EMAIL, userName);
                }
                break;
			/* ----------------------------------------------------------------------------- */
            case 8:
                replyNumber ++;			//	Now = 9
                replyMessage = String.format(REPLY_PLEASE_LEAVE_ME_PHONE_NUMBER_OR_EMAIL, userName);
                break;
			/* ----------------------------------------------------------------------------- */
            case 9:
			/*
			 * hour > 21 and <= 3 ==> Night
			 * hour > 3 and <= 11 ==> Morning
			 * hour > 11 and <= 15 ==> Day
			 * hour > 15 and <= 17 == Afternoon
			 * hour > 17 and <= 21 == Evening
			 */
                int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
                StringBuilder sb = new StringBuilder(REPLY_THANK_YOU_FOR_CONTACTING_ADVANTAGE_SUPPORT);
                if ((hour >= 0) && (hour <=  3)) {
                    sb.append("night");
                } else if ((hour >  3) && (hour <= 15)) {
                    sb.append("day");
                } else if ((hour > 11) && (hour <= 15)) {
                    sb.append("day");
                } else if ((hour > 15) && (hour <= 17)) {
                    sb.append("afternoon");
                } else if ((hour > 17) && (hour <= 21)) {
                    sb.append("evening");
                } else if ((hour > 21) && (hour <= 23)) {
                    sb.append("night");
                }

                replyMessage = String.format(sb.toString(), userName);

                break;
			/* ----------------------------------------------------------------------------- */
            default:
                replyMessage = "replyNumber=" + replyNumber + Constants.SPACE + String.format(REPLY_SORRY_YOU_NEED_TO_ANSWER_THE_QUESTION, userName);
        }

//		System.out.println("Received from client: " + message);
//		String replyMessage = "In reply to your message '" + message + "'";
//		System.out.println("Send to client: " + replyMessage);

        return supportTeam[this.selectedSupportTeamMember] + ": " + replyMessage;
    }

    /**
     * Closing the connection with the client
     */
    @OnClose
    public void handleClose() {
        System.out.println("Client is now disconnected...");
    }

    /**
     * In case of an error
     * @param t
     */
    @OnError
    public void handleError(Throwable t) {
        t.printStackTrace();
    }

    /**
     * check mesage for use of bad language, such as 'F' and 'S' words, etc.
     * @param message {@link String} to check for use of bad language.
     * @return {@code true} use of bad language has been detected.
     */
    private boolean containsBadLanguage(final String message) {
        boolean result = false;
        if (message.toLowerCase().indexOf("bab") > -1) {
            result = true;
        } else if (message.toLowerCase().indexOf("fuck") > -1) {
            result = true;
        } else if (message.toLowerCase().indexOf("shit") > -1) {
            result = true;
        } else if (message.toLowerCase().indexOf("sweet") > -1) {
            result = true;
        } else if (message.toLowerCase().indexOf("honey") > -1) {
            result = true;
        } else if (message.toLowerCase().indexOf("ass") > -1) {
            result = true;
        } else if (message.toLowerCase().indexOf("donkey") > -1) {
            result = true;
        } else if (message.toLowerCase().indexOf("poop") > -1) {
            result = true;
        }
        return result;
    }
}
