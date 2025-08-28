package fsm.assets.assetssci.entities;

import fsm.assets.assetssci.enums.Role;
import lombok.Data;
import java.util.Date;

@Data
public class UsersDTO {
    private String username;
    private String email;
    private String password;
    private Role role;
    private Date dateInscription;
    private String phoneNumber;
    public UsersDTO() {
// Constructeur par défaut
    }
    public UsersDTO(String username) {
        this.username = username;
    }
}