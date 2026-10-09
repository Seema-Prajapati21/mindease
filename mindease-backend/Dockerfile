# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /build

# Cache Maven dependencies by copying pom.xml first
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source and build executable JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# Stage 2: Minimal Production Runtime for Render
# ==========================================
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Create a dedicated non-root user and group for security
RUN groupadd -r mindease && useradd -r -g mindease -u 1001 mindease

# Copy built JAR from builder stage
COPY --from=builder --chown=mindease:mindease /build/target/*.jar /app/app.jar

# Run as unprivileged user
USER mindease

# Container-aware JVM memory management
# MaxRAMPercentage=75.0 safely accommodates Render's memory constraints (e.g., 512MB RAM tier)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
ENV PORT=8080

EXPOSE 8080

# Dynamically bind to $PORT provided by Render and forward MongoDB URI and profile system properties if present
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -Dserver.port=${PORT:-8080} ${SPRING_DATA_MONGODB_URI:+-Dspring.data.mongodb.uri=\"$SPRING_DATA_MONGODB_URI\"} ${SPRING_PROFILES_ACTIVE:+-Dspring.profiles.active=\"$SPRING_PROFILES_ACTIVE\"} -jar /app/app.jar"]
