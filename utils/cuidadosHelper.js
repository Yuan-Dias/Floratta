// Retorna a quantidade de dias entre execuções
export function getFrequenciaEmDias(cuidado) {
    const freq = cuidado.frequencia;
    if (!freq || freq.tipo === 'diario') return 1;
    if (freq.tipo === 'dias') return freq.valor || 1;
    if (freq.tipo === 'semanal') {
        const vezes = freq.valor || 1;
        // Ex.: 3 vezes por semana → 7/3 = 2.33, arredondamos para 3 dias (ceil) para garantir que o
        // cuidado apareça antes de passar do prazo.
        return Math.ceil(7 / vezes);
    }
    return 1;
}

export function obterStatusCuidado(cuidado) {
    const hoje = new Date();
    const hojeDate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const diasFrequencia = getFrequenciaEmDias(cuidado);

    if (cuidado.ultimaConclusao) {
        const ultima = new Date(cuidado.ultimaConclusao);
        const ultimaDate = new Date(ultima.getFullYear(), ultima.getMonth(), ultima.getDate());

        if (ultimaDate.getTime() === hojeDate.getTime()) return 'concluido';

        const proxima = new Date(ultimaDate);
        proxima.setDate(proxima.getDate() + diasFrequencia);

        if (hojeDate < proxima) return 'concluido';
        if (hojeDate.getTime() === proxima.getTime()) return 'pendente';
        return 'atrasado';
    } else {
        const criacao = new Date(cuidado.criadoEm);
        const criacaoDate = new Date(criacao.getFullYear(), criacao.getMonth(), criacao.getDate());
        const primeiraVez = new Date(criacaoDate);
        primeiraVez.setDate(primeiraVez.getDate() + diasFrequencia);

        if (hojeDate < primeiraVez) return 'concluido';
        if (hojeDate.getTime() === primeiraVez.getTime()) return 'pendente';
        return 'atrasado';
    }
}

export function obterStatusPlanta(planta) {
    if (!planta.cuidados || planta.cuidados.length === 0) return 'Sem cuidados';
    const statuses = planta.cuidados.map(c => obterStatusCuidado(c));
    if (statuses.includes('atrasado')) return 'Atrasada';
    if (statuses.includes('pendente')) return 'Pendente';
    return 'Em dia';
}

export function obterStatusCuidadoNaData(cuidado, dataRef) {
    const dataRefDate = new Date(dataRef.getFullYear(), dataRef.getMonth(), dataRef.getDate());
    const diasFrequencia = getFrequenciaEmDias(cuidado);

    if (cuidado.ultimaConclusao) {
        const ultima = new Date(cuidado.ultimaConclusao);
        const ultimaDate = new Date(ultima.getFullYear(), ultima.getMonth(), ultima.getDate());

        // Se concluído exatamente na data de referência
        if (ultimaDate.getTime() === dataRefDate.getTime()) {
            return 'concluido';
        }

        const proxima = new Date(ultimaDate);
        proxima.setDate(proxima.getDate() + diasFrequencia);

        if (dataRefDate < proxima) return 'concluido';
        if (dataRefDate.getTime() === proxima.getTime()) return 'pendente';
        return 'atrasado';
    } else {
        const criacao = new Date(cuidado.criadoEm);
        const criacaoDate = new Date(criacao.getFullYear(), criacao.getMonth(), criacao.getDate());
        const primeiraVez = new Date(criacaoDate);
        primeiraVez.setDate(primeiraVez.getDate() + diasFrequencia);

        if (dataRefDate < primeiraVez) return 'concluido';
        if (dataRefDate.getTime() === primeiraVez.getTime()) return 'pendente';
        return 'atrasado';
    }
}