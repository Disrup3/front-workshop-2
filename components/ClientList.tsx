import { BigNumber, ethers } from "ethers";
import { FC, useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import  wcbet  from "../constants/abi.json"
import {useContractAddressStore} from "../stores/contractAddressStore"
import {toast} from "react-toastify";

interface Props {
    clientList: any[];
}

const ClientList: FC<Props> = ({clientList}) => {
    const [selectedClient, setSelectedClient] = useState<number>()
    const [ donationValue, setDonationValue] = useState(0);


    const contractAddress = useContractAddressStore((state) => state.contractAddress)

    const {config} = usePrepareContractWrite({
        address: contractAddress,
        functionName: "tipCoffee",
        abi: wcbet.abi,
        args: [selectedClient!],
        overrides: {            
            value: ethers.utils.parseEther(String(donationValue)),
        }              
    })

    const {write, data, error, isLoading, isSuccess} = useContractWrite(config)
        

    // team id + msg.value
    const bet = () => {        
        write?.();
    }


    const selectTeam = (clientId: number) => {
        if(clientId < 0 ) return;
        setSelectedClient(clientId);
    }

  return (        

        <div className="flex-1">        
            <div className="rounded p-2 h-[60vh] overflow-scroll border-solid border-4 border-white/[0.4] flex flex-wrap justify-center mt-10">
                {clientList.map((team, i)  => (
                    <TeamCard key={i} client={team} selectClient={selectTeam} selectedClient={selectedClient} />
                ))}
                
            </div>
            <div className="flex justify-betweenx mt-4 gap-3">
                <div className=" flex-[3] flex flex-col ">                         
                    <input className=" rounded-sm p-4 text-black" value={typeof donationValue !== "undefined" ? donationValue : "0.01... eth"} onChange={(e) => setDonationValue(Number(e.target.value))} type="number" step="0.01" placeholder={`Cantidad a donar ${ selectedClient ? "a " + clientList[Number(selectedClient!.toString())].name : ""}`} />                   
                </div>
                <button disabled={isLoading} onClick={bet} className=" rounded-sm bg-purple-700 flex-1 text-center">{isLoading ? "..." : "Donar"}</button>
            </div>
        </div>
  )
}

type clientInfo = {
    id: BigNumber;
    name: string;
    description: string;
    ulrImg: string;
    wallet: string;
    tipAmount: BigNumber;
}
interface TeamProps {
    client: clientInfo;
    selectClient: (teamId: number) => void;
    selectedClient?: number;
}
const TeamCard: FC<TeamProps> = ({client, selectClient, selectedClient}) => {      

    return (
        <div 
            onClick={() => selectClient(Number(client.id))} 
            className={`w-[100%]  cursor-pointer  flex items-center justify-between shadow-md rounded text-[18px] bg-white/[.08] m-3 p-5 ${selectedClient?.toString() === client.id.toString() && "bg-purple-600/[0.16]"}`}
        >   
            <div>
                <img className="w-[50px]" src={client.ulrImg} alt="imagen" />
                <h3 className="text-center">{client.name}</h3>
            </div>
            <p>{client.description}</p>
            <p className={`m-3 ml-5 text-center ${Number(client.tipAmount) > 0 && " text-[#33E459]"}`}>{Number(client.tipAmount) > 0 ? ethers.utils.formatEther(client.tipAmount.toString()) : 0} ETH</p>            
        </div>
    )
}

export default ClientList