function a() {
    console.log("Function A");
}

function b() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Function B");
        }, 2000);
    })
}


function c() {
    console.log("Function C");
}

// a();
// b().then(value => {
//     console.log(value);
//     c();
// })

async function app() {
    a();
    console.log(await b());
    c();
}

app();