package fsm.assets.assetssci.entities;


import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class loginDTO {
    private String username;
    private String password;
}
