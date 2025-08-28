package fsm.assets.assetssci.entities;
import lombok.*;
import fsm.assets.assetssci.enums.Role;

import java.time.LocalDate;
import java.util.Date;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Data
public class UserDTO {
    private String lastName;
    private String firstName;
    private Role role;
    private String username;
    private String phoneNumber;
    private String programeId;
    private String code;
    private String email;
    private String password;
    @Builder.Default
    private LocalDate dateInscription = LocalDate.now();


}
