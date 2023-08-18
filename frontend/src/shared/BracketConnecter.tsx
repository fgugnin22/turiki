const BracketConnecter = ({ round }: { round: number }) => {
    if (round < 3) {
        return (
            <div className=" relative">
                <div className="absolute top-0 left-[-420px] bg-white h-[1px] w-[70px]"></div>
                <div className="absolute top-[-120px] left-[-420px] bg-white w-[1px] h-[240px]"></div>
                <div className="absolute top-[-120px] left-[-500px] bg-white h-[1px] w-[80px]"></div>
                <div className="absolute top-[120px] left-[-500px] bg-white h-[1px] w-[81px]"></div>
            </div>
        );
    }
    const verticalLineStyles = {
        height: `${2 ** (round - 3) * 480}px`,
        top: `-${2 ** (round - 3) * 240}px`
    };
    const upperLineStyles = {
        top: `-${2 ** (round - 3) * 240}px`
    };
    const bottomLineStyles = {
        top: `${2 ** (round - 3) * 240}px`
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
