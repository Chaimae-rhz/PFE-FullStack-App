package fsm.assets.assetssci.config;


// EmailConfig.java
import fsm.assets.assetssci.entities.EmailAdmin;
import fsm.assets.assetssci.services.EmailAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import jakarta.annotation.PostConstruct;

@Configuration
public class EmailConfig {
    @Autowired
    private Environment env;

    @Autowired
    private EmailAdminService emailAdminService;

    @PostConstruct
    public void init() {
        EmailAdmin emailAdmin = emailAdminService.getEmailAdmin();
        System.setProperty("spring.mail.username", emailAdmin.getEmail());
        System.setProperty("spring.mail.password", emailAdmin.getPassword());
        System.setProperty("spring.mail.from", emailAdmin.getEmail());
    }
}

