export function getFriendlyAuthErrorMessage(errorMessage: string): string {
  const normalizedMessage = errorMessage.toLowerCase();

  if (
    normalizedMessage.includes("provider is not enabled") &&
    normalizedMessage.includes("google")
  ) {
    return "Login com Google não está habilitado no Supabase. Ative o provider Google em Authentication > Providers.";
  }

  if (normalizedMessage.includes("popup closed by user")) {
    return "A autenticação com Google foi cancelada.";
  }

  return errorMessage;
}
