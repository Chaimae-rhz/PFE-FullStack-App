package fsm.assets.assetssci.entities;

import lombok.Data;

@Data
public class ResetPasswordConfirmRequest {

        private String token;
        private String newPassword;

        // Getters and setters


}
