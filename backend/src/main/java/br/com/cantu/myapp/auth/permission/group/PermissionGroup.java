package br.com.cantu.myapp.auth.permission.group;

import br.com.cantu.myapp.auth.permission.Permission;
import br.com.cantu.myapp.util.database.Label;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
//@Audited
@Table(name = "PEG_PERMISSAO_GRUPO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionGroup {
    public static final String ID = "PEG_ID";

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Label("Nome")
    @Column(name = "PEG_DS_NOME", length = 100, nullable = false, unique = true)
    private String groupName;

    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(
            name = "PPG_PERMISSAO_PERMISSAO_GRUPO",
            joinColumns = @JoinColumn(name = ID),
            inverseJoinColumns = @JoinColumn(name = Permission.ID)
    )
    private List<Permission> permissions;

}
