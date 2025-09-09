package org.example.todoprojectmanagerbackend.service;

import org.example.todoprojectmanagerbackend.Entities.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User saveUser(User user);

    Optional<User> getUserById(Long id);

    Optional<User> getUserByEmail(String email);

    List<User> getAllUsers();

    User updateUser(Long id, User updatedUser);

    void deleteUserById(Long id);

    void deleteUserByEmail(String email);

    void updatePassword(String email, String newPassword);

    // Méthode pour Spring Security
    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;
}
