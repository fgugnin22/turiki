import { Layout } from "../processes/Layout";
import RegistrationForm from "../widgets/RegistrationForm";

const Signup = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center grow py-16">
        <RegistrationForm />
      </div>
    </Layout>
  );
};

export default Signup;
