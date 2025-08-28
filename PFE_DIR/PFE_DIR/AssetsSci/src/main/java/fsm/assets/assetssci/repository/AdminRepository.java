package fsm.assets.assetssci.repository;

import fsm.assets.assetssci.entities.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByEmail(String email);
    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByResetToken(String resetToken);
//ajouter recemment
    @Query("SELECT COUNT(a) FROM Admin a WHERE a.superAdmin = true")
    long countSuperAdmins();
}
