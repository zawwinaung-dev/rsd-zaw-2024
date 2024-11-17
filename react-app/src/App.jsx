import Header from "./Header"

function Item({ content, user }) {
	return <li>
		{content} by {user}
	</li>
}

function List({ children }) {
	return <ul>
		{children}
	</ul>
}

export default function App() {
	return (
		<div>
			<Header />
			<List>
				<Item content="Apple" user="Alice" />
				<Item content="Orange" user="Bob" />
			</List>
		</div>
	)
}