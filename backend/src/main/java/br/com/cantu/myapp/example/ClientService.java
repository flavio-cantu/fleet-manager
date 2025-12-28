package br.com.cantu.myapp.example;

import br.com.cantu.myapp.example.entity.Client;
import br.com.cantu.myapp.example.model.ClientDetailResponse;
import br.com.cantu.myapp.example.model.CreateUpdateClientResponse;
import br.com.cantu.myapp.example.model.ListClientResponse;
import br.com.cantu.myapp.example.model.SaveClient;
import br.com.cantu.myapp.example.model.SearchClientRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Stream;

import static br.com.cantu.myapp.exception.GenericExceptionsUtil.*;

@Service
public class ClientService {

    @Autowired
    private ClientRepository repository;
    @Autowired
    private ClientValidation validation;
    @Autowired
    private ClientPredicate predicate;


    @Transactional(readOnly = true)
    public Long countClients(SearchClientRequest request) {
        return repository.count(predicate.where(request));
    }

    @Transactional(readOnly = true)
    public List<ListClientResponse> searchClients(SearchClientRequest request) {
        Pageable pageable = request.sortPage().createPageable();
        Stream<Client> result = null;
        if (pageable == null) {
            result = repository.findAll(predicate.where(request)).stream();
        } else {
            result = repository.findAll(predicate.where(request), pageable).stream();
        }
        return result.map(client -> ListClientResponse.builder()
                .id(client.getId())
                .businessName(client.getBusinessName())
                .build()).toList();
    }

    @Transactional(readOnly = true)
    public ClientDetailResponse seachById(Long id) {
        Client client = getClientById(id);

        return ClientDetailResponse.builder()
                .id(client.getId())
                .businessName(client.getBusinessName())
                .build();
    }

    public Client getClientById(Long id) {
        return repository.findById(id)
                .orElseThrow(notFound());
    }


    @Transactional
    public CreateUpdateClientResponse create(SaveClient saveClient, Boolean ignoreEdf) {
        Client client = parseToEntity(saveClient);
        validation.validate(client, ignoreEdf);
        repository.save(client);
        return parseToResponse(client);
    }

    @Transactional
    public CreateUpdateClientResponse update(Long id, SaveClient saveClient, Boolean ignoreEdf) {
        Client databaseClient = getClientById(id);
        Client client = mergeToEntity(databaseClient, saveClient);
        validation.validate(client, ignoreEdf);
        repository.save(client);
        return parseToResponse(client);
    }


    private CreateUpdateClientResponse parseToResponse(Client client) {
        return CreateUpdateClientResponse.builder()
                .id(client.getId())
                .build();
    }

    private Client parseToEntity(SaveClient saveClient) {
        return Client.builder()
                .businessName(saveClient.businessName())
                .build();
    }


    private Client mergeToEntity(Client databaseClient, SaveClient saveClient) {

        databaseClient.setBusinessName(saveClient.businessName());

        return databaseClient;
    }


    @Transactional
    public Boolean delete(Long id) {
        Client client = getClientById(id);
        repository.delete(client);
        return true;
    }


}
