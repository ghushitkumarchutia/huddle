import { useQuery, useMutation } from "@tanstack/react-query";
import useAuthStore from "../store/authStore";
import * as authApi from "../api/auth.api";

export const useAuth = () => {
  const { user, accessToken, setAuth, clearAuth } = useAuthStore();

  const { isLoading: isRestoring } = useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: async () => {
      if (accessToken) return null;
      try {
        const response = await authApi.refresh();
        setAuth(response.data.user, response.data.accessToken);
        return response;
      } catch (error) {
        clearAuth();
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !accessToken,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.accessToken);
    },
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.accessToken);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
    },
  });

  return {
    user,
    accessToken,
    isRestoring,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    signup: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    isAuthenticated: !!user,
  };
};

export default useAuth;
