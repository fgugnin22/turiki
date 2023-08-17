const BracketConnecter = ({ round }: { round: number }) => {
    console.log(round);
    if (round < 3) {
        return (
            <div className=" relative">
                <div className="absolute top-0 left-[-420px] bg-white h-[1px] w-[70px]"></div>
                <div className="absolute top-[-120px] left-[-420px] bg-white w-[1px] h-[250px]"></div>
                <div className="absolute top-[-120px] left-[-500px] bg-white h-[1px] w-[80px]"></div>
                <div className="absolute top-[130px] left-[-500px] bg-white h-[1px] w-[81px]"></div>
            </div>
        );
    }
    const verticalLineStyles = {
        height: `${(round - 2) * 480}px`,
        top: `-${(round - 2) * 240}px`
    };
    const upperLineStyles = {
        top: `-${(round - 2) * 240}px`
    };
    const bottomLineStyles = {
        top: `${(round - 2) * 240}px`
    };
    return (
        <div className=" relative">
            <div className="absolute top-0 left-[-420px] bg-white h-[1px] w-[70px]"></div>
            <div
                className="absolute bg-white w-[1px] left-[-420px]"
                style={verticalLineStyles}
            ></div>
            <div
                className="absolute left-[-500px] bg-white h-[1px] w-[80px]"
                style={upperLineStyles}
            ></div>
            <div
                className="absolute left-[-500px] bg-white h-[1px] w-[81px]"
                style={bottomLineStyles}
            ></div>
        </div>
    );
};

export default BracketConnecter;
