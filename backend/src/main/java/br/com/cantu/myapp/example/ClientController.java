package br.com.cantu.myapp.example;

import br.com.cantu.myapp.example.model.ClientDetailResponse;
import br.com.cantu.myapp.example.model.CreateUpdateClientResponse;
import br.com.cantu.myapp.example.model.ListClientResponse;
import br.com.cantu.myapp.example.model.SaveClient;
import br.com.cantu.myapp.example.model.SearchClientRequest;
import br.com.cantu.myapp.util.SortAndPage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/example")
@Tag(name = "Exemplo", description = "CRUD de exemplo")
public class ClientController {

    public static final String COOKIE_CLIENT = "CONTEXT_CLIENT";

    @Autowired
    private ClientService service;

    @GetMapping("/count")
    @Operation(summary = "Contador de consulta para empresas", description = """
            Retorna o número de registros (utilizado nas paginações)
            """)
    public Long countClients(@RequestParam(required = false) String businessName,
                                                  @RequestParam(required = false) String cnpj,
                                                  @RequestParam(required = false) String uf,
                                                  @RequestParam(required = false) String municipality,
                                                  @RequestParam(required = false, defaultValue = "true") boolean activeOnly) {

        SearchClientRequest request = new SearchClientRequest(
                businessName,
                cnpj,
                uf,
                municipality,
                activeOnly,
                null
        );
        return service.countClients(request);
    }

    @GetMapping
    @Operation(summary = "Consultar empresas", description = """
            Apresenta todos as empresas cadastrados
            """)
    public List<ListClientResponse> searchClients(@RequestParam(required = false) String businessName,
                                                  @RequestParam(required = false) String cnpj,
                                                  @RequestParam(required = false) String uf,
                                                  @RequestParam(required = false) String municipality,
                                                  @RequestParam(required = false, defaultValue = "true") boolean activeOnly,
                                                  //
                                                  @RequestParam(required = false) String property,
                                                  @RequestParam(required = false) String direction,
                                                  @RequestParam(required = false) Integer pageIndex,
                                                  @RequestParam(required = false) Integer pageSize) {

        SearchClientRequest request = new SearchClientRequest(
                businessName,
                cnpj,
                uf,
                municipality,
                activeOnly,
                new SortAndPage(
                        property,
                        direction,
                        pageIndex,
                        pageSize
                )
        );
        return service.searchClients(request);
    }


    @GetMapping("/{id}")
    @Operation(summary = "Detalhes básicos de uma empresa", description = """
            Detalha por ID as informações basicas da empresa
            """)
    public ClientDetailResponse detailBasicById(@PathVariable Long id) {
        return service.seachById(id);
    }

    @PostMapping
    @Operation(summary = "Criar uma novo cliente", description = """
            Cadastro básico de uma empresa
            """)
    public ResponseEntity<CreateUpdateClientResponse> create(
            @RequestHeader(value = "IGNORE_EDF", required = false) Boolean ignoreEdf,
            @RequestBody SaveClient client) {
        if (ignoreEdf == null) {
            ignoreEdf = false;
        }
        return ResponseEntity.ok(service.create(client, ignoreEdf));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Alterar uma empresa", description = """
            Alterar os dados da empresa
            """)
    public ResponseEntity<CreateUpdateClientResponse> update(@RequestHeader(value = "IGNORE_EDF", required = false) Boolean ignoreEdf,
                                                             @PathVariable Long id,
                                                             @RequestBody SaveClient client) {
        if (ignoreEdf == null) {
            ignoreEdf = false;
        }
        return ResponseEntity.ok(service.update(id, client, ignoreEdf));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar uma empresa", description = """
            Se houver vínculos na empresa, ele será inativado. Se não houver, ele será removido do sistema.
            Retornará true se houver deleção física. Caso contrário estará inativado.
            """)
    public ResponseEntity<Boolean> delete(@PathVariable Long id) {
        return ResponseEntity.ok(service.delete(id));
    }

}