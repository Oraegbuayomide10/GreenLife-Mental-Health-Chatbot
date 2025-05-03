import { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm GreenLife. How are you doing today?",
      sender: "me",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    const newMessage = {
      id: Date.now(),
      text: input,
      sender: "them",
      timestamp: `${hour}:${minutes}`,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    console.log(updatedMessages);
  };

  return (
    <div className="flex flex-col p-10 w-full h-screen border rounded-lg shadow-lg bg-gray-200">
      {/* Header */}
      <div className="p-4 text-lg font-semibold text-center text-black">
        GreenLife
      </div>

      {/* Chat messages (scrollable) */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] flex justify-between px-4 py-5 items-center rounded-lg ${
              msg.sender === "them"
                ? "bg-green-400 text-black ml-auto text-right mt-4"
                : "bg-gray-300 text-gray-900 mt-4"
            }`}
          >
            <span>{msg.text}</span>
            <span className="text-xs">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Input always at bottom */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 border text-black rounded-full outline-none focus:ring-2 focus:ring-green-400"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
