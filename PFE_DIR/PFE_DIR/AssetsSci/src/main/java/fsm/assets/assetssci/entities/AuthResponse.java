package fsm.assets.assetssci.entities;

import lombok.Data;


@Data

public class AuthResponse {

    private String id;
    private String email;
    private boolean isSuperAdmin;
    public AuthResponse(String id, String email, boolean isSuperAdmin) {
        this.id = id;
        this.email = email;
        this.isSuperAdmin = isSuperAdmin;
    }

}