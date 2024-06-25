import AuthService from "../services/auth-service"
import ApplicationService from "../services/application-service"
import { useAuth } from "../stores/auth"
import { storeToRefs } from "pinia"

export const useService = () => {
  const authStore = useAuth()

  return {
    $auth: new AuthService(),
    $application: new ApplicationService()
  };
}
