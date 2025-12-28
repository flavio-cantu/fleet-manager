package br.com.cantu.myapp.example;

import br.com.cantu.myapp.example.entity.Client;
import br.com.cantu.myapp.util.database.DatabaseValidation;
import br.com.cantu.myapp.util.validation.BusinessValidation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ClientValidation {

    @Autowired
    private DatabaseValidation databaseValidation;

    public void validate(Client client, Boolean ignoreEdf) {
        BusinessValidation businessValidation = new BusinessValidation();

        checkClientRequiredFields(client, businessValidation);

        databaseValidation.check(client, businessValidation);

        businessValidation.throwIfNotEmpty();
    }


    private static void checkClientRequiredFields(Client client, BusinessValidation businessValidation) {
        businessValidation.checkRule(
                client.getBusinessName() == null,
                "O nome da empresa deve ser preenchido"
        );

    }
}
