# Étape 1 : Utiliser Oracle JDK 21
FROM container-registry.oracle.com/java/openjdk:21

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier le fichier JAR compilé dans le conteneur
COPY target/*.jar app.jar

# Étape 4 : Exposer le port utilisé par Spring Boot
EXPOSE 8080

# Étape 5 : Démarrer l’application
ENTRYPOINT ["java", "-jar", "app.jar"]
