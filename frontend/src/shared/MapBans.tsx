import { Match } from "../helpers/transformMatches";
import { tournamentAPI } from "./rtk/tournamentAPI";
import { useAppSelector } from "./rtk/store";
type Props = {
  match: Match;
  secondsRemaining: number;
};
const MapBans = ({ match, secondsRemaining }: Props) => {
  const { userDetails: user } = useAppSelector((state) => state.user);
  const [banMap] = tournamentAPI.useBanMapMutation();
  return (
    <>
      {
        <div className="w-72 place-self-center mx-auto flex flex-col col-span-1 shadow-xl mt-4">
          <span className="mx-auto">
            Осталось {secondsRemaining >= 0 ? secondsRemaining : "..."}{" "}
            {secondsRemaining % 10 > 4 ||
            secondsRemaining % 10 === 0 ||
            secondsRemaining === 14
              ? "секунд"
              : secondsRemaining % 10 > 1
              ? "секунды"
              : "секунда"}
          </span>
          {match.bans?.maps.map((map) => {
            const handleBan = () => {
              if (!user?.team) {
                return;
              }
              banMap({
                teamId: user.team,
                matchId: match.id,
                mapName: map
              });
            };
            return (
              <div
                key={map}
                className="w-full border-b-1 border-b-black border last-of-type:border-none first-of-type:rounded-t-lg last-of-type:rounded-b-lg p-2 flex items-center justify-center even:bg-gray-300 odd:bg-gray-100 text-black"
              >
                <p className="mr-auto">{map}</p>
                {(user?.team === match.participants[0].team.id ||
                  user?.team === match.participants[1].team.id) &&
                  user?.team_status === "CAPTAIN" &&
                  match.bans?.previous_team !== user?.team && (
                    <button
                      onClick={handleBan}
                      className="p-1 rounded bg-black text-white ml-auto"
                    >
                      Забанить
                    </button>
                  )}
              </div>
            );
          })}
        </div>
      }
    </>
  );
};

export default MapBans;
