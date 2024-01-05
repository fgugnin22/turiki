import { Layout } from "../processes/Layout";

const Test = () => {
  return (
    <Layout>
      <div
        className="w-64 h-96 relative after:absolute after:opacity-[0.15] after:inset-0 
            neonshadow mx-auto my-auto mb-24 rounded-[10px] after:rounded-[10px] 
            border border-turquoise after:bg-gradient-to-b after:from-transparent 
          after:to-darkturquoise "
      ></div>
      <div
        className="w-64 h-96 rounded-[10px] neonshadow mx-auto my-auto relative after:absolute 
            before:absolute after:inset-0 before:inset-[2px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
            before:z-10 z-20 before:bg-dark before:rounded-[8px] !filter-none hover:!filter-none"
      ></div>
    </Layout>
  );
};

export default Test;
