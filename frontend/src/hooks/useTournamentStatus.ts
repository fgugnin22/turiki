export const useTournamentStatus = (status: string | undefined) => {
    return (
        (status === "REGISTRATION_CLOSED_BEFORE_REG" &&
            "Регистрация ещё закрыта") ||
        (status === "REGISTRATION_OPENED" && "Регистрация открыта") ||
        (status === "REGISTRATION_CLOSED_AFTER_REG" &&
            "Регистрация уже закрыта") ||
        (status === "CHECK_IN" && "Подтверждение(check-in)") ||
        (status === "CHECK_IN_CLOSED" && "Скоро начнётся") ||
        (status === "ACTIVE" && "Активен") ||
        (status === "PLAYED" && "Сыгран") ||
        "fgugnin22 где то ошибся"
    );
};
