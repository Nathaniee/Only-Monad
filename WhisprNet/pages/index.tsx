import Head from 'next/head'
import Login from '../components/Login'
import { useMoralis } from 'react-moralis';
import Header from '../components/Header';
import Messages from '../components/Messages';
import { WHISPRNET_CONTRACT_ABI } from "../lib/contractABI";
import { WHISPRNET_CONTRACT_ADDRESS } from "../lib/constants";
import PrivateMessenger from "../components/privateMessenger";


export default function Home() {
  const { isAuthenticated, logout } = useMoralis();

  if (!isAuthenticated) return <Login/>

  return (
    <div className="h-screen overflow-y-scroll bg-gradient-to-b from-black to-fuchsia-900 overflow-hidden">
      <Head>
        <title>Nathieon Monad Web3 Community</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Roboto:wght@500;700;900&display=swap" rel="stylesheet"/>
      </Head>
      {/* <button onClick={()=> logout()}>Logout </button> */}
        <div className='max-w-screen-2xl mx-auto'>
          <Header/>
          <Messages/> 
        </div>
    </div>
  )
}
