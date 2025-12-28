package br.com.cantu.myapp.auth;

import br.com.cantu.myapp.auth.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LoginRepository extends JpaRepository<User, Long> {

    @Query("""
           SELECT COUNT(1) FROM User usr
           LEFT JOIN usr.directPermissions direct
           LEFT JOIN usr.groupPermissions grp
           LEFT JOIN grp.permissions grpPerm
           WHERE usr.id = :userId
             AND (
                 (direct.endpoint = :endpoint AND direct.method = :method)
                 OR (grpPerm.endpoint = :endpoint AND grpPerm.method = :method)
                 OR(direct.endpoint = '*' AND direct.method = '*')
                 OR (grpPerm.endpoint = '*' AND grpPerm.method = '*')
                 OR (direct.endpoint = '*' AND direct.method = :method)
                 OR (direct.endpoint = :endpoint AND direct.method = '*')
                 OR (grpPerm.endpoint = '*' AND grpPerm.method = :method)
                 OR (grpPerm.endpoint = :endpoint AND grpPerm.method = '*')
             )
           """)
    long hasPermission(Long userId, String endpoint, String method);
}
