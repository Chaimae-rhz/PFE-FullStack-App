package fsm.assets.assetssci.entities;
// EmailAdmin.java
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter

@Table(name = "email_admin")
public class EmailAdmin {
    @Id
    private Long id;
    private String email;
    private String password;

    // Getters and Setters
}
