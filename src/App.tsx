import { useState, useEffect } from "react";
import "./App.css";
import { Card } from "./Types/Card";
import CardCreator from "./Components/CardCreator";
import CardList from "./Components/CardList";
import StudyView from "./Components/StudyView";
import { Deck } from "./Types/Deck";
import { cursorTo } from "readline";
import { EditCard } from "./Components/EditCard";

function App() {
	// const [localCards, setLocalCards] = useState<Card[]>([]);
	const [localDecks, setLocalDecks] = useState<Deck[]>([]);
	const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
	const [isInitialized, setIsInitialized] = useState(false); // Track initialization
	const [view, setView] = useState<
		"create" | "list" | "study" | "decks" | "edit"
	>("decks");
	const [cardToEdit, setCardToEdit] = useState<Card | null>(null);

	// Initial load of cards from localStorage
	useEffect(() => {
		const saved = localStorage.getItem("decks");
		console.log("Raw localStorage data:", saved);
		console.log("JSON stringified saved:", JSON.stringify(saved));
		if (saved) {
			try {
				const parsedDecks = JSON.parse(saved);
				console.log("Parsed decks:", parsedDecks);
				if (Array.isArray(parsedDecks)) {
					// Validate card structure
					setLocalDecks(parsedDecks);
				} else {
					console.error("Parsed data is not an array:", parsedDecks);
				}
			} catch (error) {
				console.error("Error parsing localStorage decks:", error);
			}
		}
		setIsInitialized(true); // Mark initialization complete
	}, []);

	// Update localStorage when localCards changes, after initialization
	useEffect(() => {
		if (isInitialized) {
			console.log("Saving to localStorage:", localDecks);
			localStorage.setItem("decks", JSON.stringify(localDecks));
		} else {
			console.log("Skipping save to localStorage: not initialized yet");
		}
	}, [localDecks, isInitialized]);

	const createDeck = () => {
		const name = prompt("Enter deck name:");
		if (!name) return;
		const newDeck: Deck = { id: Date.now(), name, cards: [] };
		setLocalDecks((prev) => [...prev, newDeck]);
		setSelectedDeck(newDeck);
		setView("list");
	};

	const addCardToDeck = (card: Card) => {
		if (!selectedDeck) return;
		setLocalDecks((prevDecks) =>
			prevDecks.map((deck) =>
				deck.id === selectedDeck.id
					? { ...deck, cards: [...deck.cards, card] }
					: deck
			)
		);
	};

	const deleteDeck = (deckId: number) => {
		if (window.confirm("Are you sure you want to delete this deck?")) {
			setLocalDecks((prev) => prev.filter((deck) => deck.id !== deckId));
			if (selectedDeck?.id === deckId) {
				setSelectedDeck(null);
				setView("decks");
			}
		}
	};

	const saveDecks = () => {
		const blob = new Blob([JSON.stringify(localDecks, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "1_flashcard_decks.json";
		a.click();
		URL.revokeObjectURL(url);
	};

	const loadDecks = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const imported = JSON.parse(
					event.target?.result as string
				) as Deck[];
				if (!Array.isArray(imported))
					throw new Error("Imported data is not an array");
				setLocalDecks((currentDecks) => {
					const existingIds = new Set(currentDecks.map((d) => d.id));
					const newDecks = imported.filter(
						(d) => !existingIds.has(d.id)
					);
					return [...currentDecks, ...newDecks];
				});
				alert("Decks imported successfully!");
			} catch (error) {
				console.error(error);
				alert("Error reading imported file.");
			}
		};
		reader.readAsText(file);
	};

	const currentDeck = selectedDeck
		? localDecks.find((d) => d.id === selectedDeck.id)
		: null;

	// Log current state for debugging
	console.log("Current localDecks in render:", localDecks);

	return (
		<div className="App">
			<h1>Flashcards for My Love</h1>
			<nav>
				<button onClick={() => setView("decks")}>My Decks</button>
				{selectedDeck && (
					<>
						<button onClick={() => setView("list")}>
							My Cards
						</button>
						<button onClick={() => setView("create")}>
							Create Card
						</button>
						<button onClick={() => setView("study")}>Study</button>
					</>
				)}
			</nav>

			{view === "decks" && (
				<div>
					<h2>My Decks</h2>
					<ul>
						{localDecks.length === 0 && (
							<p style={{ fontWeight: "bold" }}>
								No decks available. Create one!
							</p>
						)}
						{localDecks.map((deck) => (
							<li key={deck.id}>
								<button
									onClick={() => {
										setSelectedDeck(deck);
										setView("list");
									}}
								>
									{deck.name}
								</button>
								<button onClick={() => deleteDeck(deck.id)}>
									🗑️
								</button>
							</li>
						))}
					</ul>
					<button onClick={saveDecks}>Save Decks</button>
					<button onClick={createDeck}>New Deck</button>
					<label style={{ cursor: "pointer", fontSize: "14px" }}>
						Upload Decks
						<input
							type="file"
							accept=".json"
							onChange={loadDecks}
							style={{ display: "none" }}
						/>
					</label>
				</div>
			)}

			{view === "create" && currentDeck && (
				<CardCreator
					deckName={currentDeck.name}
					setLocalCards={(updater) => {
						const updated =
							typeof updater === "function"
								? updater(currentDeck.cards)
								: updater;
						addCardToDeck(updated[updated.length - 1]);
					}}
				/>
			)}
			{view === "list" && currentDeck && (
				<CardList
					setCardToEdit={setCardToEdit}
					setView={setView}
					deckName={currentDeck.name}
					localCards={currentDeck.cards}
					setLocalCards={(newCards) => {
						setLocalDecks((prevDecks) =>
							prevDecks.map((deck) =>
								deck.id === currentDeck.id
									? {
											...deck,
											cards:
												typeof newCards === "function"
													? newCards(deck.cards)
													: newCards,
									  }
									: deck
							)
						);
					}}
				/>
			)}
			{view === "study" && currentDeck && (
				<StudyView
					deckName={currentDeck.name}
					localCards={currentDeck.cards}
				/>
			)}
			{view === "edit" && currentDeck && cardToEdit !== null && (
				<EditCard
					setLocalDecks={setLocalDecks}
					setView={setView}
					Deck={currentDeck}
					cardToEdit={cardToEdit}
				/>
			)}
		</div>
	);
}

export default App;
