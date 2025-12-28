package br.com.cantu.myapp.auth;


import br.com.cantu.myapp.auth.model.AuthRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest loginRequest) {
        return ResponseEntity.ok(loginService.login(loginRequest));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if("anonymousUser".equals(auth.getName())){
            return ResponseEntity.ok("Usuário NÃO está autenticado");
        }else {
            return ResponseEntity.ok(auth.getName() + " está autenticado");
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?>  logout() {
        loginService.logout();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("USER.LOGOUT");
    }

}