package br.com.cantu.myapp.util.database;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

/**
 * Interface usada em custom predicates para aproveitar joins
 * @param <T>
 */

public interface MySpecification<T> extends Specification<T> {

    Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder, Map<String, Join<?,?>> joinMap);

    @Override
    default Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        return toPredicate(root, query,criteriaBuilder, null);
    }
}
