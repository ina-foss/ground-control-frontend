import AuthService from "../services/auth-service"
import ApplicationService from "../services/application-service"
import AmaliaPlayerService from "../services/amalia-player-service"

// Singleton instances to prevent multiple event listener registrations
let authServiceInstance: AuthService | null = null;
let applicationServiceInstance: ApplicationService | null = null;

export const useService = () => {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService();
  }
  if (!applicationServiceInstance) {
    applicationServiceInstance = new ApplicationService();
  }

  return {
    $auth: authServiceInstance,
    $application: applicationServiceInstance,
  };
}
