package br.com.cantu.myapp.auth.user;

import br.com.cantu.myapp.auth.permission.Permission;
import br.com.cantu.myapp.auth.permission.group.PermissionGroup;
import br.com.cantu.myapp.util.database.Label;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
//@Audited
@Table(name = "USR_USUARIO",
        indexes = @Index(name = "USR_IX_LOGIN", columnList = "USR_DS_LOGIN"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    public static final String ID = "USR_ID";

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Label("Nome Usuário")
    @Column(name = "USR_DS_LOGIN", length = 100, nullable = false)
    private String login;

    @Label("Nome")
    @Column(name = "USR_DS_NOME", length = 100, nullable = false)
    private String name;
    
    @Label("E-mail")
    @Column(name = "USR_DS_EMAIL", length = 100, nullable = false)
    private String email;


    @Label("Data e hora inativação")
    @Column(name = "USR_DH_INATIVADO")
    private LocalDateTime inative;

    @Label("Usuário Criação")
    @Column(name = "USR_DS_CRIADO_POR")
    private String createdBy;

    @Label("Data e hora Criação")
    @Column(name = "USR_DH_CRIADO_EM")
    private LocalDateTime createdAt;

    @Label("Usuário Alteração")
    @Column(name = "USR_DS_ALTERADO_POR")
    private String updatedBy;

    @Label("Data e hora Alteração")
    @Column(name = "USR_DH_ALTERADO_EM")
    private LocalDateTime updatedAt;

    @Column(name = "USR_CD_TOKEN")
    private String token;

    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(
            name = "PEU_PERMISSAO_USUARIO",
            joinColumns = @JoinColumn(name = ID),
            inverseJoinColumns = @JoinColumn(name = Permission.ID)
    )
    private List<Permission> directPermissions;

    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(
            name = "PGU_PERMISSAO_GROUP_USUARIO",
            joinColumns = @JoinColumn(name = ID),
            inverseJoinColumns = @JoinColumn(name = PermissionGroup.ID)
    )
    private List<PermissionGroup> groupPermissions;


//    @Label("Grupo")
//    @ManyToOne
//    @JoinColumn(name = Group.ID)
//    private Group group;
//
//    @Label("Unidade Fabril")
//    @ManyToOne
//    @JoinColumn(name = Unity.ID)
//    private Unity unity;
}
