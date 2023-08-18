import BracketConnecter from "./BracketConnecter";

const BracketMatch2 = () => {
    return (
        <div className="w-[350px] row-span-2 h-[120px] flex flex-row flex-wrap content-start mt-[34%] ml-[100px] text-[13px] ">
            <div className="w-[60px] h-[16px] ml-2 my-auto text-[#818181] text-[10px]">
                <p className=" float-left">18:52</p>
                <p className=" float-right">09.08</p>
            </div>
            <div className="w-[90px] h-[25px] ml-auto bg-[#717171] rounded-t-[3px] text-center leading-[27px] text-white text-[11px] font-thin">
                Подробнее
            </div>
            <div className="w-[350px] h-[50px] bg-white rounded-tl text-[13px] font-thin pl-[22px] pt-[16px] pr-[24px]">
                Amogws123321 <p className=" font-bold float-right">TBD</p>
            </div>

            <div className="w-[350px] h-[50px] bg-white rounded-bl rounded-br  text-[13px] font-thin pl-[22px] pt-[16px]  pr-[24px]">
                ------------{" "}
                <p className=" font-bold float-right">TBD</p>
            </div>
            {/* <BracketConnecter /> */}
        </div>
    );
};

export default BracketMatch2;
