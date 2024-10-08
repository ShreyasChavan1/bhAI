import {React , useState , useEffect} from 'react'
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { auth } from '../../lib/firebase';
import { Context } from '../../context/context';
import { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { doc , getDoc} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Sidebar = () => {
    
    const {setPass,setEmail,user,chathistory,setChathistory,setGetchat,getchat,setShowResult,extended,setExtended,onSent} = useContext(Context);
    
    
    const signOutLogic = async() =>{
        await signOut(auth);
        // setUser("");
        setPass("");
        setEmail("");
    }
    const loadPrompts = async (userId) => {
        const userDocRef = doc(db, "userChats", userId);
        try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const chatData = docSnap.data().chats;
                const prompts = chatData.map((chat) => chat.prompt);
                setChathistory(prompts);
            } else {
                console.log("No prompts found.");
            }
        } catch (error) {
            console.error("Error loading prompts: ", error);
        }
    };
    const loadChat = async (prompt) => {
        const userChatRef = doc(db, "userChats", user.uid); 
        try {
            const docSnap = await getDoc(userChatRef); 
            if (docSnap.exists()) {
                const chatData = docSnap.data().chats;  
                const foundChat = chatData.find(chat => chat.prompt === prompt);
                if (foundChat) {
                    setGetchat({prompt:foundChat.prompt,response:foundChat.response}) ;
                    console.log(getchat)
                } else {
                    console.log("Chat not found for the prompt.");
                }
            } else {
                console.log("No chat document found for the user.");
            }
        } catch (error) {
            console.error("Error loading chat: ", error);
        }
    }

    
      useEffect(() => {
        if (user) {
          loadPrompts(user.uid);
        }
      }, [chathistory]);
  return (
   <div className="sidebar">
        <div className="top">
            <img src={assets.menu_icon} alt="" onClick={()=>setExtended(prev=>!prev)} className="menu" />
              <div onClick={() => {
                  setShowResult(false); 
                  setGetchat(null);    
              }} className="new-chat">
                <img src={assets.plus_icon} alt="" />
                {extended?<p>New Chat</p>:null} 
                {/* //sidebar extended or collapsed loggic */}
            </div>
                {extended?
            <div className="recent">
            <p className="recent-title">Recent</p>
            {chathistory.length > 0 ? (
              chathistory.map((prompt, index) => (
                <div onClick={()=>loadChat(prompt)} key={index} className="recent-entry">
                  <img src={assets.message_icon} alt="Recent Entry" />
                  <p>{prompt.length > 15 ? prompt.slice(0, 15) + "..." : prompt}</p>
                </div>
              ))
            ) : (
              <p>No recent chats</p>
            )}
          </div>
                :null}
        </div>
        <div className="bottom">
            <div className="bottom-item recent-entry">
                <img onClick={()=>onSent("Please help me with usage of google Gemini")} src={assets.question_icon} alt="" />
                {extended?<p>Help</p>:null}
            </div>
            <div className="bottom-item recent-entry">
                <img src={assets.history_icon} alt="" />
                {extended?<p>History</p>:null}
            </div>
            <div className="bottom-item recent-entry">
                <img src={assets.setting_icon} alt="" />
                {extended?<p>Settings</p>:null}
            </div>
            <div className="bottom-item recent-entry">
                <img onClick={signOutLogic} src={assets.logout_icon} alt="" />
                {extended?<p>logout</p>:null}
            </div>
        </div>
   </div>
  )
}

export default Sidebar