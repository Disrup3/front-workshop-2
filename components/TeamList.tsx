import { ethers } from "ethers";
import { FC, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import  wcbet  from "../constants/abi.json"
import {useContractAddressStore} from "../stores/contractAddressStore"

interface Props {
    teamList: any[];
}

const TeamList: FC<Props> = ({teamList}) => {
    const [selectedTeam, setSelectedTeam] = useState<number>()
    const [betValue, setBetValue] = useState(0);

    const contractAddress = useContractAddressStore((state) => state.contractAddress)

    const {config} = usePrepareContractWrite({
        address: contractAddress,
        functionName: "bet",
        abi: wcbet.abi,
        args: [selectedTeam!],
        overrides: {            
            value: ethers.utils.parseEther(String(betValue)),
          }
    })

    const {write, data, error, isLoading, isSuccess} = useContractWrite(config)

    // team id + msg.value
    const bet = () => {        
        write?.();
    }


    const selectTeam = (teamId: number) => {
        if(teamId < 0 ) return;
        setSelectedTeam(teamId);
    }

  return (
    <div className="flex mb-10 gap-10 mr-10 ml-10">  
        <div className="flex-1">
            <h1 className=" text-[82px]  text-[#D9F40B]">Workshop</h1>
            <p className="mt-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam repellendus saepe fuga voluptate commodi debitis itaque soluta deleniti, odio molestiae, repellat iure impedit ipsum magni ab, modi deserunt rerum asperiores.</p>
        </div>

        <div className="flex-1 ">        
            <div className="rounded p-2 h-[60vh] overflow-scroll border-solid border-4 border-white/[0.4] flex flex-wrap justify-center mt-10">
                {teamList.map(team  => (
                    <TeamCard key={team.teamId} team={team} selectTeam={selectTeam} selectedTeam={selectedTeam} />
                ))}
                
            </div>
            <div className="flex justify-betweenx mt-4 gap-3">
                <div className=" flex-[3] flex flex-col ">                         
                    <input className=" rounded-sm p-4 text-black" value={betValue !== 0 ? betValue : "0.01... eth"} onChange={(e) => setBetValue(Number(e.target.value))} type="number"placeholder={`Cantidad a apostar ${ selectedTeam ? "a " + teamList[Number(selectedTeam!.toString())][1] : ""}`} />
                </div>
                <button onClick={bet} className=" rounded-sm bg-purple-700 flex-1 text-center">Apostar</button>
            </div>
        </div>
    </div>
  )
}
interface TeamProps {
    team: any[];
    selectTeam: (teamId: number) => void;
    selectedTeam?: number;
}
const TeamCard: FC<TeamProps> = ({team, selectTeam, selectedTeam}) => {      
    return (
        <div 
            onClick={() => selectTeam(team[0])} 
            className={`w-[100%] cursor-pointer  flex items-center justify-between shadow-md rounded bg-white/[.08] m-3 p-5 ${selectedTeam?.toString() === team[0]?.toString() && "bg-purple-600/[0.16]"}`}
        >
            <h3 className="text-center">{team[1].toString()}</h3>
            <p className={`m-3 text-center ${team[2] > 0 && " text-green-500"}`}>{team[2] > 0 ? ethers.utils.formatEther(team[2]) : 0} ETH</p>            
        </div>
    )
}

export default TeamList