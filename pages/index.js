import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: userInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setUserInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Ask George Carlin</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img style={{width: "200px"}} src="Carlin-img.png" className={styles.icon} />
        <h3> Ask George Carlin</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="text"
            placeholder="Let's hear it, folks. Whatcha got?"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input type="submit" value="Ask George" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}