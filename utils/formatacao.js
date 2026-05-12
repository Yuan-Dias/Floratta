export function formatarFrequencia(frequencia) {
    if (!frequencia) return '';
    if (typeof frequencia === 'string') return frequencia; // compatibilidade
    if (frequencia.tipo === 'diario') return 'Todo dia';
    if (frequencia.tipo === 'dias') return `A cada ${frequencia.valor} dias`;
    if (frequencia.tipo === 'semanal') return `${frequencia.valor}x por semana`;
    return '';
}