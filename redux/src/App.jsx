import { useSelector, useDispatch } from "react-redux";
import { add, del, toggle } from "./todoSlice";

import { useRef } from "react";

export default function App() {
  const todo = useSelector((state) =>
    state.todo.tasks.filter((item) => !item.done)
  );
  const done = useSelector((state) =>
    state.todo.tasks.filter((item) => item.done)
  );

  const dispatch = useDispatch();
  const nameRef = useRef();

  return (
    <>
      <h1>Todo</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = nameRef.current.value;

          if (!name) return false;

          dispatch(add(name));
          e.currentTarget.reset();
        }}
      >
        <input type="text" ref={nameRef} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todo.map((item) => {
          return (
            <li key={item.id}>
              <button
                onClick={() => {
                  dispatch(toggle(item.id));
                }}
              >
                Check
              </button>
              {item.name}

              <button
                onClick={() => {
                  dispatch(del(item.id));
                }}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>

      <h2>Completed</h2>
      <ul>
        {done.map((item) => {
          return (
            <li key={item.id}>
              <button
                onClick={() => {
                  dispatch(toggle(item.id));
                }}
              >
                Undo
              </button>
              {item.name}

              <button
                onClick={() => {
                  dispatch(del(item.id));
                }}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
