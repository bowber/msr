import { createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { TitleBar } from "./components/title-bar";
import { appWindow } from "@tauri-apps/api/window"

function App() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("check_k0sctl", { name: name() }));
  }

  onMount(() => {
    appWindow.setFocus();
  });

  return (
    <>
      <TitleBar />
      <div class="container">

        <h1>Welcome to Tauri!</h1>

        <p>Click on the Tauri, Vite, and Solid logos to learn more.</p>

        <form
          class="row"
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="submit">Greet</button>
        </form>

        <p>{greetMsg()}</p>
      </div>
    </>
  );
}

export default App;
