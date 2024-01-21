export const continueWithGoogle = async () => {
  try {
    const res = await (
      await fetch(
        `${import.meta.env.VITE_API_URL}/auth/o/google-oauth2/?redirect_uri=${
          import.meta.env.VITE_API_URL
        }`
      )
    ).json();
    console.log(
      `${import.meta.env.VITE_API_URL}/auth/o/google-oauth2/?redirect_uri=${
        import.meta.env.VITE_API_URL
      }`
    );
    window.location.replace(res.authorization_url);
  } catch (err) {
    console.error(err);
  }
};
