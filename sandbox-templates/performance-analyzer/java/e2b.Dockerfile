# Resmi, güvenilir bir Java imajı kullanıyoruz.
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /home/user
COPY BenchmarkRunner.java .