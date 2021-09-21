const calculateTotal = () => {
    return data.datasets[0].data.reduce((a, b) => a + b, 0);
}