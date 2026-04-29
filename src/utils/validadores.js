export function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

export function validarCPF(cpf) {
    return cpf && cpf.length === 14;
}