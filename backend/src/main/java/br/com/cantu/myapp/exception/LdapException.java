package br.com.cantu.myapp.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LdapException extends RuntimeException {

    public LdapException(String message) {
        super(message);
    }

}
