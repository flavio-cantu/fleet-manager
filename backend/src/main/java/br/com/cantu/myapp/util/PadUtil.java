package br.com.cantu.myapp.util;

public class PadUtil {


    public static String lpad(String input, int length, char padChar) {
        if (input == null) {
            input = "";
        }

        if (input.length() >= length) {
            return input;
        }

        StringBuilder sb = new StringBuilder();
        int padLength = length - input.length();

        for (int i = 0; i < padLength; i++) {
            sb.append(padChar);
        }

        sb.append(input);
        return sb.toString();
    }



    public static String rpad(String input, int length, char padChar) {
        if (input == null) {
            input = "";
        }

        if (input.length() >= length) {
            return input;
        }

        StringBuilder sb = new StringBuilder(input);
        int padLength = length - input.length();

        for (int i = 0; i < padLength; i++) {
            sb.append(padChar);
        }

        return sb.toString();
    }

}
