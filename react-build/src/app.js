function Element(props) {
    return (
        <ul>
            <li>Item One</li>
            <li>Item Two</li>
            <li>Item Three</li>
        </ul>
     )
}

ReactDOM.render(
    <Element />,
    document.getElementById("app")
)