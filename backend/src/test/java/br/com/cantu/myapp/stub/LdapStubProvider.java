package br.com.cantu.myapp.stub;

import br.com.cantu.myapp.auth.LoginProvider;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
@Profile("!ldap")
@Slf4j
public class LdapStubProvider implements LoginProvider {

    @Override
    public Authentication authenticate(String username, String password) {
        return new UsernamePasswordAuthenticationToken(
                username,
                password
        );
    }

}
