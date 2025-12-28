package br.com.cantu.myapp.auth.permission;

import br.com.cantu.myapp.util.database.Label;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
//@Audited
@Table(name = "PER_PERMISSAO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {
    public static final String ID = "PER_ID";

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Label("Função")
    @Column(name = "PER_DS_ENDPOINT", length = 200, nullable = false, unique = true)
    private String endpoint;

    @Label("Método")
    @Column(name = "PER_DS_METODO", length = 20, nullable = false, unique = true)
    private String method;

}
