package fsm.assets.assetssci.services;


import fsm.assets.assetssci.entities.Admin;
import fsm.assets.assetssci.entities.Demande;
import fsm.assets.assetssci.entities.User;
import fsm.assets.assetssci.entities.loginDTO;
import fsm.assets.assetssci.enums.DemandePriority;
import fsm.assets.assetssci.enums.DemandeStatus;
import fsm.assets.assetssci.repository.AdminRepository;
import fsm.assets.assetssci.repository.DemandeRepository;
import fsm.assets.assetssci.repository.UserRepository;
import fsm.assets.assetssci.response.LoginResponce;
import fsm.assets.assetssci.web.ResourceNotFoundException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.ZoneId;
import java.util.*;
import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
@Service
@Transactional

public class DemandeService {
    private DemandeRepository demandeRepository;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private final JavaMailSender javaMailSender;
    private AdminRepository adminRepository;

    public DemandeService(DemandeRepository demandeRepository, UserRepository userRepository,
                          PasswordEncoder passwordEncoder, JavaMailSender javaMailSender, AdminRepository adminRepository) {
        this.demandeRepository = demandeRepository;
        this.userRepository = userRepository;
        this.passwordEncoder=passwordEncoder;
        this.javaMailSender = javaMailSender;
        this.adminRepository = adminRepository;
    }



    public Demande saveDemande(MultipartFile file, Date createdAt, String title, String description, DemandePriority priority,
                               Long userId) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        if(fileName.contains(".."))
        {
            System.out.println("not a a valid file");
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            // Si l'utilisateur n'existe pas, lancer une exception
            throw new RuntimeException("L'utilisateur avec l'ID " + userId + " n'existe pas");
        }
        User user = userOptional.get();
        Demande demande = Demande.builder()
                .createdAt(createdAt)
                .title((title))
                .description(description)
                .user(user)
                .priority(priority)
                .build();

        try {
            demande.setFile_imageBefore(Base64.getEncoder().encodeToString(file.getBytes()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return demandeRepository.save(demande);
    }

    public Demande updateDemandeStatus(DemandeStatus status, Long id) {
        Demande demande = demandeRepository.findById(id).get();
        demande.setStatus(status);
        return demandeRepository.save(demande);
    }
    public  byte[]   getDemandeFile(@PathVariable Long demandeId) throws IOException {
        Demande demande=demandeRepository.findById(demandeId).get();
        return Files.readAllBytes(Path.of(URI.create(demande.getFile_imageBefore())));
    }



    public  LoginResponce loginUser(loginDTO loginDTO) {
        User user = userRepository.findByUsername(loginDTO.getUsername());
        if (user != null) {
            String storedPassword = user.getPassword();
            String enteredPassword = loginDTO.getPassword();
            if (storedPassword.equals(enteredPassword)) {
                return new LoginResponce("Login Success", true);
            } else {
                return new LoginResponce("Login Failed", false);
            }
        } else {
            return new LoginResponce("Username not exists", false);
        }


    }

    public List<Demande> getDemandesByUserUsernameAndStatus(String username, DemandeStatus status) {
        return demandeRepository.findByUserUsernameAndStatus(username, status);
    }

    @Transactional
    public boolean updateDateResubmission(Long demandeId) {
        Demande demande = demandeRepository.findDemandeById(demandeId);
        if (demande != null) {
            demande.setDateResubmission(new Date());
            demandeRepository.save(demande);
            return true; // La demande a été mise à jour
        } else {
            return false; // La demande n'a pas été trouvée
        }
    }

    public boolean initializeCreatedAtDateToTwoWeeksAgo(Long demandeId) {
        // Récupérer la demande par son ID
        Demande demande = demandeRepository.findDemandeById(demandeId);

        // Vérifier si la demande existe
        if (demande != null) {
            // Convertir LocalDate en Date
            LocalDate deuxSemainesAuparavant = LocalDate.now().minusWeeks(2);
            Date dateDeuxSemainesAuparavant = Date.from(deuxSemainesAuparavant.atStartOfDay(ZoneId.systemDefault()).toInstant());

            // Mettre à jour la date de création
            demande.setCreatedAt(dateDeuxSemainesAuparavant);

            // Enregistrer les modifications dans la base de données
            demandeRepository.save(demande);
            return true;
        } else {
            // Gérer le cas où la demande n'est pas trouvée
            return false;
        }
    }
    public Demande TESTupdateDemandeToProcessedAndInsertImage(Long demandeId, String newImageAfter) {
        Optional<Demande> demandeOptional = demandeRepository.findById(demandeId);
        if (demandeOptional.isPresent()) {
            Demande demande = demandeOptional.get();
            demande.setStatus(DemandeStatus.EN_COURS);
            demande.setFile_imageAfter(newImageAfter);
            return demandeRepository.save(demande);
        } else {
            return null;
        }
    }

    // envoie d'email


    public void sendEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // Le second paramètre `true` indique que le contenu est HTML

        javaMailSender.send(message);
    }
    public Demande getDemandeById(Long id) {
        return demandeRepository.findById(id).orElse(null);
    }
    public Demande updatePrixReparation(Long id, Double prixReparation) {
        // Recherche de la demande par son ID
        Optional<Demande> optionalDemande = demandeRepository.findById(id);
        if (optionalDemande.isPresent()) {
            Demande demande = optionalDemande.get();
            // Mise à jour du prix de réparation
            demande.setPrixReparation(prixReparation);
            // Sauvegarde de la demande mise à jour dans la base de données
            return demandeRepository.save(demande);
        } else {
            // Gérer le cas où la demande n'est pas trouvée
            throw new IllegalArgumentException("Demande not found with ID: " + id);
        }
    }
    //add
    public long countDemandesByUserAndStatus(String username, DemandeStatus status) {
        return demandeRepository.countByUserUsernameAndStatus(username, status);
    }
    public long countDemandesByUser(String username) {
        return demandeRepository.countByUserUsername(username);
    }
    public long countDemandesByUserAndPriority(String username, DemandePriority priority) {
        return demandeRepository.countByUserUsernameAndPriority(username, priority);
    }
    public long countDemandesRenvoyeesByUser(String username) {
        return demandeRepository.countByUserUsernameAndDateResubmissionIsNotNull(username);
    }

    public Admin authenticate(String email, String password) {
        return adminRepository.findByEmail(email)
                .filter(admin -> admin.getPassword().equals(password))
                .orElse(null);
    }
    public Admin updateAdminProfile(Long id, Admin adminDetails) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found for this id :: " + id));

        admin.setEmail(adminDetails.getEmail());
        admin.setPassword(adminDetails.getPassword()); // Assurez-vous de hasher le mot de passe ici
        // Mettez à jour d'autres champs si nécessaire

        return adminRepository.save(admin);
    }

    public boolean emailExistsForDifferentUser(String email, String username) {
        User user = userRepository.findByEmail(email);
        return user != null && !user.getUsername().equals(username);
    }
}
