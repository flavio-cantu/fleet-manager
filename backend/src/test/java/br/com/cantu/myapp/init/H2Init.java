package br.com.cantu.myapp.init;

import br.com.cantu.myapp.auth.permission.Permission;
import br.com.cantu.myapp.auth.permission.PermissionRepository;
import br.com.cantu.myapp.auth.permission.group.PermissionGroup;
import br.com.cantu.myapp.auth.permission.group.PermissionGroupRepository;
import br.com.cantu.myapp.auth.user.User;
import br.com.cantu.myapp.auth.user.UserService;
import br.com.cantu.myapp.auth.user.model.CreateUpdateUserResponse;
import br.com.cantu.myapp.auth.user.model.SaveUser;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Profile("h2")
@Component
@AllArgsConstructor
public class H2Init implements CommandLineRunner {

    private final UserService userService;

    private final PermissionRepository permissionRepository;
    private final PermissionGroupRepository permissionGroupRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        CreateUpdateUserResponse userCreated = userService.create(SaveUser.builder()
                .name("Flávio")
                .username("fcantuaria")
                .email("flaviocantuaria@gmail.com.br")
                .active(true)
                .build());


        User user = userService.getUserById(userCreated.id());

        PermissionGroup adminGroup = permissionGroupRepository.save(PermissionGroup.builder()
                .groupName("ADMIN")
                .build());

        user.setGroupPermissions(Arrays.asList(adminGroup));

        Permission permission = permissionRepository.save(Permission.builder()
                .endpoint("*")
                .method("*")
                .build());

        adminGroup.setPermissions(Arrays.asList(permission));

    }


}
