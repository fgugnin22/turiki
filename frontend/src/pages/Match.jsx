import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../hocs/Layout";

const Match = () => {
  const params = useParams();
  return (
    <Layout>
      <div>Match {params.id}</div>
    </Layout>
  );
};

export default Match;
