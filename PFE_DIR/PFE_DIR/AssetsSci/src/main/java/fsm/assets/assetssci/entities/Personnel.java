package fsm.assets.assetssci.entities;

import fsm.assets.assetssci.enums.PersonnelPosition;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;
@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Getter
@Setter
@Table(name="personnel")
public class Personnel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String usernamePers;
    private String firstName;
    private String lastName;
    private String  dateOfBirth;
    private String photo;
    private String phoneNumber;
    private PersonnelPosition position;
    private Date hireDate;
    private String email;
}
