import { Match } from "../helpers/transformMatches";
import { tournamentAPI } from "./rtk/tournamentAPI";
import { useAppSelector } from "./rtk/store";
const serverURL = import.meta.env.VITE_API_URL;

type Props = {
  match: Match;
  secondsRemaining: number;
};
const MapBans = ({ match, secondsRemaining }: Props) => {
  const { userDetails: user } = useAppSelector((state) => state.user);
  const [banMap] = tournamentAPI.useBanMapMutation();

  return (
    <div className="order-1 place-self-center mx-auto flex flex-col col-span-2 shadow-xl mt-4 rounded-lg lg:w-[500px] items-center min-w-[300px]">
      <p
        data-content={`${
          (user?.team === match.participants[0]?.team.id ||
            user?.team === match.participants[1]?.team.id) &&
          user?.team_status === "CAPTAIN" &&
          match.bans?.previous_team !== match.participants[0].team.id
            ? "Ход команды " + match.participants[0]?.team.name
            : "Ход команды " + match.participants[1]?.team.name
        }, осталось ${secondsRemaining >= 0 ? secondsRemaining : "..."} ${
          secondsRemaining % 10 > 4 ||
          secondsRemaining % 10 === 0 ||
          secondsRemaining === 14
            ? "секунд"
            : secondsRemaining % 10 > 1
            ? "секунды"
            : "секунда"
        }`}
        className="before:text-[20px] before:top-0 before:bottom-0 before:left-0 before:right-0  w-full text-center text-[20px] before:w-full font-semibold  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] mb-2"
      >
        {`${
          (user?.team === match.participants[0]?.team.id ||
            user?.team === match.participants[1]?.team.id) &&
          user?.team_status === "CAPTAIN" &&
          match.bans?.previous_team !== match.participants[0].id
            ? "Ход команды " + match.participants[0]?.team.name
            : "Ход команды " + match.participants[1]?.team.name
        }, осталось ${secondsRemaining >= 0 ? secondsRemaining : "..."} ${
          secondsRemaining % 10 > 4 ||
          secondsRemaining % 10 === 0 ||
          secondsRemaining === 14
            ? "секунд"
            : secondsRemaining % 10 > 1
            ? "секунды"
            : "секунда"
        }`}
      </p>
      <div
        className="rounded-[10px] relative after:absolute 
              before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:top-[1px]
              before:bottom-[1px] before:left-[1px] before:right-[1px] after:bg-gradient-to-r
            after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
              before:z-10 z-20 before:bg-dark before:rounded-[9px] flex flex-wrap flex-col justify-left gap-y-8 gap-x-8 px-16 py-12 lg:h-fit lg:w-[480px] lg:mr-auto lg:max-h-[400px]"
      >
        {match.bans?.maps.map((map) => {
          const handleBan = () => {
            if (!user?.team || user.team_status !== "CAPTAIN") {
              return;
            }
            banMap({
              teamId: user.team,
              matchId: match.id,
              mapName: map
            });
          };
          return (
            <div className="z-30 w-44 relative" key={map}>
              <p
                data-content={map}
                className="before:text-[20px] before:top-0 before:bottom-0 before:left-0 before:right-0  w-full text-left text-[20px] before:w-full font-semibold  before:text-left before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
              >
                {map}
              </p>
              {(user?.team === match.participants[0]?.team.id ||
                user?.team === match.participants[1]?.team.id) &&
                user?.team_status === "CAPTAIN" &&
                match.bans?.previous_team !== user?.team && (
                  <button
                    onClick={handleBan}
                    className="absolute z-50 right-1 top-[6.5px]"
                  >
                    {match.is_bo3 &&
                    (match.bans?.maps.length === 4 ||
                      match.bans?.maps.length === 5) ? (
                      <img
                        src={`${serverURL}/media/img/galka.svg`}
                        className="neonshadow hover:scale-110 active:scale-150 transition"
                      />
                    ) : (
                      <img
                        src={`${serverURL}/media/img/ban.svg`}
                        className="neonshadow hover:scale-110 active:scale-150 transition"
                      />
                    )}
                  </button>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapBans;
