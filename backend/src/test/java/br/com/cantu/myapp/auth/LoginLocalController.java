package br.com.cantu.myapp.auth;

import br.com.cantu.myapp.auth.user.User;
import br.com.cantu.myapp.auth.user.UserRepository;
import br.com.cantu.myapp.auth.user.UserService;
import br.com.cantu.myapp.auth.user.model.ListUserResponse;
import br.com.cantu.myapp.auth.user.model.SearchUserRequest;
import br.com.cantu.myapp.config.token.JwtTokenFilter;
import br.com.cantu.myapp.config.token.JwtTokenProvider;
import br.com.cantu.myapp.util.SortAndPage;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.*;

@RestController
@RequestMapping("/local")
@AllArgsConstructor
public class LoginLocalController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/users")
    public List<ListUserResponse>  listUsers() {
        SearchUserRequest request = new SearchUserRequest(
                null,
                false,
                new SortAndPage(
                        null,
                        null,
                        0,
                        1000));
        return userService.searchUsers(request);
    }

    @GetMapping("/login")
    @Transactional
    public String loginAsUser(@RequestParam Long userId)  {
        User user = userService.getUserById(userId);
        Authentication auth = createAuthenticationForUser(user);
        SecurityContextHolder.getContext().setAuthentication(auth);

        String token = jwtTokenProvider.generateToken(user.getLogin());
        user.setToken(token);
        userRepository.save(user);

        return "{\""+ JwtTokenFilter.COOKIE_TOKEN_KEY +"\": \""+token+"\"}";
    }

    private Authentication createAuthenticationForUser(User user) {
        return new UsernamePasswordAuthenticationToken(
                        user.getLogin(),
                        null,
                        null
                );
    }


}
