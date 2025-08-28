package fsm.assets.assetssci.repository;


import fsm.assets.assetssci.entities.PersonneFSM;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface PersonneFSMRepository extends JpaRepository<PersonneFSM, Long>{
    List<PersonneFSM> personnes = new ArrayList<>();

    List<PersonneFSM> findAll() ;

    Optional<PersonneFSM> findByPprAndDateNaissance(String ppr,String dateNaissance);


    Optional<Object> findByPpr(String ppr);

    boolean existsByPpr(String ppr);
}