package fsm.assets.assetssci.services;

// EmailAdminService.java
import fsm.assets.assetssci.entities.EmailAdmin;
import fsm.assets.assetssci.repository.EmailAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailAdminService {
    @Autowired
    private EmailAdminRepository emailAdminRepository;

    public EmailAdmin getEmailAdmin() {
        return emailAdminRepository.findById(1L).orElseThrow(() -> new RuntimeException("EmailAdmin not found"));
    }
    public EmailAdmin updateEmailAdmin(String newEmail, String newPassword) {
        EmailAdmin emailAdmin = getEmailAdmin();
        emailAdmin.setEmail(newEmail);
        emailAdmin.setPassword(newPassword);
        return emailAdminRepository.save(emailAdmin);
    }

}

