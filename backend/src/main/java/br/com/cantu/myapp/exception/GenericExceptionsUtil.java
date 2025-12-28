package br.com.cantu.myapp.exception;

import java.util.function.Supplier;

public class GenericExceptionsUtil {

    private GenericExceptionsUtil() {
    }

    public static Supplier<ObjectNotFoundException> notFound() {
        return () -> new ObjectNotFoundException("ERROR.NOT_FOUND");
    }

}
