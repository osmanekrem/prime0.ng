FROM node:21-slim

RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Çalışma dizinini ayarla
WORKDIR /home/user

# Angular CLI'yi global olarak yükle
RUN npm install -g @angular/cli@19

# Yeni Angular projesi oluştur
RUN ng new app --routing --style=css --standalone --skip-git --package-manager=npm

# Proje dizinine geç
WORKDIR /home/user/app

# PrimeNG ve Tailwind CSS paketlerini yükle
RUN npm install primeng@19 @primeng/themes primeicons
RUN npm install tailwindcss @tailwindcss/postcss postcss tailwindcss-primeui --force

# Tailwind config dosyasını oluştur
RUN echo 'import PrimeUI from "tailwindcss-primeui";\n\nexport default {\n  content: ["./src/**/*.{html,ts}"],\n  darkMode: "selector", // class tabanlı dark mode\n  theme: {\n    extend: {}\n  },\n  plugins: [PrimeUI]\n};' > tailwind.config.js

# PostCSS konfigürasyonunu oluştur
RUN echo '{\n  "plugins": {\n    "@tailwindcss/postcss": {}\n  }\n}' > .postcssrc.json

# Styles.css dosyasını güncelle (Tailwind CSS ve PrimeUI plugin entegrasyonu)
RUN echo '@import "tailwindcss";\n@plugin "tailwindcss-primeui";\n@import "primeicons/primeicons.css";\n\nhtml, body {\n  height: 100%;\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\n}\n' > src/styles.css

# App config dosyasını oluştur (Dark mode selector ile uyumlu)
RUN echo "import { ApplicationConfig } from '@angular/core';\nimport { provideRouter } from '@angular/router';\nimport { provideAnimationsAsync } from '@angular/platform-browser/animations/async';\nimport { providePrimeNG } from 'primeng/config';\nimport Aura from '@primeng/themes/aura';\nimport { routes } from './app.routes';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(routes),\n    provideAnimationsAsync(),\n    providePrimeNG({\n      theme: {\n        preset: Aura,\n        options: {\n          darkModeSelector: '.dark', // Tailwind ile uyumlu\n        }\n      }\n    })\n  ]\n};" > src/app/app.config.ts

EXPOSE 4200

# Dosyaları kopyalarken gizli dosyalar dahil tümünü kopyala
RUN cp -r /home/user/app/. /home/user/ && rm -rf /home/user/app