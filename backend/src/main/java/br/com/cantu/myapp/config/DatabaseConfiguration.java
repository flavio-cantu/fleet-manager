package br.com.cantu.myapp.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@Configuration
@EntityScan(basePackages = {
        "br.com.cantu.myapp"
})
@EnableJpaRepositories(basePackages = {
        "br.com.cantu.myapp"
})
public class DatabaseConfiguration {
}
