async function info() {
    let a = await new Promise((res, rej) => {
        rej("");
    })
}
info().catch(e => console.log(e+"2222222222222222"))