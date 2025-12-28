package br.com.cantu.myapp.auth.model;

import lombok.Builder;

@Builder
public record AuthResponse(
        String token,
        String message,
        boolean empty, //Não há usuários na base
        Long userId
) {
}
