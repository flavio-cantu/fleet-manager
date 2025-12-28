package br.com.cantu.myapp.config.ldap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;


import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.ldap.authentication.ad.ActiveDirectoryLdapAuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.AuthenticationProvider;

import java.util.Arrays;

@Profile("ldap")
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class LdapConfig {

    private static final String LDAP_SEARCH_FILTER = "userPrincipalName={0}";

    @Value("${spring.ldap.urls}")
    private String ldapUrls;
    @Value("${spring.ldap.domain}")
    private String adDomain;



    @Bean
    public ActiveDirectoryLdapAuthenticationProvider activeDirectoryLdapAuthenticationProvider() {

        ActiveDirectoryLdapAuthenticationProvider provider =
                new ActiveDirectoryLdapAuthenticationProvider(adDomain, ldapUrls);
        provider.setSearchFilter(LDAP_SEARCH_FILTER);
        provider.setConvertSubErrorCodesToExceptions(true);
        provider.setUseAuthenticationRequestCredentials(true);
        SimpleAuthorityMapper mapper = new SimpleAuthorityMapper();
        mapper.setConvertToUpperCase(true);
        provider.setAuthoritiesMapper(mapper);
        return provider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationProvider ad, AuthenticationProvider dao) {
        return new ProviderManager(Arrays.asList(ad, dao));
    }

}