FROM openjdk:17-jdk-slim

WORKDIR /app

# Copiar el archivo JAR del proyecto
COPY target/postservice-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto
EXPOSE 8081

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]