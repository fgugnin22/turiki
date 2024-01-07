const BracketConnecter = ({ round }: { round: number }) => {
  if (round < 3) {
    return (
      <div className=" relative top-[70px]">
        <div className="absolute top-0 left-[-420px] h-[2px] w-[70px] bg-gradient-to-r from-turquoise to-lightblue"></div>
        <div className="absolute top-[-160px] left-[-501px] border-[2.2px] border-turquoise w-[82px] h-[330px] rounded-r-[10px] border-l-[0px]"></div>
      </div>
    );
  }
  const verticalLineStyles = {
    height: `${2 ** (round - 3) * 640 + 10}px`,
    top: `-${2 ** (round - 3) * 320}px`
  };
  return (
    <div className=" relative top-[70px]">
      <div className="absolute top-0 left-[-420px]  bg-gradient-to-r from-turquoise to-lightblue h-[2px] w-[70px]"></div>
      <div
        style={{
          top: verticalLineStyles.top,
          height: verticalLineStyles.height
        }}
        className="absolute left-[-501px] border-[2.2px] border-turquoise w-[82px] h-[330px] rounded-r-[10px] border-l-[0px]"
      ></div>
    </div>
  );
};

export default BracketConnecter;
