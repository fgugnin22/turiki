import { useState } from "react";
import TeamPlayerList from "../features/TeamPlayerList";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import ButtonMain from "../shared/ButtonMain";
import ButtonSecondary from "../shared/ButtonSecondary";
const serverURL = import.meta.env.VITE_API_URL;

const testbans = {
  bans: {
    id: 77,
    time_to_select_map: "00:00:59",
    previous_team: 3,
    timestamps: [
      "2024-01-09T21:34:21+03:00",
      "2024-01-09T21:35:21.258862+03:00",
      "2024-01-09T21:35:41.292808+03:00",
      "2024-01-09T21:35:47.566915+03:00",
      "2024-01-09T21:35:49.924893+03:00",
      "2024-01-09T21:35:51.243580+03:00",
      "2024-01-09T21:35:52.132660+03:00",
      "2024-01-09T21:35:53.118837+03:00",
      "2024-01-09T21:35:54.266852+03:00"
    ],
    ban_log: [
      "AUTO",
      "CAPTAIN",
      "CAPTAIN",
      "CAPTAIN",
      "CAPTAIN",
      "CAPTAIN",
      "CAPTAIN",
      "CAPTAIN"
    ],
    maps: [
      "CLUBHOUSE1",
      "CLUBHOUSE2",
      "CLUBHOUSE3",
      "CLUBHOUSE4",
      "CLUBHOUSE5",
      "CLUBHOUSE6",
      "CLUBHOUSE7",
      "CLUBHOUSE8",
      "CLUBHOUSE9"
    ]
  }
};
let a: any = {};
const Test = () => {
  const match = tournamentAPI.useGetMatchByIdQuery({ id: 104 });
  const team1 = tournamentAPI.useGetTeamByIdQuery(38);
  const [, xd] = useState(false);
  return (
    <>
      <Layout>
        <div
          className="w-64 h-96 relative after:absolute after:opacity-[0.15] after:inset-0 
            neonshadow mx-auto my-auto mb-24 rounded-[10px] after:rounded-[10px] 
            border border-turquoise after:bg-gradient-to-b after:from-transparent 
          after:to-darkturquoise "
        ></div>
        <div
          className="w-64 h-96 rounded-[10px] mx-auto my-auto relative after:absolute 
            before:absolute after:inset-0 before:inset-[2px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
            before:z-10 z-20 before:bg-dark before:rounded-[8px]"
        ></div>
        <div
          className="w-64 h-96 rounded-[10px] mx-auto my-auto relative after:absolute 
            before:absolute after:inset-0 before:inset-[2px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
            before:z-10 z-20 before:bg-dark before:rounded-[8px] 
            before:bg-gradient-to-b before:from-transparent before:to-darkturquoise before:to-[350%]"
        ></div>
        <p
          data-content="Турниры"
          className="before:text-lg before:inset-0  w-full text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
        >
          Турниры
        </p>
        <div className="my-24 ">
          <div
            className="rounded-[10px] w-[830px] mx-auto relative after:absolute 
              before:absolute after:inset-0 before:inset-[1px] after:bg-gradient-to-r
            after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
              before:z-10 z-20 before:bg-dark before:rounded-[9px] flex flex-wrap justify-left gap-y-8 gap-x-[60px] px-16 py-12"
          ></div>
        </div>
      </Layout>
      <Layout>
        <>
          <div className="text-center mt-2 text-2xl">
            <p
              data-content={`Матч ${123}, 1/${16}`}
              className="before:text-2xl before:font-semibold before:drop-shadow-[0_0_1px_#4cf2f8] before:inset-0 
                          w-full text-center text-2xl before:w-full font-medium  before:text-center before:bg-gradient-to-l 
            before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
              before:absolute relative before:content-[attr(data-content)]"
            >
              {`Матч ${123}, 1/${16}`}
            </p>
            {(testbans.bans?.maps.length && (
              <p className="text-lg font-normal text-lightgray">
                Карта:{" "}
                <span
                  data-content={testbans.bans.maps[0]}
                  className="before:text-lg before:-top-[3px] before:drop-shadow-[0_0_1px_#4cf2f8] before:inset-0 w-full text-center text-lg before:w-full before:text-center before:bg-gradient-to-l 
            before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
              before:absolute relative before:content-[attr(data-content)]"
                >
                  {testbans.bans.maps[0]}
                </span>
              </p>
            )) || (
              <p className="text-lg font-normal text-lightgray mb-4">
                <span>До начала матча осталось: </span>
                <span
                  data-content="12:12:23"
                  className="before:text-lg before:-top-[3px] before:drop-shadow-[0_0_1px_#4cf2f8] before:inset-0 w-full text-center text-lg before:w-full before:text-center before:bg-gradient-to-l 
        before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
          before:absolute relative before:content-[attr(data-content)]"
                >
                  12:12:23
                </span>
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 justify-center gap-x-[140px] relative">
            <img
              src={`${serverURL}/assets/img/versus.svg`}
              className="absolute z-50 top-[65px] left-[calc(50%-25px)]"
            />
            <>
              {match.data && match.data.participants[0] && team1?.data && (
                <TeamPlayerList
                  tournamentId={match.data.tournament ?? -1}
                  team={team1.data}
                />
              )}
              {match.data && match.data.participants[0] && team1?.data && (
                <TeamPlayerList
                  tournamentId={match.data.tournament ?? -1}
                  team={team1.data}
                />
              )}

              {/* {
                <>
                  <div></div>
                  <div className="place-self-center mx-auto col-span-2 shadow-xl mt-[60px] rounded-lg w-fit max-w-3/5">
                    <p
                      data-content="adplgamwekgw"
                      className="before:text-[20px] before:inset-0  w-full text-center text-[20px] before:w-full font-semibold  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] mb-6"
                    >
                      alsdjfnasdojf
                    </p>
                    <div
                      className="rounded-[10px] mx-auto relative after:absolute 
              before:absolute after:inset-0 before:inset-[1px] after:bg-gradient-to-r
            after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
              before:z-10 z-20 before:bg-dark before:rounded-[9px] flex flex-wrap flex-col justify-left gap-y-8 gap-x-8 px-16 py-12 h-fit max-h-[400px]"
                    >
                      {testbans.bans?.maps.map((map) => {
                        return (
                          <div className="z-30 w-44 relative" key={map}>
                            <p
                              data-content={map}
                              className="before:text-[20px] before:inset-0  w-full text-left text-[20px] before:w-full font-semibold  before:text-left before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                            >
                              {map}
                            </p>
                            {
                              <button
                                onClick={() => {
                                  testbans.bans.maps.pop();
                                  xd((p) => !p);
                                }}
                                className="absolute z-50 right-1 top-[6.5px]"
                              >
                                <img
                                  src={`${serverURL}/assets/img/ban.svg`}
                                  className="neonshadow hover:scale-110 active:scale-150 transition"
                                />
                              </button>
                            }
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              } */}
            </>
            {true && true && true && true && (
              <div className="flex w-4/5 mx-auto flex-col mt-14 relative">
                <p className="text-center mb-4">
                  На заход в лобби осталось: 12:12:23
                </p>
                <ButtonMain
                  disabled
                  className="py-4 w-full focus:py-[14px] active:py-[14px] text-center disabled:opacity-60"
                >
                  Моя команда зашла в лобби!
                </ButtonMain>
              </div>
            )}
            {match.data?.state === "SCORE_DONE" && <div className=""></div>}
          </div>
        </>
      </Layout>
    </>
  );
};

export default Test;
