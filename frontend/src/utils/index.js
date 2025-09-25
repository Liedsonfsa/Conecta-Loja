// Em: frontend/src/utils/index.js

/**
 * Formata um número como moeda brasileira (BRL).
 * @param {number} value - O valor a ser formatado.
 * @returns {string} - O valor formatado como "R$ XX,XX".
 */
export const formatCurrency = (value) => {
    if (typeof value !== 'number') {
        return 'R$ 0,00';
    }
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

/**
 * Formata uma data/hora (string ISO ou objeto Date) para um formato legível.
 * @param {string | Date} dateTime - A data/hora a ser formatada.
 * @returns {string} - A data formatada como "DD/MM/AAAA HH:mm".
 */
export const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    try {
        const date = new Date(dateTime);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        return 'Data inválida';
    }
};

/**
 * Cria uma função "debounced" que atrasa a invocação da função `func`
 * até que `wait` milissegundos tenham se passado desde a última vez que foi invocada.
 * @param {Function} func - A função a ser "debounced".
 * @param {number} wait - O número de milissegundos para atrasar.
 * @returns {Function} - A nova função "debounced".
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Converte um array de objetos em uma string CSV e inicia o download.
 * @param {Array<Object>} data - Os dados a serem exportados.
 * @param {string} filename - O nome do arquivo CSV a ser baixado.
 */
export const exportToCSV = (data, filename = 'export.csv') => {
    if (!data || data.length === 0) {
        return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // Cabeçalho
        ...data.map(row =>
            headers.map(fieldName => JSON.stringify(row[fieldName])).join(',')
        )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};