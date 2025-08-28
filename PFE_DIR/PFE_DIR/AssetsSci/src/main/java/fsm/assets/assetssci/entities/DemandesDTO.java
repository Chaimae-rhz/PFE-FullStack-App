package fsm.assets.assetssci.entities;


import fsm.assets.assetssci.enums.DemandePriority;
import fsm.assets.assetssci.enums.DemandeStatus;
import lombok.Data;
import java.util.Date;
@Data
public class DemandesDTO {

    private String title;
    private String description;
    private Date createdAt;
    private Date dateResubmission;
    private DemandeStatus status;
    private DemandePriority priority;
    private String file_imageBefore;
    private String file_imageAfter;
    private String  remarque;
    private UsersDTO user;
}