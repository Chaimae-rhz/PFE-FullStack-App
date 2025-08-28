package fsm.assets.assetssci.entities;


import fsm.assets.assetssci.enums.Role;
import lombok.Data;
@Data
public class UpdateUserDTO {
    private String username;
    private String lastName;
    private String firstName;
    private String email;
    private String password;
    private boolean recoFaciale;
    private Role role;
    private String programeId;
    private String code;
    private String phoneNumber;
}