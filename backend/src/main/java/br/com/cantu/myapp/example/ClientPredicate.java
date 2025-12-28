package br.com.cantu.myapp.example;

import br.com.cantu.myapp.example.entity.Client;
import br.com.cantu.myapp.example.model.SearchClientRequest;
import jakarta.persistence.criteria.Predicate;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ClientPredicate {
    public Specification<Client> where(SearchClientRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtros básicos do cliente
            if (StringUtils.isNotBlank(request.businessName())) {
                predicates.add(cb.like(
                        cb.lower(root.get("businessName")),
                        "%" + request.businessName().toLowerCase() + "%"
                ));
            }



            if (request.activeOnly()) {
                predicates.add(cb.isNull(root.get("inative")));
            }

            query.distinct(true);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
