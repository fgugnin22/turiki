export const continueWithDiscord = async () => {
  try {
    const res = await (
      await fetch(
        `${import.meta.env.VITE_API_URL}/auth/o/discord/?redirect_uri=${
          import.meta.env.VITE_API_URL
        }`
      )
    ).json();
    console.log(
      `${import.meta.env.VITE_API_URL}/auth/o/discord/?redirect_uri=${
        import.meta.env.VITE_API_URL
      }`
    );
    window.location.replace(res.authorization_url);
  } catch (err) {
    console.error(err);
  }
};
