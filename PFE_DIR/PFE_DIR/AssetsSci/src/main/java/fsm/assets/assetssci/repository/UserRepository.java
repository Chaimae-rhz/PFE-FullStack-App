package fsm.assets.assetssci.repository;

import fsm.assets.assetssci.entities.User;
import fsm.assets.assetssci.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    User findByCode(String code);
    Optional<User> findById(Long id);
    List<User>  findByProgrameId(String programeId);
    User findByEmail(String email);
    User findByUsername(String username);
    List<User> findByRole(Role role);
    List<User> findByRecoFaciale(boolean recoFaciale);
    List<User> findByDateInscription(Date dateInscription);

    boolean existsByEmail(String email);

    Optional<User> findOneByUsernameAndPassword(String email, String password);

    boolean existsByUsername(String username);
}
