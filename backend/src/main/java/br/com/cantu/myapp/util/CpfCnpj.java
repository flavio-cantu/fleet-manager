package br.com.cantu.myapp.util;

@SuppressWarnings({"java:S1541", "java:S121",
        "java:S1132", "java:S109", "java:S1166", "java:S1067"})
public class CpfCnpj {

    public static final String ONLY_NUMBER = "[^0-9]";

    public static boolean isCNPJValid(String cnpj) {
        cnpj = removeMask(cnpj);
        if (cnpj.matches("(\\d)\\1{13}")) {
            return false;
        }
        try {
            int sum = 0;
            int[] pes1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
            for (int i = 0; i < 12; i++) {
                sum += Character.getNumericValue(cnpj.charAt(i)) * pes1[i];
            }
            int rest = sum % 11;
            int dig1 = (rest < 2) ? 0 : 11 - rest;
            sum = 0;
            int[] pes2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
            for (int i = 0; i < 13; i++) {
                sum += Character.getNumericValue(cnpj.charAt(i)) * pes2[i];
            }
            rest = sum % 11;
            int dig2 = (rest < 2) ? 0 : 11 - rest;
            return Character.getNumericValue(cnpj.charAt(12)) == dig1
                    && Character.getNumericValue(cnpj.charAt(13)) == dig2;
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean isCPFValid(String cpf) {
        cpf = removeMask(cpf);
        if (cpf.matches("(\\d)\\1{10}")) {
            return false;
        }
        try {
            int sum = 0;
            for (int i = 0; i < 9; i++) {
                sum += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
            }
            int rest = sum % 11;
            int dig1 = (rest < 2) ? 0 : 11 - rest;
            sum = 0;
            for (int i = 0; i < 10; i++) {
                sum += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
            }
            rest = sum % 11;
            int dig2 = (rest < 2) ? 0 : 11 - rest;
            return Character.getNumericValue(cpf.charAt(9)) == dig1
                    && Character.getNumericValue(cpf.charAt(10)) == dig2;
        } catch (Exception e) {
            return false;
        }
    }

    public static String removeMask(String document) {
        if (document == null) {
            return "";
        }
        return document.replaceAll(ONLY_NUMBER, "");
    }

}
