import React, { useEffect, useState } from 'react';
import "./App.css";

import { useSelector } from 'react-redux';
import { selectPage } from './features/counterSlice';

import Splash from "./components/Splash";
import Login from "./components/Login";
import Main from "./components/Main";
import SignIn from "./components/SignIn";
import PlayerPicks from "./components/PlayerPicks";

import ChallengeContent from "./components/ChallengeContent";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Join from './components/Join';
import PlayerProfile from './components/PlayerProfile';
import ResumeBuyPick from './components/ResumeBuyPick';
import StartPlaying from './components/StartPlaying';
import BoughtPicks from './components/BoughtPicks';
import ProfileEdit from "./components/ProfileEdit";
import Followers from "./components/Followers";
import Profile from "./components/Profile";
import LobbyScreen from "./components/LobbyScreen";
import ChallengeFriend  from './components/ChallengeFriend';
import StartGame from "./components/StartGame";
import Wallet from './components/Wallet';
import Debug from './components/Debug';
import Subscription from "./components/Subscription";

function App() {
  const [page,setPage]=useState(0);


 const p=useSelector(selectPage);
  useEffect(()=>{
    setPage(p);
  },[p])



  return (
    <Router>
        <Switch>
          <Route path="/" exact>
            <Splash />
          </Route>

          <Route path="/login">
            <Login /> 
          </Route>

          <Route path="/register">
            <SignIn />
          </Route>


          <Route path="/main">
            <Main />
          </Route>

          <Route path="/challenge">
            <ChallengeContent />
          </Route>

          <Route path="/join">
            <Join />
          </Route>

          <Route path="/player-picks">
            <PlayerPicks />
          </Route>

          <Route path="/player-profile">
            <PlayerProfile />
          </Route>

          <Route path="/resume-buy-picks">
            <ResumeBuyPick />
          </Route>

          <Route path="/start-playing">
            <StartPlaying />
          </Route>

          <Route path="/bought-picks">
            <BoughtPicks />
          </Route>
		  
		   <Route path="/profile-edit">
            <ProfileEdit />
          </Route>
		  
		   <Route path="/followers">
            <Followers />
          </Route>

          <Route path="/profile">
            <Profile />
          </Route>

          <Route path="/lobby">
            <LobbyScreen />
          </Route>

          <Route path="/challenge-friend">
            <ChallengeFriend />
          </Route>
          
          <Route path="/start-game">
            <StartGame />
          </Route>

          <Route path="/wallet">
            <Wallet />
          </Route>

          <Route path="/debug" exact>
            <Debug />
          </Route>
		  
		   <Route path="/subscription" exact>
            <Subscription />
          </Route>
          
         
        </Switch>

    
    </Router>
  );
}

export default App;
