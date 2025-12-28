package br.com.cantu.myapp.config;

import br.com.cantu.myapp.auth.LoginService;
import br.com.cantu.myapp.config.token.JwtTokenFilter;
import br.com.cantu.myapp.config.token.JwtTokenProvider;
import br.com.cantu.myapp.json.JsonMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private JsonMapper jsonMapper;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   CorsConfigurationSource corsConfigurationSource,
                                                   JwtTokenProvider jwtTokenProvider,
                                                   LoginService loginService) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource))
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll() // Permite acesso ao H2
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/local/**").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exceptions -> exceptions
                        // Tratamento para 401 (Não autenticado)
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                            Map<String, Object> error = new HashMap<>();
                            error.put("status", HttpStatus.UNAUTHORIZED.value());
                            error.put("error", "Unauthorized");
                            error.put("message", "Authentication required");
                            error.put("path", request.getRequestURI());
                            error.put("timestamp", System.currentTimeMillis());

                            String json = jsonMapper.writeValueAsString(error);
                            response.getWriter().println(json);
                        })
                        // Tratamento para 403 (Acesso negado)
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                            Map<String, Object> error = new HashMap<>();
                            error.put("status", HttpStatus.FORBIDDEN.value());
                            error.put("error", "Forbidden");
                            error.put("message", "Access denied");
                            error.put("path", request.getRequestURI());
                            error.put("timestamp", System.currentTimeMillis());

                            String json = jsonMapper.writeValueAsString(error);
                            response.getWriter().println(json);
                        })
                )
                .addFilterBefore(new JwtTokenFilter(jwtTokenProvider, loginService), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permite origens específicas
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:4200",
                "http://localhost:8080"
        ));

        // Permite todos os métodos HTTP
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"
        ));

        // Permite todos os headers
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
                JwtTokenFilter.COOKIE_TOKEN_KEY
        ));

        // Expõe headers específicos
        configuration.setExposedHeaders(Arrays.asList(
                JwtTokenFilter.COOKIE_TOKEN_KEY,
                "Authorization",
                "Content-Disposition",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials"
        ));

        // IMPORTANTE: Permitir credenciais (cookies, auth headers)
        configuration.setAllowCredentials(true);

        // Tempo máximo de cache do preflight (1 hora)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }


    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter(jsonMapper.getMapper());
        converters.add(converter);
    }


}