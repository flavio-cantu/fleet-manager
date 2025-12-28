package br.com.cantu.myapp.external.ldap;

import br.com.cantu.myapp.auth.LoginProvider;
import br.com.cantu.myapp.exception.LdapException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
@Profile("ldap")
@Slf4j
public class LdapExternalProvider implements LoginProvider {

    private final AuthenticationManager authenticationManager;

    @Override
    public Authentication authenticate(String username, String password) {
        try{
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        password
                )
        );
        } catch (Exception e) {
            String message = e.getMessage();
            if("Bad credentials".equals(message)) {
                throw new LdapException("LDAP.INVALID");
            }else {
                log.error("Erro LDAP: " + message, e);
                throw new LdapException("[LDAP.ERROR]");
            }
        }
    }

}
