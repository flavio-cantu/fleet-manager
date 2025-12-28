package br.com.cantu.myapp.auth.user;

import java.util.ArrayList;
import java.util.List;

import br.com.cantu.myapp.util.database.MySpecification;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import br.com.cantu.myapp.auth.user.model.SearchUserRequest;
import jakarta.persistence.criteria.Predicate;

@Component
public class UserPredicate {
    public MySpecification<User> where(SearchUserRequest request) {
        return (root, query, cb, joinMap) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtros básicos do cliente
            if (StringUtils.isNotBlank(request.name())) {
                predicates.add(cb.like(
                        cb.lower(root.get("name")),
                        "%" + request.name().toLowerCase() + "%"));
            }

            if (request.activeOnly()) {
                predicates.add(cb.isNull(root.get("inative")));
            }

            query.distinct(true);
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
