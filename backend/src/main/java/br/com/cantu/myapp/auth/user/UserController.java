package br.com.cantu.myapp.auth.user;

import br.com.cantu.myapp.auth.user.model.CreateUpdateUserResponse;
import br.com.cantu.myapp.auth.user.model.ListUserResponse;
import br.com.cantu.myapp.auth.user.model.SaveUser;
import br.com.cantu.myapp.auth.user.model.SearchUserRequest;
import br.com.cantu.myapp.auth.user.model.UserDetailResponse;
import br.com.cantu.myapp.util.SortAndPage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@Tag(name = "Usuário", description = "Endpoints para manipulação de usuários")
@RequiredArgsConstructor
public class UserController {

	private final UserService service;

	@GetMapping("/count")
	@Operation(summary = "Contador de consulta para empresas", description = """
			Retorna o número de registros (utilizado nas paginações)
			""")
	public Long countUsers(@RequestParam(required = false) String name,
			@RequestParam(required = false, defaultValue = "true") boolean activeOnly) {
		SearchUserRequest request = new SearchUserRequest(
				name,
				activeOnly,
				null);
		return service.countUsers(request);
	}

	@GetMapping
	@Operation(summary = "Listar usuários", description = """
			Lista todos os usuários
			""")
	public List<ListUserResponse> searchUsers(@RequestParam(required = false) String name,
											  @RequestParam(required = false, defaultValue = "true") boolean activeOnly,
											  @RequestParam(required = false) String property,
											  @RequestParam(required = false) String direction,
											  @RequestParam(required = false) Integer pageIndex,
											  @RequestParam(required = false) Integer pageSize) {

		SearchUserRequest request = new SearchUserRequest(
				name,
				activeOnly,
				new SortAndPage(
						property,
						direction,
						pageIndex,
						pageSize));

		return service.searchUsers(request);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Detalhes básicos de um usuário", description = """
			Detalha por ID as informações basicas do usuário
			""")
	public UserDetailResponse detailBasicById(@PathVariable Long id) {
		return service.detailById(id);
	}

	@PostMapping
	@Operation(summary = "Criar uma novo Usuário", description = """
			Cadastro básico de um usuário
			""")
	public ResponseEntity<CreateUpdateUserResponse> create(@RequestBody SaveUser user) {
		return ResponseEntity.ok(service.create(user));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Alterar um usuário", description = """
			Alterar os dados do usuário
			""")
	public ResponseEntity<CreateUpdateUserResponse> update(@PathVariable Long id,
			@RequestBody SaveUser user) {
		return ResponseEntity.ok(service.update(id, user));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Inativa um usuário", description = """
			Usuário não será mais ativo no sistema
			""")
	public ResponseEntity<Boolean> delete(@PathVariable Long id) {
		return ResponseEntity.ok(service.delete(id));
	}
}
