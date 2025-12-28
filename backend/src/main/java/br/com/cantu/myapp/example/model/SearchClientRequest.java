package br.com.cantu.myapp.example.model;

import br.com.cantu.myapp.util.SortAndPage;
import lombok.Builder;

@Builder
public record SearchClientRequest(
        String businessName,
        String cnpj,
        String uf,
        String municipality,
        boolean activeOnly,
        SortAndPage sortPage
) {}
