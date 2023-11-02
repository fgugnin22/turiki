export const continueWithGoogle = async () => {
  try {
    const res = await (
      await fetch(
        `${import.meta.env.VITE_API_URL}/auth/o/google-oauth2/?redirect_uri=${
          import.meta.env.VITE_API_URL
        }`
      )
    ).json();
    console.log(res.data.authorization_url);
    window.location.replace(res.data.authorization_url);
  } catch (err) {
    console.error("Google Auth error");
  }
};
