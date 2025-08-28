package fsm.assets.assetssci;

import fsm.assets.assetssci.entities.Demande;
import fsm.assets.assetssci.entities.User;
import fsm.assets.assetssci.enums.DemandePriority;
import fsm.assets.assetssci.enums.DemandeStatus;
import fsm.assets.assetssci.enums.Role;
import fsm.assets.assetssci.repository.DemandeRepository;
import fsm.assets.assetssci.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;


import java.util.Date;

@SpringBootApplication

public class AssetsSciApplication {

	public static void main(String[] args) {
		SpringApplication.run(AssetsSciApplication.class, args);
	}



}
