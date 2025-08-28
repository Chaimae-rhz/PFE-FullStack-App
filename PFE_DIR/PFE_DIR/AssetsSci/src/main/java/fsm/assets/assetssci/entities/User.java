package fsm.assets.assetssci.entities;

import fsm.assets.assetssci.enums.Role;
import jakarta.persistence.*;
import lombok.*;


import java.time.ZoneId;
import java.util.Date;
@Entity
@NoArgsConstructor @AllArgsConstructor @ToString @Builder @Getter @Setter
@Table( name = "utilisateur")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String username;
    private String lastName;
    private String firstName;
    private String email;
    private String password;
    private boolean recoFaciale;
    private Role role;
    private String programeId;
    private String code;
    private Date dateInscription;
    private String phoneNumber;
    @Lob
    private byte[] profilePic;
    @Lob
    private byte[] faceID;

    public User(UserDTO userDTO) {
        this.username = userDTO.getUsername();
        this.password = userDTO.getPassword();
        this.role = userDTO.getRole();
        this.firstName = userDTO.getFirstName();
        this.lastName = userDTO.getLastName();
        this.email = userDTO.getEmail();
        this.dateInscription = Date.from(userDTO.getDateInscription().atStartOfDay(ZoneId.systemDefault()).toInstant());
    }
}
