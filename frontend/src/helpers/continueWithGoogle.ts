import axios from 'axios'
export const continueWithGoogle = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/o/google-oauth2/?redirect_uri=${
        import.meta.env.VITE_API_URL
      }`
    );
    console.log(res.data.authorization_url);
    window.location.replace(res.data.authorization_url);
  } catch (err) {
    console.log("Google Auth error");
  }
};
