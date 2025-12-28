package br.com.cantu.myapp.util;

import br.com.cantu.myapp.exception.ParseException;
import org.springframework.util.StringUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Objects;

public class FieldUtil {

    /**
     * Função utilitária que vai buscar a propriedade e o objeto não etiver nulo
     * Aumenta a legibilidade do código a um custo mínimo de performace
     *
     * @param obj
     * @param property
     * @return
     */
    public static Object ifNotNull(Object obj, String property) {
        try {
            if (obj == null) {
                return null;
            }
            String methodName = "get" + property.substring(0, 1).toUpperCase() + property.substring(1);
            Method method = obj.getClass().getMethod(methodName);
            return method.invoke(obj);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            throw new ParseException(e);
        }
    }

    public static String returnNullIfEmpty(String value){
        if(StringUtils.hasLength(value)){
            return value;
        }
        return null;
    }


    public static boolean compareForHistory(String a, String b) {
        if (a == null) {
            a = "";
        }
        if (b == null) {
            b = "";
        }
        return !Objects.equals(a, b);
    }
}
