package br.com.cantu.myapp.auth.user;

import br.com.cantu.myapp.util.database.DatabaseValidation;
import br.com.cantu.myapp.util.validation.BusinessValidation;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserValidation {

    private final DatabaseValidation databaseValidation;

    public void validate(User user) {
        BusinessValidation businessValidation = new BusinessValidation();

        checkUserRequiredFields(user, businessValidation);

        databaseValidation.check(user, businessValidation);

        businessValidation.throwIfNotEmpty();
    }

    private static void checkUserRequiredFields(User user, BusinessValidation businessValidation) {
        businessValidation.checkRule(
                user.getName() == null,
                "O nome do usuário deve ser preenchido");
        businessValidation.checkRule(
                user.getEmail() == null,
                "O e-mail do usuário deve ser preenchido");
        businessValidation.checkRule(
                user.getLogin() == null,
                "O login de usuário deve ser preenchido");
    }

}
