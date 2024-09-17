import AuthService from "../services/auth-service"
import ApplicationService from "../services/application-service"
import AmaliaPlayerService from "~/services/amalia-player-service"

export const useService = () => {

  return {
    $auth: new AuthService(),
    $application: new ApplicationService(),
    $amalia : new AmaliaPlayerService()
  };
}
