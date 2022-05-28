function calculo(num){
    const result = [];

    for (let n = 0; n < 5e8; n++) {
        const element = Math.floor((Math.random() * (num - 1 + 1)) + 1);
        result.push(element);
    }
    return result;
}

process.on('exit', () => {
    console.log(`Proceso #${process.pid} cerrado`);
})

process.on('message', num, msg => {
    console.log(`Proceso #${process.pid} iniciando`);
    const resultado = calculo(num);
    process.send({resultado: resultado});
    console.log(`Proceso #${process.pid} finalizó su trabajo`);
    process.exit();
})