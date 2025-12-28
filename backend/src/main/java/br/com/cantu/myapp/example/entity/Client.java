package br.com.cantu.myapp.example.entity;

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

import java.time.LocalDateTime;

/**
 * Classe representando os dados do cliente
 */
@Entity
@Table(name = "CLI_CLIENTE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {
    public static final String ID = "CLI_ID";

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome empresarial da entidade
     */
    @Label("Nome da empresa")
    @Column(name = "CLI_DS_NOME_EMPRESA", length = 100, nullable = false)
    private String businessName;


    @Column(name = "CLI_DH_INATIVADO")
    private LocalDateTime inative;

}
