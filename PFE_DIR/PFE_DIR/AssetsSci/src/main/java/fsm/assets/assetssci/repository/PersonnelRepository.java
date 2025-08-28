package fsm.assets.assetssci.repository;

import fsm.assets.assetssci.entities.Personnel;
import fsm.assets.assetssci.enums.PersonnelPosition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface PersonnelRepository extends JpaRepository<Personnel,Long> {
    Optional<Personnel> findById(Long id);
    Personnel findByUsernamePers(String usernamePers);
   List<Personnel> findByPosition(PersonnelPosition position);
   Personnel findByEmail(String email);
   List<Personnel> findByHireDate(Date hireDate);

    boolean existsByEmail(String email);
}
