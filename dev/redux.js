const { createStore } = require("redux");

const store = createStore((state = [], action) => {
    if(action.type == "add") return [action.data, ...state];
    if(action.type == "del") return state.filter(item => item.name != action.name);
    return state;
});

store.subscribe(() => {
    console.log(store.getState());
});

store.dispatch({type: 'add', data: { name: 'Apple'} });
store.dispatch({type: 'add', data: { name: 'Orange'} });
store.dispatch({type: 'del',  name: 'Apple'} );
store.dispatch({type: 'add', data: { name: 'Mango'} });