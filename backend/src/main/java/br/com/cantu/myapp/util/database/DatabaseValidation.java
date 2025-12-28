package br.com.cantu.myapp.util.database;

import br.com.cantu.myapp.exception.DatabaseException;
import br.com.cantu.myapp.util.validation.BusinessValidation;
import jakarta.persistence.Column;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;

@Component
public class DatabaseValidation {

    public void check(Object entity, BusinessValidation businessValidation) {
        try {
            Field[] declaredFields = entity.getClass().getDeclaredFields();
            for (Field declaredField : declaredFields) {
                if (declaredField.isAnnotationPresent(Column.class)) {
                    declaredField.setAccessible(true);
                    checkField(entity, declaredField, businessValidation);
                }
            }
        } catch (Exception e) {
            throw new DatabaseException(e.getMessage(), e);
        }
    }

    private void checkField(Object entity, Field field, BusinessValidation businessValidation) throws IllegalAccessException {
        Column column = field.getAnnotation(Column.class);
        int length = column.length();
        Object value = field.get(entity);
        if (value == null) {
            return;
        }

        if (value instanceof String stringValue) {
            if (stringValue.length() > length) {
                businessValidation.checkRule(
                        true,
                        "Tamanho de campo inválido: " + getLabel(field)
                );
            }
        }
    }

    private String getLabel(Field field) {
        Label label = field.getAnnotation(Label.class);
        if(label == null){
            throw new DatabaseException("Field without label: "+field.getName());
        }
        return label.value();
    }

}
