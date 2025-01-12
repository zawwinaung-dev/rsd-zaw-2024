import { useState, useEffect, useRef } from "react";

export default function App() {
	const [messages, setMessages] = useState([]);

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
		<div>
			<h1>Chat</h1>
			<form
				onSubmit={e => {
					e.preventDefault();
					const name = nameRef.current.value;
					const msg = msgRef.current.value;
					if (!name || !msg) return false;

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
				<input type="text" ref={nameRef} />
				<br />
				<input type="text" ref={msgRef} />
				<button type="submit">Add</button>
			</form>
			<ul>
				{messages.map(message => {
					return (
						<li key={message.id}>
							<b>{message.name}:</b>
							{message.msg}
						</li>
					);
				})}
			</ul>
		</div>
	);
}