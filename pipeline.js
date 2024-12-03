import { dag } from "@dagger.io/dagger";
import { Docker } from "docker-cli-js"; // Docker CLI, um mit Docker zu interagieren

class MyModule {
  // Funktion für den Build-Prozess
  async build(src) {
    // Erstelle den Build-Container mit Node.js und Baue die Vue.js-Anwendung
    const buildContainer = dag
      .container()
      .from("node:18-alpine") // Node.js-Image für den Build-Prozess
      .withMountedDirectory("/app", src) // Quellcode-Verzeichnis mounten
      .withWorkdir("/app") // Arbeitsverzeichnis setzen
      .withExec(["npm", "install"]) // Abhängigkeiten installieren
      .withExec(["npm", "run", "build"]); // Build-Prozess ausführen

    // Erstelle den Produktions-Container mit NGINX
    const prodContainer = dag
      .container()
      .from("nginx:alpine") // Nginx-Image für die Produktionsumgebung
      .withExec(["rm", "-rf", "/usr/share/nginx/html/*"]) // Entferne die Standard-Nginx-Seiten
      .withMountedDirectory("/usr/share/nginx/html", "/app/dist"); // Kopiere die gebauten Dateien ins NGINX-Verzeichnis

    return { buildContainer, prodContainer };
  }
}

// Pipeline ausführen
async function main() {
  const module = new MyModule();
  const src = dag.directory(
    "C:/Users/can.celik/Documents/DEV/restaurant-reservation"
  ); // Verzeichnis mit der Vue.js-App

  try {
    // Baue die Anwendung
    const { buildContainer, prodContainer } = await module.build(src);
    console.log("Build completed successfully.");

    // Docker-Image taggen und starten
    const dockerCmd = new Docker();
    const imageName = "my-vue-app:latest";

    // Baue das Docker-Image für den Build-Prozess
    console.log("Building Docker image for production...");
    await dockerCmd.command(`docker build -t ${imageName} .`);

    // Starte den Container im NGINX-Setup
    console.log(`Running container from image: ${imageName}`);
    await dockerCmd.command(`docker run -p 8080:80 ${imageName}`);
    console.log("Container started successfully at port 8080.");
  } catch (error) {
    console.error("Error during the pipeline execution:", error);
  }
}

main();
