import {useState} from "react"

import Header from "./components/Header"
import Item from "./components/Item"
import Form from "./components/Form"
import { Container } from "@mui/material";
import { useApp } from "./AppProvider";
import AppDrawer from "./components/AppDrawer";
import { Outlet } from "react-router";

export default function App() {
	const { showForm } = useApp();

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
			<AppDrawer />
			<Container sx={{ mt:4}} maxWidth="md" >
				{/* {showForm && <Form add={add}/>}

				{posts.map(post => (
					<Item 
						key={post.id}
						post={post}
						remove={remove}
					/>
				))} */}
				<Outlet />
			</Container>
		</div>
	)
}