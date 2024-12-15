let value = 123;

type User = {
    name: String;
    age: Number;
    gender?: 'male' | 'female';
}

let bob: User = {
    name: 'Bob',
    age: 22,
    gender: 'male',
}

interface Student {
    name: String;
    age: Number;
}

interface Student {
    grade: "A" | "B" | "C" | "F";
}

let alice: Student = {
    name: 'Alice',
    age: 23,
    grade: "A",
}

function hello(user: User & { email: String}) {
    console.log(`Hello ${user.name}`);
    return `Hello ${user.name}`;
}

function hi(user: {username: String; email: String; }) {
    return `Hello ${user.username}`;
}

// hello(bob);

type Res<T> = {
    data: T;
}

type Post = {
    title: String;
}

type Category = {
    name: String;
}

let post: Res<Post> = {
    data: {
        title: "Post Title",
    }
}

let category: Res<Category> = {
    data: {
        name: "Cat",
    }
}