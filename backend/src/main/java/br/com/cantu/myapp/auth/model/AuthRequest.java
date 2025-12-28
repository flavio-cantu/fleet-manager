package br.com.cantu.myapp.auth.model;

public record AuthRequest(
        String username,
        String password
) {
}