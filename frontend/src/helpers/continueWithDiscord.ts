export const continueWithDiscord = async () => {
  try {
    const res = await (
      await fetch(
        `${import.meta.env.VITE_API_URL}/auth/o/discord/?redirect_uri=${
          import.meta.env.VITE_API_URL
        }`
      )
    ).json();
    window.location.replace(res.authorization_url);
  } catch (err) {
    console.error(err);
  }
};
