package br.com.cantu.myapp.exception;

public class ParseException extends RuntimeException {
    public ParseException(Exception e) {
        super(e.getMessage(), e);
    }

    public ParseException(String message) {
        super(message);
    }
}
