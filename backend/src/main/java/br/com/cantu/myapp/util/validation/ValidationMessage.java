package br.com.cantu.myapp.util.validation;

import lombok.Getter;

@Getter
public class ValidationMessage {

    private String message;


    public ValidationMessage(String message) {
        this.message = message;
    }


}
