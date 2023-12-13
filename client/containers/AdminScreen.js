// Exemple de configuration d'un utilisateur admin statique (à des fins d'illustration uniquement)

import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

export default function AdminScreen({ navigation }) {
  // Utilisateur administrateur statique
  const adminUser = {
    username: 'admin',
    password: 'adminpassword',
  };

  // Fonction de connexion pour l'utilisateur administrateur
  const handleLogin = () => {
    // Ici, vous pouvez mettre en œuvre une logique d'authentification appropriée
    // pour gérer la connexion de l'utilisateur administrateur.

    // Exemple simplifié : redirection vers l'écran des Tomes
    navigation.navigate('Tomes'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      {/* Interface utilisateur pour la connexion (vous pouvez personnaliser selon vos besoins) */}
      <TextInput
        placeholder="Nom d'utilisateur"
        onChangeText={(text) => {/* Gérer l'état du nom d'utilisateur */}}
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        onChangeText={(text) => {/* Gérer l'état du mot de passe */}}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>
    </View>
  );
}



