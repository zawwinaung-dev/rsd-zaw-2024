import {useState, useRef} from "react"

import Header from "./components/Header"
import Item from "./components/Item"
import { Container } from "@mui/material";

export default function App() {
	const inputRef = useRef();

	const [posts, setPosts] = useState([
		{id: 3, content: "More Content", user: "Zaw"},
		{id: 2, content: "Some Content", user: "Alice"},
		{id: 1, content: "Anoter Content", user: "Bob"}
	]);

	const add = content => {
		const id = posts[0] ? posts[0].id + 1 : 1;
		setPosts([{ id, content, user:"Alice"}, ...posts]);
	}

	const remove = id => {
		setPosts(posts.filter(post => post.id != id));
	}

	return (
		<div>
			<Header />
			<Container sx={{ mt:4}} maxWidth="md" >
				<form style={{ marginBottom: 20, display: "flex"}} onSubmit={ e => {
					e.preventDefault();

					const content = inputRef.current.value;
					content && add(content);
					// add(content);

					e.currentTarget.reset();
				}}>
					<input type="text" style={{ flexGrow: 1}} ref={inputRef} />
					<button>Add</button>
				</form>

				{posts.map(post => (
					<Item 
						key={post.id}
						post={post}
						remove={remove}
					/>
				))}
			</Container>
		</div>
	)
}