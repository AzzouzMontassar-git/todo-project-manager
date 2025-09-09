package org.example.todoprojectmanagerbackend.service.Impl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetailsService ;
import org.example.todoprojectmanagerbackend.Entities.User;
import org.example.todoprojectmanagerbackend.repository.UserRepository;
import org.example.todoprojectmanagerbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- Méthodes UserService ---
    @Override
    public List<User> getAllUsers() { return userRepository.findAll(); }

    @Override
    public Optional<User> getUserById(Long id) { return userRepository.findById(id); }

    @Override
    public Optional<User> getUserByEmail(String email) { return userRepository.findByEmail(email); }

    @Override
    public User saveUser(User user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty() && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setNom(updatedUser.getNom());
            existingUser.setPrenom(updatedUser.getPrenom());
            existingUser.setEmail(updatedUser.getEmail());
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()
                    && !updatedUser.getPassword().startsWith("$2a$")) {
                existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }
            existingUser.setRole(updatedUser.getRole());
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + id));
    }

    @Override
    public void deleteUserById(Long id) { userRepository.deleteById(id); }

    @Override
    public void deleteUserByEmail(String email) { userRepository.deleteByEmail(email); }

    @Override
    public void updatePassword(String email, String newPassword) {
        userRepository.findByEmail(email).ifPresentOrElse(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        }, () -> { throw new RuntimeException("Utilisateur non trouvé."); });
    }

    // --- UserDetailsService pour Spring Security ---
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable avec l'e-mail : " + email));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().toUpperCase()) // IMPORTANT : rôle en majuscule
                .build();
    }
}