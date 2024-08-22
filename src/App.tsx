import './css/App.css'
import {useState} from "react";
import {cn} from "./utils/TailwindMerge.ts";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "./components/Dropdown.tsx";
import {tile, tileState} from "./types/Tile.ts";
import {TileData} from "./data/TileData.ts";

// Define the tile states


// Fisher-Yates shuffle function to randomize the array
function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function App() {
	// Initialize the tiles state with the shuffled tiles
	const [tiles, setTiles] = useState<tile[]>(() => shuffleArray([...TileData]));	
	const [correctAnswer, setCorrectAnswer] = useState(TileData[Math.floor(Math.random() * TileData.length)]);
	const [currentGuess, setCurrentGuess] = useState<tile | undefined>(undefined);
	const [chatLog, setChatLog] = useState<string[]>([]);
	const [text, setText] = useState<string>("");
	const [username, setUsername] = useState<string>("Galrent");
	const [gameOver, setGameOver] = useState<boolean>(false);
	
	// Handle tile click to toggle between states
	const handleTileClick = (index: number) => {
		setTiles(prevTiles => prevTiles.map((tile, i) => {
			if (i === index) {
				// Cycle between Active, Eliminated, and Questioning states
				let newState;
				if (tile.state === tileState.Active) {
					newState = tileState.Eliminated;
				} else if (tile.state === tileState.Eliminated) {
					newState = tileState.Questioning;
				} else {
					newState = tileState.Active;
				}
				return {...tile, state: newState};
			}
			return tile;
		}));
		
	};
	
	const handleGuessEvent = () => {
		if (currentGuess === undefined) {return}
		chatLog.push(username + " guessed " + currentGuess.name);
		
		if (currentGuess === correctAnswer) {
			setChatLog((prevLog) => [...prevLog, "User wins!"]);
			setGameOver(true);
		} else {
			// If the guess is incorrect, find the tile and set its state to Eliminated
			setTiles((prevTiles) =>
				prevTiles.map((tile) =>
					tile === currentGuess
						? {...tile, state: tileState.Eliminated}
						: tile
				)
			);
		}
		setCurrentGuess(undefined);
	}
	
	const handleReset = () => {
		setCurrentGuess(undefined);
		setGameOver(false);
		setTiles(shuffleArray([...TileData]));
		setCorrectAnswer(TileData[Math.floor(Math.random() * TileData.length)]);
		setChatLog([]);
	}
	
	const handleTextSending = (text: string) => {
		if (text == "") return;
		
		chatLog.push(`${username}: ${text}`);
		setText("");
	}

	// Get tile styling based on its state
	const getTileClass = (state: tileState) => {
		switch (state) {
			case tileState.Eliminated:
				return "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-600 via-rose-800 to-rose-900 " + "hover:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] hover:from-rose-500 hover:via-rose-700 hover:to-rose-800";
			case tileState.Questioning:
				return "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400 via-yellow-600 to-yellow-700 " + "hover:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] hover:from-yellow-300 hover:via-yellow-500 hover:to-yellow-600";
			case tileState.Active:
			default:
				return "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-600 via-slate-800 to-slate-900 " + "hover:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] hover:from-slate-500 hover:via-slate-700 hover:to-slate-800";
		}
	};

	return (<div className={"bg-indigo-950 max-h-dvh h-dvh p-4 flex justify-center items-center"}>

		{gameOver ? (
			<div className="text-center text-white">
					<h1 className="text-5xl mb-4">GAME OVER</h1>
					<p className="text-2xl">Winner: {username}</p>
					<button className={"bg-emerald-600 px-2 py-1 m-2 rounded-full shadow shadow-indigo-900 hover:bg-emerald-700 hover:text-slate-100 active:scale-90 transition-transform"} onClick={handleReset}>Play Again</button>
				</div>
		) : (
      	<div id={"GameSpace"} className="bg-slate-700 h-full w-[60rem] p-4 rounded-md shadow-lg shadow-indigo-950 flex flex-col justify-center items-center"> 
				<div id={"Title"} className="text-4xl text-indigo-500">Emoji Who</div>

				<div className={"flex gap-16 h-full max-h-full pt-4"} style={{maxHeight: "calc(100% - 3rem)"}}>
					<div id={"Board"} className="grid grid-cols-5 grid-rows-6 gap-1">
						{tiles.map((tile, index) => (
							<div title={tile.name} id={"Tile"} key={index} onClick={() => handleTileClick(index)} className={cn("relative w-20 h-24 p-2 flex flex-col items-center justify-center overflow-hidden rounded-md hover:animate-pulse transition-transform duration-300 ease-in-out hover:scale-110", getTileClass(tile.state))}>
    							<div id={"TileBorder"} className="absolute inset-0 z-10 rounded-md border-2 border-slate-400"></div>

								{/* Emoji name layer */}
								<div className="flex flex-grow flex-1 relative z-10 text-slate-50 text-opacity-40 font-bold -mt-2 text-sm text-center">
								  {tile.name}
							 	</div>

								{/* Emoji layer */}
								<div id={"TileEmoji"} className="relative z-0 text-7xl leading-[.85]">
								  {tile.emoji}
							 </div>
						</div>
						))}
				</div>
				
<div id={"Panel"} className="bg-slate-400 p-4 flex flex-col max-h-full h-full w-80 gap-4 rounded-md shadow-md shadow-slate-700">
	<div className={"flex flex-1 flex-col"}>
		<div className={"flex px-2 text-xl items-baseline justify-between"}>
			<div>{username}: </div>
			<div className={"text-3xl ease-in-out duration-[10s] animate-pulse"} title={correctAnswer.name}>{correctAnswer.emoji}</div>
		</div>
	
		{/* Chat log or other content */}
		<div className="flex flex-grow flex-1 flex-col bg-slate-50 overflow-y-auto max-h-full rounded-md shadow-inner shadow-slate-500">
			{chatLog.map((msg, index) => (
				<p key={index} className={"text-slate-900 text-left pl-2"}>{msg}</p>
			))}
	  </div>
		
		<div className={"flex flex-row"}>
			<input type={"text"} value={text} onChange={(e) => {setText(e.target.value)}} className={"w-full flex-grow flex-1 mt-1 p-2 h-10 border-2 border-slate-400 rounded-md"}></input>
			<button className={"bg-blue-600 p-2 mt-1 text-white rounded-md hover:text-slate-100 hover:bg-blue-700 active:scale-90 transition-transform"} onClick={() => handleTextSending(text)}>Send</button>
		</div>
	</div>

	{/* Guess section */}
	<div className="flex flex-row items-center w-full">
    <button onClick={handleGuessEvent} className={cn("w-full rounded-l-md h-10 text-white transition-transform active:scale-90", currentGuess ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-500 hover:cursor-not-allowed")}>
      Submit Guess
    </button>
		
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("text-3xl pt-[.35rem] bg-white text-white rounded-r-md w-12 h-10 cursor-pointer", currentGuess ? "" : "animate-pulse")}>
        {currentGuess?.emoji}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white max-h-96 overflow-y-auto w-fit min-w-fit max-w-fit" side="top">
        {tiles
			  .filter(
				  (emoji) => tiles.find((tile) => tile.emoji === emoji.emoji)?.state !== tileState.Eliminated
			  )
			  .map((emoji) => (
				  <DropdownMenuItem
					  key={emoji.emoji}
					  className="hover:bg-slate-200 w-fit text-3xl"
					  onClick={() => setCurrentGuess(emoji)}
				  >
              {emoji.emoji}
            </DropdownMenuItem>
			  ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>
					
	</div>
	</div>
		)}
</div>);
}

export default App;
