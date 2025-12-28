package br.com.cantu.myapp.exception;

import br.com.cantu.myapp.util.validation.ValidationMessage;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class BusinessException extends RuntimeException {
    private final List<ValidationMessage> validations;
}
