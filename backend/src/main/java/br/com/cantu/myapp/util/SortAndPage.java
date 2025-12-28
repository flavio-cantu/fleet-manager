package br.com.cantu.myapp.util;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public record SortAndPage(
        String property,
        String direction,
        Integer pageIndex,
        Integer pageSize) {

    public Pageable createPageable() {
        if(pageIndex != null && pageSize != null) {
            return PageRequest.of(pageIndex, pageSize);
        }else{
            return null;
        }
    }

}
