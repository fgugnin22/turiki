export const possible_statuses = [
  "REGISTRATION_CLOSED_BEFORE_REG",
  "REGISTRATION_OPENED",
  "REGISTRATION_CLOSED_AFTER_REG",
  "CHECK_IN",
  "CHECK_IN_CLOSED",
  "ACTIVE",
  "PLAYED"
] as const;
export const useTournamentStatus = (
  status?: (typeof possible_statuses)[number]
) => {
  return (
    (status === "REGISTRATION_CLOSED_BEFORE_REG" &&
      "Регистрация ещё закрыта") ||
    (status === "REGISTRATION_OPENED" && "Регистрация открыта") ||
    (status === "REGISTRATION_CLOSED_AFTER_REG" && "Регистрация уже закрыта") ||
    (status === "CHECK_IN" && "Подтверждение(check-in)") ||
    (status === "CHECK_IN_CLOSED" && "Скоро начнётся") ||
    (status === "ACTIVE" && "Активен") ||
    (status === "PLAYED" && "Сыгран") ||
    "fgugnin22 где то ошибся"
  );
};
