package br.com.cantu.myapp.util.validation;

import br.com.cantu.myapp.exception.BusinessException;

import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("java:S2301")
public class BusinessValidation {
    private final List<ValidationMessage> validations = new ArrayList<>();

    public void checkRule(boolean result, ValidationMessage validationMessage) {
        if(result){
            addError(validationMessage);
        }
    }

    public void checkRule(boolean result, String simpleMessage) {
        checkRule(result, new ValidationMessage(simpleMessage));
    }

    public void throwIfNotEmpty() {
        if (!validations.isEmpty()) {
            throw new BusinessException(validations);
        }
    }

    public void addError(ValidationMessage validationMessage) {
        validations.add(validationMessage);
    }


}
