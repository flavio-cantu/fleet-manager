package br.com.cantu.myapp.config;

import br.com.cantu.myapp.exception.BusinessException;
import br.com.cantu.myapp.exception.LdapException;
import br.com.cantu.myapp.json.JsonMapper;
import br.com.cantu.myapp.util.validation.ValidationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class RestExceptionHandler {

    @Autowired
    private JsonMapper mapper;

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BusinessException.class)
    public String handleException(BusinessException ex) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        for (ValidationMessage validation : ex.getValidations()) {
            errors.add(validation.getMessage());
        }
        Map<String, List<String>> result = new HashMap<>();
        result.put("errors", errors);
        result.put("warnings", warnings);
        return mapper.writeValueAsString(result);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(LdapException.class)
    public String handleLdapException(LdapException ex) {
        Map<String, String> result = new HashMap<>();
        result.put("errors", ex.getMessage());
        return mapper.writeValueAsString(result);
    }

}
