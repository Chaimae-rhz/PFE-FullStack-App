package fsm.assets.assetssci.web;

import fsm.assets.assetssci.entities.*;
import fsm.assets.assetssci.enums.DemandePriority;
import fsm.assets.assetssci.enums.DemandeStatus;
import fsm.assets.assetssci.enums.PersonnelPosition;
import fsm.assets.assetssci.exeptions.ResourceNotFoundException;
import fsm.assets.assetssci.repository.*;
import fsm.assets.assetssci.response.LoginResponce;
import fsm.assets.assetssci.services.DemandeService;
import fsm.assets.assetssci.services.EmailAdminService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;


@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201","http://172.30.70.16:4201","http://localhost","http://172.30.70.16:4200"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RestController
public class DemandeRestController {
    private DemandeRepository demandeRepository;
    private UserRepository userRepository;
    private PersonnelRepository personnelRepository;
    private DemandeService demandeService;
    private PersonneFSMRepository personneFSMRepository;
    @Autowired
    private EmailAdminService emailAdminService;
    private AdminRepository adminRepository;
    private boolean maintenanceMode = false;
    public DemandeRestController(UserRepository userRepository, DemandeRepository demandeRepository,
                                 PersonnelRepository personnelRepository, DemandeService demandeService,
                                 PersonneFSMRepository personneFSMRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.demandeRepository = demandeRepository;
        this.personnelRepository = personnelRepository;
        this.demandeService = demandeService;
        this.personneFSMRepository = personneFSMRepository;

        this.adminRepository = adminRepository;
    }

    @GetMapping("/demandes")
    public List<Demande> allDemande() {
        return demandeRepository.findAll();
    }

    @GetMapping("/users/{id}/demandes")
    public List<Demande> demandesByUser(@PathVariable Long id) {
        return demandeRepository.findByUserId(id);
    }

    @GetMapping("/demandes/byStatus")
    public List<Demande> demandesByStatus(@RequestParam DemandeStatus status) {
        return demandeRepository.findByStatus(status);
    }

    @GetMapping("/demandes/byPriority")
    public List<Demande> demandesByPriority(@RequestParam DemandePriority priority) {
        return demandeRepository.findByPriority(priority);
    }

    @GetMapping("/demandes/{id}")
    public Demande getDemandeById(@PathVariable Long id) {
        return demandeRepository.findById(id).get();
    }

    @GetMapping("/users")
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/usersById/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id);
    }

    @GetMapping("/usersbyusername/{username}")
    public User getUserByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username);
    }

    @GetMapping("/users/{code}")
    public User getUserByCode(@PathVariable String code) {
        return userRepository.findByCode(code);
    }

    @GetMapping("/users/{programeId}")
    public List<User> getUserByProgrameId(@PathVariable String programeId) {
        return userRepository.findByProgrameId(programeId);
    }

    @GetMapping("/personnels")
    public List<Personnel> allPersonnels() {
        return personnelRepository.findAll();
    }

    @GetMapping("/personnelsById/{id}")
    public Optional<Personnel> getPersonnelById(@PathVariable Long id) {
        return personnelRepository.findById(id);
    }

    @GetMapping("/personnels/{position}")
    public List<Personnel> getPersonnelByPosition(@PathVariable PersonnelPosition position) {
        return personnelRepository.findByPosition(position);
    }

    @GetMapping("/personnels/{hireDate}")
    public List<Personnel> getPersonnelByHireDate(@PathVariable Date hireDate) {
        return personnelRepository.findByHireDate(hireDate);
    }

    @GetMapping("/personnels/{id}/demandesAttribuees")
    public List<Demande> demandesByPersonnel(@PathVariable Long id) {
        return demandeRepository.findByPersonnelId(id);
    }

    @PutMapping("updateDemandeStatus/{id}")
    public Demande updateDemandeStatus(@RequestParam DemandeStatus status, @PathVariable Long id) {
        return demandeService.updateDemandeStatus(status, id);
    }

    @PostMapping(path = "/demandes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Demande saveDemande(@RequestParam MultipartFile file_imageBefore, Date createdAt, String title, String description, DemandePriority priority,
                               Long userId) throws IOException {
        return this.demandeService.saveDemande(file_imageBefore, createdAt, title, description, priority, userId);

    }

    @GetMapping(path = "/demandeFile/{demandeId}", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] getDemandeFile(@PathVariable Long demandeId) throws IOException {
        return demandeService.getDemandeFile(demandeId);
    }

    @PostMapping(path = "/addDemande", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Demande addDemande(@RequestBody DemandeDTO DemandeDTO) {

        Demande demande = new Demande();
        demande.setTitle(DemandeDTO.getTitle());
        demande.setDescription(DemandeDTO.getDescription());
        demande.setPriority(DemandeDTO.getPriority());
        demande.setStatus(DemandeStatus.EN_ATTENTE);
        // Assignation de la date de création
        demande.setCreatedAt(new Date());
        demande.setFile_imageBefore(DemandeDTO.getFile_imageBefore());

        return demandeRepository.save(demande);
    }


    @PostMapping("/{demandeId}/assign/{username}")
    public ResponseEntity<String> assignUserToDemande(@PathVariable Long demandeId, @PathVariable String username) throws MessagingException {
        // Chercher la demande
        Demande demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande not found with id " + demandeId));

        // Chercher l'utilisateur par son username
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with username " + username);
        }

        demande.setUser(user);
        // Enregistrer les modifications dans la base de données
        demandeRepository.save(demande);

        // Envoyer l'e-mail de notification
        sendEmailNotification_creationDemande(user, demande);

        return ResponseEntity.status(HttpStatus.OK).body("User " + username + " assigned to demande " + demandeId);
    }

    private void sendEmailNotification_creationDemande(User user, Demande demande) throws MessagingException {
        String subject = "Nouvelle Demande Créée: " + demande.getTitle();

        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}" +
                ".container {width: 100%; padding: 20px; background-color: #ffffff; border-radius: 10px; margin: 0 auto;}" +
                ".header {background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;}" +
                ".content {padding: 20px;}" +
                ".footer {background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Nouvelle Demande Créée</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Bonjour " + user.getFirstName() + ",</p>" +
                "<p>Nous avons bien reçu votre demande. Voici les détails :</p>" +
                "<p><strong>Titre :</strong> " + demande.getTitle() + "<br>" +
                "<strong>ID :</strong> " + demande.getId() + "<br>" +
                "<strong>Date de Création :</strong> " + demande.getCreatedAt() + "<br>" +
                "<strong>Statut :</strong> " + demande.getStatus() + "<br>" +
                "<strong>Priorité :</strong> " + demande.getPriority() + "</p>" +
                "<p>Nous vous informerons dès qu'il y aura un changement.</p>" +
                "<p>Cordialement,</p>" +
                "<p>AssetsSci</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2023 AssetsSci. Tous droits réservés.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(user.getEmail());
        emailRequest.setSubject(subject);
        emailRequest.setBody(body);

        demandeService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
    }


    @PostMapping("/signupUsers")
    public ResponseEntity<?> addUser(@RequestBody UserDTO userDTO) {
        User user = new User();
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("this email exists");
        }
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("this username exists");
        }

        user.setLastName(userDTO.getLastName());
        user.setFirstName(userDTO.getFirstName());
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setRole(userDTO.getRole());
        user.setCode(userDTO.getCode());
        user.setProgrameId(userDTO.getProgrameId());
        user.setPhoneNumber(userDTO.getPhoneNumber());

        user.setDateInscription(new Date());

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody loginDTO loginDTO) {
        LoginResponce loginMessage = demandeService.loginUser(loginDTO);
        return ResponseEntity.ok(loginMessage);
    }


    @GetMapping("/user/{username}/status/{status}")
    public List<Demande> getDemandesByUserUsernameAndStatus(@PathVariable String username, @PathVariable DemandeStatus status) {
        return demandeService.getDemandesByUserUsernameAndStatus(username, status);
    }

    @PutMapping("/updateDateResubmission/{id}")
    public ResponseEntity<Object> updateDateResubmission(@PathVariable Long id) {
        boolean updated = demandeService.updateDateResubmission(id);
        if (updated) {
            return ResponseEntity.ok().body(Map.of("message", "La date de resubmission a été mise à jour avec succès pour la demande avec l'ID: " + id));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/TESTinitializeCreatedAtDateToTwoWeeksAgo/{id}")
    public ResponseEntity<String> TESTinitializeCreatedAtDateToTwoWeeksAgo(@PathVariable Long id) {
        boolean success = demandeService.initializeCreatedAtDateToTwoWeeksAgo(id);
        if (success) {
            return ResponseEntity.ok("La date de création de la demande a ete initialisee a deux jours avant avec succes.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La demande avec l'ID fourni n'a pas ete trouvee.");
        }
    }


    @PutMapping("/TEST/{id}/process")
    public ResponseEntity<Object> processDemande(@PathVariable("id") Long id, @RequestBody String newImageAfter) {
        Demande updatedDemande = demandeService.TESTupdateDemandeToProcessedAndInsertImage(id, newImageAfter);
        if (updatedDemande != null) {
            return ResponseEntity.ok(updatedDemande); // La demande a été mise à jour avec succès
        } else {
            return ResponseEntity.notFound().build(); // Aucune demande trouvée avec l'ID donné
        }
    }


    // *******************       admin  *************************************************
    // ******************


    @PostMapping("/ADMINaddUsers")
    public ResponseEntity<?> ADMINaddUser(@RequestBody UsersDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce nom d'utilisateur existe déjà");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cet email existe déjà");
        }
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setRole(userDTO.getRole());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setDateInscription(new Date());
        User savedUser = userRepository.save(user);
        try {
            sendUserCreationEmail(savedUser, userDTO.getPassword());
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(savedUser);
    }
    private void sendUserCreationEmail(User user, String password) throws MessagingException {
        String subject = "Création de compte utilisateur";

        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}" +
                ".container {width: 100%; padding: 20px; background-color: #ffffff; border-radius: 10px; margin: 0 auto;}" +
                ".header {background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;}" +
                ".content {padding: 20px;}" +
                ".footer {background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Création de compte utilisateur</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Cher " + user.getUsername() + ",</p>" +
                "<p>Votre compte utilisateur a été créé avec succès. Vous trouverez ci-dessous vos détails de connexion :</p>" +
                "<p><strong>Nom d'utilisateur :</strong> " + user.getUsername() + "<br>" +
                "<strong>Mot de passe :</strong> " + password + "</p>" +
                "<p>Cordialement,</p>" +
                "<p>AssetsSci</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2023 AssetsSci. Tous droits réservés.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(user.getEmail());
        emailRequest.setSubject(subject);
        emailRequest.setBody(body);

        demandeService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
    }

    @PutMapping("/updateUsers/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO updateUserDTO) throws MessagingException {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        // Vérification de l'unicité du nom d'utilisateur
        if (!user.getUsername().equals(updateUserDTO.getUsername()) && userRepository.existsByUsername(updateUserDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce nom d'utilisateur existe déjà");
        }

        // Vérification de l'unicité de l'email
        if (!user.getEmail().equals(updateUserDTO.getEmail()) && userRepository.existsByEmail(updateUserDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cet email existe déjà");
        }

        user.setUsername(updateUserDTO.getUsername());
        user.setEmail(updateUserDTO.getEmail());
        user.setFirstName(updateUserDTO.getFirstName());
        user.setLastName(updateUserDTO.getLastName());
        user.setPassword(updateUserDTO.getPassword());
        user.setRole(updateUserDTO.getRole());
        user.setRecoFaciale(updateUserDTO.isRecoFaciale());
        user.setCode(updateUserDTO.getCode());
        user.setProgrameId(updateUserDTO.getProgrameId());
        user.setPhoneNumber(updateUserDTO.getPhoneNumber());

        User savedUser = userRepository.save(user);
        sendUserUpdateEmail(savedUser);
        return ResponseEntity.ok(savedUser);
    }
    private void sendUserUpdateEmail(User user) throws MessagingException {
        String subject = "Modification de compte utilisateur";

        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}" +
                ".container {width: 100%; padding: 20px; background-color: #ffffff; border-radius: 10px; margin: 0 auto;}" +
                ".header {background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;}" +
                ".content {padding: 20px;}" +
                ".footer {background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Modification de compte utilisateur</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Bonjour " + user.getUsername() + ",</p>" +
                "<p>Les informations de votre compte utilisateur ont été modifiées avec succès. Voici les détails :</p>" +
                "<p><strong>Nom d'utilisateur :</strong> " + user.getUsername() + "<br>" +
                "<strong>Email :</strong> " + user.getEmail() + "<br>" +
                "<strong>Mot de passe :</strong> " + user.getPassword() + "<br>" +
                "<strong>Rôle :</strong> " + user.getRole() + "<br>" +
                "<strong>Téléphone :</strong> " + user.getPhoneNumber() + "<br>" +
                "<strong>Filière :</strong> " + user.getProgrameId() + "</p>" +
                "<p>Cordialement,</p>" +
                "<p>AssetsSci</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2023 AssetsSci. Tous droits réservés.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(user.getEmail());
        emailRequest.setSubject(subject);
        emailRequest.setBody(body);

        demandeService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
    }


    @DeleteMapping("/deleteUser/{id}")
    @Transactional
    public ResponseEntity<Map<String, Boolean>> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not exist with id: " + id));
        // Supprimer les demandes associées à l'utilisateur


        demandeRepository.updateByUser(user);
        userRepository.delete(user);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deleteDemande/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteDemande(@PathVariable Long id) {
        Demande demande = demandeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Demande not exist with id: " + id));


        // Supprimer la demande
        demandeRepository.delete(demande);


        // Répondre avec une réponse indiquant que la demande a été supprimée avec succès
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    //ajouter un personnel
    @PostMapping("/addPersonnel")
    public ResponseEntity<?> addPersonnel(@RequestBody Personnel personnel) {
        if (personnelRepository.existsByEmail(personnel.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("L\'adresse email existe déjà.");
        }
        personnel.setUsernamePers(personnel.getUsernamePers());
        personnel.setEmail(personnel.getEmail());
        personnel.setFirstName(personnel.getFirstName());
        personnel.setLastName(personnel.getLastName());
        personnel.setDateOfBirth(personnel.getDateOfBirth());
        personnel.setPhoneNumber((personnel.getPhoneNumber()));
        personnel.setPosition(personnel.getPosition());
        personnel.setHireDate(new Date());
        Personnel savedPersonnel = personnelRepository.save(personnel);
        return ResponseEntity.ok(savedPersonnel);
    }


    @DeleteMapping("/deletePersonnel/{id}")
    public ResponseEntity<Map<String, Boolean>> deletePersonnel(@PathVariable Long id) {
        Personnel personnel = personnelRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Personnel not exist with id: " + id));
        // Supprimer la demande
        personnelRepository.delete(personnel);
        // Répondre avec une réponse indiquant que la demande a été supprimée avec succès
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @PutMapping(path="/{id}/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Demande> updateDemande(
            @PathVariable Long id,
            @RequestBody DemandesDTO demandeDTO
    ) throws MessagingException {
        Optional<Demande> optionalDemande = demandeRepository.findById(id);
        if (optionalDemande.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Demande demande = optionalDemande.get();
        // Mettre à jour les champs de la demande
        demande.setTitle(demandeDTO.getTitle());
        demande.setDescription(demandeDTO.getDescription());
        demande.setCreatedAt(demandeDTO.getCreatedAt());
        demande.setDateResubmission(demandeDTO.getDateResubmission());
        demande.setStatus(demandeDTO.getStatus());
        demande.setPriority(demandeDTO.getPriority());
        demande.setFile_imageBefore(demandeDTO.getFile_imageBefore());
        demande.setFile_imageAfter(demandeDTO.getFile_imageAfter());
        demande.setRemarque(demandeDTO.getRemarque());

        UsersDTO userDTO = demandeDTO.getUser();
        if (userDTO != null) {
            User user = demande.getUser();
            user.setUsername(userDTO.getUsername());
            user.setEmail(userDTO.getEmail());  // S'assurer que l'email est mis à jour si nécessaire
            demande.setUser(user);
        }

        Demande savedDemande = demandeRepository.save(demande);

        // Préparer et envoyer l'email
        sendEmailForUpdatedDemande(demande.getUser(), demande);

        return ResponseEntity.ok(savedDemande);
    }

    // Méthode pour envoyer l'email
    private void sendEmailForUpdatedDemande(User user, Demande demande) throws MessagingException {
        String subject = "Votre demande a été mise à jour";

        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}" +
                ".container {width: 100%; padding: 20px; background-color: #ffffff; border-radius: 10px; margin: 0 auto;}" +
                ".header {background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;}" +
                ".content {padding: 20px;}" +
                ".footer {background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Votre demande a été mise à jour</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Bonjour " + user.getFirstName() + ",</p>" +
                "<p>Votre demande \"" + demande.getTitle() + "\" a été mise à jour.</p>" +
                "<p><strong>Statut :</strong> " + demande.getStatus() + "</p>" +
                "<p>Cordialement,</p>" +
                "<p>AssetsSci</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2023 AssetsSci. Tous droits réservés.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        EmailRequest emailRequest = new EmailRequest(user.getEmail(), subject, body);
        demandeService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
    }




    @PutMapping("/updatePersonnels/{id}")
    public ResponseEntity<Personnel> updatePersonnel(@PathVariable Long id, @RequestBody Personnel updatePersonnel) {
        Optional<Personnel> optionalPersonnel = personnelRepository.findById(id);

        if (optionalPersonnel.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Personnel personnel = optionalPersonnel.get();
        personnel.setUsernamePers(updatePersonnel.getUsernamePers());
        personnel.setEmail(updatePersonnel.getEmail());
        personnel.setFirstName(updatePersonnel.getFirstName());
        personnel.setLastName(updatePersonnel.getLastName());

        personnel.setPosition(updatePersonnel.getPosition());

        personnel.setPhoneNumber(updatePersonnel.getPhoneNumber());

        personnel.setDateOfBirth(updatePersonnel.getDateOfBirth());


        Personnel savedPersonnel = personnelRepository.save(personnel);
        return ResponseEntity.ok(savedPersonnel);
    }


    @PostMapping("/send-email")
    public void sendEmail(@RequestBody EmailRequest emailRequest) throws MessagingException {
        demandeService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
    }


    @GetMapping("/users/email/{username}")
    public String getUserEmailByUsername(@PathVariable String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            return user.getEmail();
        } else {
            return "Email not found for username: " + username;
        }
    }

    @PostMapping("/send-email-to-user")
    public void sendEmailToUser(@RequestParam String username, @RequestParam String subject, @RequestParam String body) throws MessagingException {
        // Récupérer l'e-mail de l'utilisateur en utilisant le nom d'utilisateur
        String userEmail = getUserEmailByUsername(username);

        // Vérifier si l'e-mail de l'utilisateur a été récupéré avec succès
        if (userEmail != null) {
            // Envoyer l'e-mail à l'utilisateur
            demandeService.sendEmail(userEmail, subject, body);
        }
    }

    @GetMapping("/statistics/requests/total")
    public long getTotalRequests() {
        return demandeRepository.count();
    }

    @GetMapping("/statistics/requests/byStatus")
    public long getRequestsByStatus(@RequestParam DemandeStatus status) {
        return demandeRepository.countByStatus(status);
    }


    @GetMapping("/statistics/requests/byPriority")
    public long getRequestsByPriority(@RequestParam DemandePriority priority) {
        return demandeRepository.countByPriority(priority);
    }

    @GetMapping("/statistics/users/total")
    public long getTotalUsers() {
        return userRepository.count();
    }
    //ajouter recemment
    @GetMapping("/statistics/admin/total")
    public long getTotalAdmins() {
        return adminRepository.count();
    }


    @GetMapping("/statistics/admin/super")
    public long getTotalSuperAdmins() {
        return adminRepository.countSuperAdmins();
    }

    @GetMapping("/statistics/personnel/total")
    public long getTotalPersonnel() {
        return personnelRepository.count();
    }

    @GetMapping("/demandes/byDateAndPriority")
    public List<Demande> demandesByDateAndPriority() {
        // Récupérer la liste des demandes
        List<Demande> demandes = demandeRepository.findAll();

        // Trier les demandes en fonction de la date de resubmission (si présente) ou de la date de création
        Collections.sort(demandes, (d1, d2) -> {
            if (d1.getDateResubmission() == null && d2.getDateResubmission() == null) {
                // Si les deux dates de resubmission sont null, comparer par date de création et priorité
                int priorityComparison = d1.getPriority().compareTo(d2.getPriority());
                if (priorityComparison != 0) {
                    return priorityComparison;
                }
                return d1.getCreatedAt().compareTo(d2.getCreatedAt());
            } else if (d1.getDateResubmission() != null && d2.getDateResubmission() != null) {
                // Si les deux dates de resubmission ne sont pas null, comparer par date de resubmission et priorité
                int resubmissionComparison = d1.getDateResubmission().compareTo(d2.getDateResubmission());
                if (resubmissionComparison != 0) {
                    return resubmissionComparison;
                }
                return d1.getPriority().compareTo(d2.getPriority());
            } else if (d1.getDateResubmission() != null) {
                // Si seulement la date de resubmission de d1 n'est pas null, placer d1 avant d2
                return -1;
            } else {
                // Si seulement la date de resubmission de d2 n'est pas null, placer d2 avant d1
                return 1;
            }
        });

        return demandes;
    }

    @PutMapping("/demandes/assign")
    public ResponseEntity<?> assignDemandeToPersonnel(@RequestBody AssignDemandeDTO assignDemandeDTO) {
        Optional<Demande> optionalDemande = demandeRepository.findById(assignDemandeDTO.getDemandeId());
        if (optionalDemande.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Demande not found");
        }

        Optional<Personnel> optionalPersonnel = personnelRepository.findById(assignDemandeDTO.getPersonnelId());
        if (optionalPersonnel.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Personnel not found");
        }

        Demande demande = optionalDemande.get();
        Personnel personnel = optionalPersonnel.get();

        // Assigner le personnel à la demande
        demande.setPersonnel(personnel);

        // Sauvegarder la demande mise à jour
        Demande updatedDemande = demandeRepository.save(demande);

        return ResponseEntity.ok(updatedDemande);
    }

    @PutMapping("/demandes/{id}/prixReparation")
    public ResponseEntity<Demande> updatePrixReparation(@PathVariable Long id, @RequestBody Map<String, Double> payload) {
        Double prixReparation = payload.get("prixReparation");
        Demande updatedDemande = demandeService.updatePrixReparation(id, prixReparation);
        return ResponseEntity.ok(updatedDemande);
    }

    @PutMapping("/demandes/{id}/unassign")
    public ResponseEntity<Demande> unassignDemande(@PathVariable Long id) {
        Optional<Demande> optionalDemande = demandeRepository.findById(id);

        if (optionalDemande.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Demande demande = optionalDemande.get();
        demande.setPersonnel(null);  // Retirer l'assignation en définissant le personnel à null
        Demande updatedDemande = demandeRepository.save(demande);

        return ResponseEntity.ok(updatedDemande);
    }

    // add
    @GetMapping("/count")
    public long getCountByUserAndStatus(@RequestParam String username, @RequestParam DemandeStatus status) {
        return demandeService.countDemandesByUserAndStatus(username, status);
    }

    @GetMapping("/countByUser")
    public long getCountByUser(@RequestParam String username) {
        return demandeService.countDemandesByUser(username);
    }

    @GetMapping("/countByPriority")
    public long getCountByUserAndPriority(@RequestParam String username, @RequestParam DemandePriority priority) {
        return demandeService.countDemandesByUserAndPriority(username, priority);
    }

    @GetMapping("/countRenvoyees")
    public long getCountDemandesRenvoyeesByUser(@RequestParam String username) {
        return demandeService.countDemandesRenvoyeesByUser(username);
    }

    @GetMapping("/user/info/{username}")
    public ResponseEntity<User> getUserInfoByUsername(@PathVariable String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update/{username}")
    public ResponseEntity<User> updateUserByUsername(@PathVariable String username, @RequestBody User updatedUser) throws MessagingException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String oldEmail = user.getEmail();
        user.setLastName(updatedUser.getLastName());
        user.setFirstName(updatedUser.getFirstName());
        user.setEmail(updatedUser.getEmail());
        user.setPassword(updatedUser.getPassword());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        userRepository.save(user);


        sendEmailNotification(user);


        return ResponseEntity.ok(user);
    }

    private void sendEmailNotification(User user) throws MessagingException {
        String subject = "Informations personnelles modifiées";

        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}" +
                ".container {width: 100%; padding: 20px; background-color: #ffffff; border-radius: 10px; margin: 0 auto;}" +
                ".header {background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;}" +
                ".content {padding: 20px;}" +
                ".footer {background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Informations personnelles modifiées</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Cher/Chère " + user.getFirstName() + ",</p>" +
                "<p>Vos informations ont été mises à jour avec succès à : " + user.getEmail() + ".</p>" +
                "<p>Cordialement,</p>" +
                "<p>AssetsSci</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2023 AssetsSci. Tous droits réservés.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(user.getEmail());
        emailRequest.setSubject(subject);
        emailRequest.setBody(body);

        demandeService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
    }


    @GetMapping("/personneFSM/all")
    public List<PersonneFSM> getAllPersonnes() {
        return personneFSMRepository.findAll();
    }

    @PostMapping("/personneFSM/add")
    public PersonneFSM ajouterPersonneFSM(@RequestBody PersonneFSM nouvellePersonne) {
        // Enregistrement de la nouvelle personne dans la base de données
        return personneFSMRepository.save(nouvellePersonne);
    }

    @GetMapping("/personneFSM/exists")
    public boolean existsPersonne(@RequestParam String ppr, @RequestParam String dateNaissance) {
        return personneFSMRepository.findByPprAndDateNaissance(ppr, dateNaissance).isPresent();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found");
        }

        // Generate a reset code
        String resetCode = UUID.randomUUID().toString();
        user.setCode(resetCode);
        userRepository.save(user);

        // Send email with the reset code
        sendPasswordResetEmail(user);

        return ResponseEntity.ok("Reset code sent to your email");
    }


    private void sendPasswordResetEmail(User user) {
        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(user.getEmail());
        emailRequest.setSubject("Code de réinitialisation du mot de passe");

        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}" +
                ".container {width: 100%; padding: 20px; background-color: #ffffff; border-radius: 10px; margin: 0 auto;}" +
                ".header {background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;}" +
                ".content {padding: 20px;}" +
                ".footer {background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Réinitialisation de votre mot de passe</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Cher " + user.getFirstName() + ",</p>" +
                "<p>Votre nom d'utilisateur est <strong>" + user.getUsername() + "</strong>.</p>" +
                "<p>Votre code de réinitialisation est : <strong>" + user.getCode() + "</strong></p>" +
                "<p>Cordialement,</p>" +
                "<p>Assetssci</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2023 Assetssci. Tous droits réservés.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        emailRequest.setBody(body);

        try {
            demandeService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody String email, @RequestParam String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        user.setPassword(newPassword); // Hash the password in a real application
        user.setCode(null); // Clear the reset code
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successfully");
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<String> verifyResetCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        User user = userRepository.findByEmail(email);
        if (user == null || !user.getCode().equals(code)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid reset code");
        }
        return ResponseEntity.ok("Reset code verified");
    }

    //ajouter recement
    @PostMapping("/createAdmin")
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) throws MessagingException {
        if (adminRepository.existsByEmail(admin.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        Admin savedAdmin = adminRepository.save(admin);
        sendAdminCreationEmail(savedAdmin, admin.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAdmin);
    }

    private void sendAdminCreationEmail(Admin admin, String password) throws MessagingException {
        String subject = "Création de compte administrateur";

        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}" +
                ".container {width: 100%; padding: 20px; background-color: #ffffff; border-radius: 10px; margin: 0 auto;}" +
                ".header {background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;}" +
                ".content {padding: 20px;}" +
                ".footer {background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Création de compte administrateur</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Bonjour,</p>" +
                "<p>Vous êtes désormais un administrateur dans l'application. Vous trouverez ci-dessous vos détails de connexion :</p>" +
                "<p><strong>Email :</strong> " + admin.getEmail() + "<br>" +
                "<strong>Mot de passe :</strong> " + password + "</p>" +
                "<p>Cordialement,</p>" +
                "<p>AssetsSci</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2023 AssetsSci. Tous droits réservés.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(admin.getEmail());
        emailRequest.setSubject(subject);
        emailRequest.setBody(body);

        demandeService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
    }


    @PutMapping("/updateAdmin/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable Long id, @RequestBody Admin updatedAdmin) throws MessagingException {
        Optional<Admin> optionalAdmin = adminRepository.findById(id);
        if (optionalAdmin.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Admin> existingAdmin = adminRepository.findByEmail(updatedAdmin.getEmail());
        if (existingAdmin.isPresent() && !existingAdmin.get().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        Admin admin = optionalAdmin.get();
        admin.setEmail(updatedAdmin.getEmail());
        admin.setPassword(updatedAdmin.getPassword());
        admin.setSuperAdmin(updatedAdmin.isSuperAdmin());
        Admin savedAdmin = adminRepository.save(admin);
        sendAdminUpdateEmail(savedAdmin);
        return ResponseEntity.ok(savedAdmin);
    }

    private void sendAdminUpdateEmail(Admin admin) throws MessagingException {
        String subject = "Modification de compte administrateur";

        String roleMessage = admin.isSuperAdmin() ? "Vous avez été promu au rôle de super administrateur." : "Votre rôle d'administrateur a été mis à jour.";

        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}" +
                ".container {width: 100%; padding: 20px; background-color: #ffffff; border-radius: 10px; margin: 0 auto;}" +
                ".header {background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;}" +
                ".content {padding: 20px;}" +
                ".footer {background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Modification de compte administrateur</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Bonjour,</p>" +
                "<p>Les informations de votre compte administrateur ont été modifiées. Voici vos détails de connexion :</p>" +
                "<p><strong>Email :</strong> " + admin.getEmail() + "<br>" +
                "<strong>Mot de passe :</strong> " + admin.getPassword() + "</p>" +
                "<p>" + roleMessage + "</p>" +
                "<p>Cordialement,</p>" +
                "<p>AssetsSci</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2023 AssetsSci. Tous droits réservés.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(admin.getEmail());
        emailRequest.setSubject(subject);
        emailRequest.setBody(body);

        demandeService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
    }


    @DeleteMapping("/delateAdmin/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        Optional<Admin> optionalAdmin = adminRepository.findById(id);
        if (optionalAdmin.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        adminRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/allAdmin")
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @GetMapping("/adminsById/{id}")
    public Optional<Admin> getAdminById(@PathVariable Long id) {
        return adminRepository.findById(id);
    }

    @PostMapping("/loginAdmin")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Admin admin = demandeService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // Retourner une réponse avec les informations nécessaires, par exemple un token JWT et les rôles
        return ResponseEntity.ok(new AuthResponse(admin.getId().toString(), admin.getEmail(), admin.isSuperAdmin()));
    }

    @PutMapping("/updateProfile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Admin adminDetails) {
        Admin updatedAdmin = demandeService.updateAdminProfile(id, adminDetails);
        return ResponseEntity.ok(updatedAdmin);
    }
    @PostMapping("/resetPassword")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) throws MessagingException {
        Optional<Admin> adminOptional = adminRepository.findByEmail(request.getEmail());
        if (adminOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Admin not found"));
        }

        Admin admin = adminOptional.get();
        String resetToken = generateResetToken();
        admin.setResetToken(resetToken);
        adminRepository.save(admin);

        String resetLink = "http://172.30.70.16:4200/formReinitialisation?token=" + resetToken;

        // Send reset email .
        sendResetPasswordEmail(request.getEmail(), resetLink);


        return ResponseEntity.ok(Map.of("message", "Un email de réinitialisation de mot de passe a été envoyé avec succès."));
    }


    private String generateResetToken() {
        // Generate a unique token (customize as needed)
        return java.util.UUID.randomUUID().toString();
    }

    private void sendResetPasswordEmail(String email, String resetLink) throws MessagingException {
        String subject = "Password Reset Request";

        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}" +
                ".container {width: 100%; padding: 20px; background-color: #ffffff; border-radius: 10px; margin: 0 auto;}" +
                ".header {background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;}" +
                ".content {padding: 20px;}" +
                ".footer {background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Réinitialisation du mot de passe</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>" +
                "<p><a href=\"" + resetLink + "\">Réinitialiser mon mot de passe</a></p>" +
                "<p>Cordialement,</p>" +
                "<p>AssetsSci</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2023 AssetsSci. Tous droits réservés.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(email);
        emailRequest.setSubject(subject);
        emailRequest.setBody(body);

        demandeService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
    }


    @PostMapping("/resetPasswordConfirm")
    public ResponseEntity<String> resetPasswordConfirm(@RequestBody ResetPasswordConfirmRequest request) throws MessagingException {
        System.out.println("Received Token: " + request.getToken());  // Debugging
        Optional<Admin> adminOptional = adminRepository.findByResetToken(request.getToken());
        if (adminOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid token");
        }

        Admin admin = adminOptional.get();
        admin.setPassword(request.getNewPassword());
        admin.setResetToken(null);
        adminRepository.save(admin);
        sendPasswordResetConfirmationEmail(admin.getEmail());
        return ResponseEntity.ok("Password reset successfully");

    }

    private void sendPasswordResetConfirmationEmail(String email) throws MessagingException {
        String subject = "Confirmation de réinitialisation du mot de passe";

        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}" +
                ".container {width: 100%; padding: 20px; background-color: #ffffff; border-radius: 10px; margin: 0 auto;}" +
                ".header {background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;}" +
                ".content {padding: 20px;}" +
                ".footer {background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Confirmation de réinitialisation du mot de passe</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>" +
                "<p>Cordialement,</p>" +
                "<p>AssetsSci</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2023 AssetsSci. Tous droits réservés.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(email);
        emailRequest.setSubject(subject);
        emailRequest.setBody(body);

        demandeService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
    }


    @GetMapping("/maintenance")
    public ResponseEntity<Boolean> getMaintenanceMode() {
        return ResponseEntity.ok(maintenanceMode);
    }

    @PostMapping("/maintenance")
    public ResponseEntity<Void> setMaintenanceMode(@RequestParam boolean mode) {
        maintenanceMode = mode;
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<EmailAdmin> getEmailAdmin() {
        EmailAdmin emailAdmin = emailAdminService.getEmailAdmin();
        return ResponseEntity.ok(emailAdmin);
    }

    @PutMapping("/update-email-pass")
    public ResponseEntity<String> updateEmailAdmin(@RequestBody Map<String, String> requestBody) {
        String newEmail = requestBody.get("newEmail");
        String newPassword = requestBody.get("newPassword");
        emailAdminService.updateEmailAdmin(newEmail, newPassword);
        return ResponseEntity.status(HttpStatus.OK).body("Email admin modifié avec succès");
    }
    @GetMapping("/existsPersonne")
    public ResponseEntity<Boolean> existsPersonneFSM(@RequestParam String ppr) {
        boolean exists = personneFSMRepository.findByPpr(ppr).isPresent();
        return ResponseEntity.ok(exists);
    }


    @PostMapping("/addPersonneFsm")
    public ResponseEntity<?> createPersonneFSM(@RequestBody PersonneFSM nouvellePersonne) {
        try {
            boolean exists = personneFSMRepository.existsByPpr(nouvellePersonne.getPpr());
            if (exists) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Le PPR existe déjà.");
            } else {
                PersonneFSM savedPerson = personneFSMRepository.save(nouvellePersonne);
                return ResponseEntity.status(HttpStatus.CREATED).body(savedPerson);
            }
        } catch (Exception e) {
            // Log the exception
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur est survenue.");
        }
    }

    @GetMapping("/users/email-exists")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email, @RequestParam String username) {
        boolean exists = demandeService.emailExistsForDifferentUser(email, username);
        return ResponseEntity.ok(exists);
    }
    @GetMapping("/checkEmailExists")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email, @RequestParam Long currentAdminId) {
        Optional<Admin> existingAdmin = adminRepository.findByEmail(email);
        if (existingAdmin.isPresent() && !existingAdmin.get().getId().equals(currentAdminId)) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }

}