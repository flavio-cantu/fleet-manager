package br.com.cantu.myapp.example.model;

import lombok.Builder;

import java.util.List;

@Builder
public record SaveClient(
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
