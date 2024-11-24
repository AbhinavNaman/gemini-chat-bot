import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    "who won the latest novel peace prize?",
    "which is Indias smartest city?",
    "who won the latest t20 crickets mens world cup?",
    "what is the capital of Bihar?",
    "what are the core subjects of the computer science ?",
    "what is the best tech stack for web develpment ?",
  ];

  const surprise = () => {
    const randomvalue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomvalue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Please ask a question");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: value,
        },
        {
          role: "model",
          parts: data,
        },
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Failed to get response");
    }
  };

  const clear =()=> {
    setValue("");
    setError("");
    setChatHistory([]);
  }

  return (
    <div className="app">
      <p>
        what do you want to know ?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>
          Surprise me{" "}
        </button>
      </p>
      <div className="input-container">
        <input
          type="text"
          placeholder="What do you want to know"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>ask me</button>}
        {error && <button onClick={clear}> clear</button>}
      </div>
      {error && <p>{error}</p>}

      <div className="search-results">
        {chatHistory.map((chatItem, _index) => (
          <div key={_index}>
            <p className="answer">
              {chatItem.role} : {chatItem.parts}
            </p>
          </div>
        ))}
        <div key={""}></div>
      </div>
    </div>
  );
}

export default App;