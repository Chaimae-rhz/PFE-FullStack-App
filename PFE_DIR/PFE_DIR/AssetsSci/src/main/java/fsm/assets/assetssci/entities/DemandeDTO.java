package fsm.assets.assetssci.entities;
import fsm.assets.assetssci.enums.DemandePriority;

import fsm.assets.assetssci.enums.DemandeStatus;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Data
public class DemandeDTO {
    private Long id;
    private String title;
    private String description;
    private DemandePriority priority;
    private DemandeStatus status;
    private String file_imageBefore;

    @Builder.Default
    private Date createdAt = new Date();
}
