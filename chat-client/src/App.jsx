import { useState, useEffect, useRef } from "react";

export default function App() {
	const [messages, setMessages] = useState([]);
	const [name, setName] = useState("Anon");
	const [isEditingName, setIsEditingName] = useState(false);

	const nameRef = useRef();
	const msgRef = useRef();

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8888/connect");

		ws.addEventListener("message", e => {
			setMessages(JSON.parse(e.data));
		});

		ws.addEventListener("error", e => {
			console.log("WebSocket error:", e);
		});

		ws.addEventListener("close", () => {
			console.log("WebSocket connection closed");
		});

		fetch("http://localhost:8888").then(async res => {
			const data = await res.json();
			setMessages(data);
		});

		return () => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.close();
			}
		};
	}, []);

	return (
		<div className="max-w-2xl mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6 text-center">Chat</h1>
			<div className="mb-1">
				<span className="text-sm text-gray-600">Chatting as: </span>
				{isEditingName ? (
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onBlur={() => setIsEditingName(false)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								setIsEditingName(false);
							}
						}}
						className="inline-block px-2 py-1 text-blue-600 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
						autoFocus
					/>
				) : (
					<button
						onClick={() => setIsEditingName(true)}
						className="inline-block px-2 py-1 text-blue-600 font-semibold hover:bg-blue-50 rounded"
					>
						{name}
					</button>
				)}
			</div>
			<form
				className="mb-6 space-y-2"
				onSubmit={e => {
					e.preventDefault();
					const msg = msgRef.current.value;
					if (!msg) return false;

					fetch("http://localhost:8888/chat", {
						method: "POST",
						body: JSON.stringify({ name, msg }),
						headers: {
							"Content-Type": "application/json",
						},
					}).catch(err => {
						console.error("Error sending message:", err);
					});

					msgRef.current.value = "";
					msgRef.current.focus();
				}}>
				<input 
					type="text" 
					ref={msgRef}
					placeholder="Type your message"
					className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
				/>
				<button 
					type="submit"
					className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
				>
					Send
				</button>
			</form>
			<ul className="space-y-2">
				{messages.map(message => {
					return (
						<li 
							key={message.id}
							className="p-3 bg-gray-100 rounded-lg"
						>
							<span className="font-bold text-blue-600">{message.name}:</span>
							<span className="ml-2">{message.msg}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}