package br.com.cantu.myapp.auth;

import org.springframework.security.core.Authentication;

public interface LoginProvider {
    Authentication authenticate(String username, String password);
}
