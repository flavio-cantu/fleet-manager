package br.com.cantu.myapp.example.model;

import lombok.Builder;

@Builder
public record ClientDetailResponse(
        Long id,
        String businessName,
        String cnpj,
        String responsibleName,
        String responsibleCpf,
        String suframa,
        String fantasyName,
        String phone,
        String fax,
        String email
) {
}



