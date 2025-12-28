package br.com.cantu.myapp.auth.user;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.cantu.myapp.auth.user.model.CreateUpdateUserResponse;
import br.com.cantu.myapp.auth.user.model.ListUserResponse;
import br.com.cantu.myapp.auth.user.model.SaveUser;
import br.com.cantu.myapp.auth.user.model.SearchUserRequest;
import br.com.cantu.myapp.auth.user.model.UserDetailResponse;
import lombok.RequiredArgsConstructor;

import static br.com.cantu.myapp.exception.GenericExceptionsUtil.notFound;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final UserValidation validation;
    private final UserPredicate predicate;

    @Transactional(readOnly = true)
    public Long countUsers(SearchUserRequest request) {
        return repository.count(predicate.where(request));
    }

    @Transactional(readOnly = true)
    public List<ListUserResponse> searchUsers(SearchUserRequest request) {
        Pageable pageable = request.sortPage().createPageable();
        Stream<User> result;
        if (pageable == null) {
            result = repository.findAll(predicate.where(request)).stream();
        } else {
            result = repository.findAll(predicate.where(request), pageable).stream();
        }
        return result.map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserDetailResponse detailById(Long id) {
        User user = getUserById(id);
        return toUserDetailResponse(user);
    }

    public UserDetailResponse toUserDetailResponse(User user) {
        return UserDetailResponse.builder()
                .id(user.getId())
                .username(user.getLogin())
                .name(user.getName())
                .email(user.getEmail())
//                .group(user.getGroup())
//                .unity(user.getUnity())
                .active(user.getInative() == null)
                .build();
    }

    @Transactional
    public CreateUpdateUserResponse create(SaveUser saveClient) {
        User client = parseToEntity(saveClient);
        validation.validate(client);
        repository.save(client);
        return parseToResponse(client);
    }

    @Transactional
    public CreateUpdateUserResponse update(Long id, SaveUser saveUser) {
        User databaseUser = getUserById(id);
        User user = mergeToEntity(databaseUser, saveUser);
        validation.validate(user);
        repository.save(user);
        return parseToResponse(user);
    }

    @Transactional
    public Boolean delete(Long id) {
        User user = getUserById(id);
        try {
            if (user.getInative() == null) {
                user.setInative(LocalDateTime.now());
                repository.save(user);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private ListUserResponse toResponse(User user) {
        return ListUserResponse.builder()
                .id(user.getId())
                .username(user.getLogin())
                .name(user.getName())
                .email(user.getEmail())
//                .group(user.getGroup() != null ? user.getGroup() : null)
//                .unity(user.getUnity() != null ? user.getUnity() : null)
                .active(user.getInative() == null)
                .build();
    }

    public User getUserById(Long id) {
        return repository.findById(id).orElseThrow(notFound());
    }

    private User parseToEntity(SaveUser user) {
        return User.builder()
                .login(user.username())
                .name(user.name())
                .email(user.email())
//                .group(user.group())
//                .unity(user.unity())
//                .createdBy(SecurityUtil.getNameUserLogged())
                .createdAt(LocalDateTime.now())
                .build();
    }

    private CreateUpdateUserResponse parseToResponse(User user) {
        return CreateUpdateUserResponse.builder()
                .id(user.getId())
                .build();
    }

    private User mergeToEntity(User database, SaveUser saveUser) {
        database.setLogin(saveUser.username());
        database.setName(saveUser.name());
        database.setEmail(saveUser.email());
//        database.setGroup(saveUser.group());
//        database.setUnity(saveUser.unity());
//        database.setUpdatedBy(SecurityUtil.getNameUserLogged());
        database.setInative(saveUser.active() ? null : database.getInative());
        database.setUpdatedAt(LocalDateTime.now());
        return database;
    }

}
