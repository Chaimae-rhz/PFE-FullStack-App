package fsm.assets.assetssci.response;


import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Getter
@Setter
public class LoginResponce {
    String message;
    Boolean token;

}
