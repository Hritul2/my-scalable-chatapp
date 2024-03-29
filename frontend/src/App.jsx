import { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import ChatMessage from "./components/ChatMessage";
import { msgList } from "./redux/chatSlice";

// in future we need laod-balancer to fwd proxies
const socket = io(`http://localhost:8000`);
const id = nanoid(7);

const stringToColour = (str) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
};

function App() {
  const dispatch = useDispatch();
  const { chat } = useSelector((state) => state.chatMsg);
  const [msgSend, setMsgSend] = useState("");
  const colorId = stringToColour(id); // Generate colorId using stringToColour
  const username = id; // Use nanoid generated id as username
  const timestamp = new Date().toLocaleTimeString(); // Generate timestamp

  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("user-msg", { colorId, username, msg: msgSend, timestamp }); // Corrected typo here
    setMsgSend("");
  };

  useEffect(() => {
    socket.on("msg-fromserver", (payload) => {
      dispatch(msgList(payload));
    });
  }, [dispatch]);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      <div
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg overflow-auto"
        style={{ maxHeight: "60vh" }}
      >
        {chat.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
      </div>
      <div className="mt-4 w-full max-w-lg h-4/5 flex">
        <input
          id="messageInput"
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 border rounded-lg"
          value={msgSend}
          onChange={(e) => setMsgSend(e.target.value)} // Update msgSend state
        />
        <button
          onClick={sendChat} // Corrected onClick function
          className="ml-2 p-2 bg-red-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
