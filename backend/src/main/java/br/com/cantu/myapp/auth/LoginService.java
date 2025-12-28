package br.com.cantu.myapp.auth;

import br.com.cantu.myapp.auth.model.AuthRequest;
import br.com.cantu.myapp.auth.model.AuthResponse;
import br.com.cantu.myapp.auth.user.User;
import br.com.cantu.myapp.auth.user.UserRepository;
import br.com.cantu.myapp.config.token.JwtTokenProvider;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class LoginService {

    private final JwtTokenProvider jwtTokenProvider;
    private final LoginProvider provider;

    //Para não dar recusividade
    private final UserRepository userRepository;
    private final LoginRepository loginRepository;

    @Transactional
    public AuthResponse login(AuthRequest loginRequest) {
        Authentication providerAuth = provider.authenticate(loginRequest.username(), loginRequest.password());
        User databaseUser = userRepository.findByLogin(loginRequest.username());
        if(databaseUser == null){
            if(userRepository.count() == 0) {
                //fluxo de criação do admin
                return AuthResponse.builder().empty(true).build();
            }else{
                return AuthResponse.builder().message("USER.NOT_FOUND").build();
            }
        }

        if(providerAuth == null){
            return AuthResponse.builder().message("USER.NOT_VALID").build();
        }

        String token = jwtTokenProvider.generateToken(databaseUser.getLogin());
        //Subistituir pelo redis quando existir
        databaseUser.setToken(token);
        userRepository.save(databaseUser);

        return AuthResponse.builder().token(token).userId(databaseUser.getId()).build();
    }

    @Transactional
    public void logout() {
        User user = getUserFromLogin();
        if(user != null) {
            user.setToken(null);
            userRepository.save(user);
        }
    }

    private User getUserFromLogin() {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByLogin(login);
    }

    @Transactional
    public User retrieveByActiveUserToken(String token) {
        if(token == null){
            return null;
        }
        return userRepository.findByTokenAndInative(token, null);
    }

    @Transactional(readOnly = true)
    public boolean isAllowed(User user, String requestURI, String method) {
        long count = loginRepository.hasPermission(user.getId(), requestURI, method);
        return count != 0;
    }


}
