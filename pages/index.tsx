import { abi } from "../constants/abi.json";
import { useContractRead } from "wagmi";
import SelectContractAddress from "../components/SelectContractAddress";
import AppLayout from "../components/layouts/AppLayout";
import {useContractAddressStore} from "../stores/contractAddressStore"
import { ethers } from "ethers";
import WithdrawFunds from "../components/WithdrawFunds";
import ClientList from "../components/ClientList";


export default function Home() {
  
  const contractAddress = useContractAddressStore((state) => state.contractAddress)

  const {data: AmountTotal = 0, error} = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "AmountTotal",
    chainId: 5,
    watch: true
  })

  const {data: clientList = []} = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "getCoffeesList",
    chainId: 5,
    watch: true
  })



  if(error) return(
    <AppLayout>
      <div className="mt-10 flex flex-col items-center justify-center">
        <h2 className=" text-xl mb-6 text-center text-red-400">Selecciona un smart contract valido </h2>
        <SelectContractAddress />
      </div>
    </AppLayout >
  )

  return (
    <AppLayout>
      <main>     

        {contractAddress.length < 1 
          ? (
            <div className="flex justify-center">
              <SelectContractAddress />
            </div>
          )
          : (
            <div className="mt-5">
              <div className="flex flex-wrap mb-10 gap-10 mr-10 ml-10 pt-[5rem]">

                <div className="flex-1">
                  <h1 className=" text-[82px]  text-[#D9F40B]">Buy Me a Coffee</h1>

                  <p className="mt-5">Buy me a Coffe hecho con smart contracts en solidity</p>

                  <div className="flex flex-col mt-10">
                  { contractAddress.length > 1 &&  <p className="text-xl">Conectado a:
                   <span className="ml-3 text-[#D9F40B]" >{contractAddress}</span></p> } 

                    <p className="text-xl">Cantidad total donada:
                     <span className="ml-3 text-purple-500">{ethers.utils.formatEther(String(AmountTotal))} eth </span>
                    </p>                    
                  </div>
                  
                  
                </div>                
                  <ClientList clientList={clientList as any[]}/>               
                
              </div>

            </div>
          )
        }   
      </main>
   </AppLayout>
  )
}
