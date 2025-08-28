package fsm.assets.assetssci.entities;

import fsm.assets.assetssci.enums.DemandePriority;
import fsm.assets.assetssci.enums.DemandeStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Getter
@Setter

@Table(name="demandes")
public class Demande {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String title;
        private String description;
        @Column(name = "created_at")
        private Date createdAt;
        private Date dateResubmission;
        private DemandeStatus status;
        private DemandePriority priority;
        private Double prixReparation;
        private String file_imageBefore;
        private String file_imageAfter;
        private String  remarque;

        @ManyToOne
        private User user;
        @ManyToOne
        private Personnel personnel;
}
