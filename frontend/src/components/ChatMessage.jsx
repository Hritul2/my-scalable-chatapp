const ChatMessage = ({ colorId, username, msg, timestamp }) => {
  return (
    <div className={`flex justify-end mb-4`}>
      <div
        className={`bg-red-500 text-white p-2 rounded-lg shadow-md max-w-md`}
      >
        <span style={{ color: colorId }} className="rounded">
          {username}
        </span>
        <p>{msg}</p>
        <span className="text-xs text-gray-100">{timestamp}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
