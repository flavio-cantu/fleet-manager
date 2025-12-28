package br.com.cantu.myapp.auth.user.model;

import br.com.cantu.myapp.util.SortAndPage;
import lombok.Builder;

@Builder
public record SearchUserRequest(
        String name,
        boolean activeOnly,
        SortAndPage sortPage
) {}
