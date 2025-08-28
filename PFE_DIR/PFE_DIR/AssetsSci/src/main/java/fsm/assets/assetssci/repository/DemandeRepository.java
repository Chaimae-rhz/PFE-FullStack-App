package fsm.assets.assetssci.repository;

import fsm.assets.assetssci.entities.Demande;
import fsm.assets.assetssci.entities.User;
import fsm.assets.assetssci.enums.DemandePriority;
import fsm.assets.assetssci.enums.DemandeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DemandeRepository extends JpaRepository<Demande,Long> {

    List<Demande> findByPersonnelId(Long id);
    List<Demande> findByStatus(DemandeStatus status);
    List<Demande> findByPriority(DemandePriority priority);

    List<Demande> findByUserId(Long id);

    List<Demande> findByUserUsernameAndStatus(String username, DemandeStatus statut);
    Demande findDemandeById(Long id);

    List<Demande> findByUser(User user);
    @Modifying
    @Query("UPDATE Demande d SET d.user = null WHERE d.user = :user")
    @Transactional
    void updateByUser(@Param("user") User user);
    long countByStatus(DemandeStatus status);
    long countByPriority(DemandePriority priority);

    //add
    @Query("SELECT COUNT(d) FROM Demande d WHERE d.user.username = :username AND d.status = :status")
    long countByUserUsernameAndStatus(@Param("username") String username, @Param("status") DemandeStatus status);
    @Query("SELECT COUNT(d) FROM Demande d WHERE d.user.username = :username")
    long countByUserUsername(@Param("username") String username);
    @Query("SELECT COUNT(d) FROM Demande d WHERE d.user.username = :username AND d.priority = :priority")
    long countByUserUsernameAndPriority(@Param("username") String username, @Param("priority") DemandePriority priority);
    @Query("SELECT COUNT(d) FROM Demande d WHERE d.user.username = :username AND d.dateResubmission IS NOT NULL")
    long countByUserUsernameAndDateResubmissionIsNotNull(@Param("username") String username);
}
