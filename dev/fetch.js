const api = 'http://localhost:8080/post/1'

fetch(api)
    .then(async res => {
        const post = await res.json();
        console.log(post);
    })