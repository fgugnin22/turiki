import BracketMatch1 from "./BracketMatch1";
import BracketMatch2 from "./BracketMatch2";
import BracketMatch3 from "./BracketMatch3";

const BracketExample = () => {
    return (
        <div className="w-[1000px] h-[500px] grid grid-cols-2 grid-flow-row mt-0 font-roboto bg-black ">
            <BracketMatch1 />
            <BracketMatch2 />
            <BracketMatch3 />
        </div>
    );
};

export default BracketExample;
