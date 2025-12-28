package br.com.cantu.myapp.example.model;

import lombok.Builder;

@Builder
public record ListClientResponse(
        Long id,
        String businessName,
        String cnpj,
        String responsibleName,
        String responsibleCpf,
        String phone,
        String email
) {
}
