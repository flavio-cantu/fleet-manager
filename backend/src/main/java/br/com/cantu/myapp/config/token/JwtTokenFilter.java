package br.com.cantu.myapp.config.token;

import br.com.cantu.myapp.auth.LoginService;
import br.com.cantu.myapp.auth.user.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Slf4j
public class JwtTokenFilter extends OncePerRequestFilter {

    public static final String COOKIE_TOKEN_KEY = "X_TOKEN";

    private static final List<String> skipUrls = Arrays.asList(
            "/api/auth/login",
            "/api/public/",
            "/swagger-ui/",
            "/h2-console/"
    );

    private final JwtTokenProvider jwtTokenProvider;
    private final LoginService loginService;

    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider, LoginService loginService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.loginService = loginService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if (!skipUrl(request)) {
            String token = findToken(request);
            if (jwtTokenProvider.isTokenValid(token)) {
                User user = loginService.retrieveByActiveUserToken(token);
                if (user != null) {
                    if(loginService.isAllowed(user, request.getRequestURI(), request.getMethod())) {
                        Authentication authentication = new UsernamePasswordAuthenticationToken(
                                user.getLogin(),
                                null,
                                null
                        );

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }else{
                        log.warn("Acesso não autorizado | User: "+user.getLogin()+" | Endpoint: "+request.getRequestURI()+" | Method: "+ request.getMethod());
                    }
                }
            }
        }



        filterChain.doFilter(request, response);
    }

    private static String findToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (COOKIE_TOKEN_KEY.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private static boolean skipUrl(HttpServletRequest request) {
        for (String skipUrl : skipUrls) {
            if (request.getRequestURI().contains(skipUrl)) {
                return true;
            }
        }
        return false;
    }
}
