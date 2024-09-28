function DMYdate(data) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return data.toLocaleDateString('pt-BR', options);
}

module.exports = DMYdate;