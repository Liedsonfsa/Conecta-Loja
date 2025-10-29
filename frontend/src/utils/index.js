// Em: frontend/src/utils/index.js

/**
 * Formata um número como moeda brasileira (BRL).
 * @param {number} value - O valor a ser formatado.
 * @returns {string} - O valor formatado como "R$ XX,XX".
 */
export const formatCurrency = (value) => {
  if (typeof value !== "number") {
    return "R$ 0,00";
  }
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

/**
 * Formata uma data/hora (string ISO ou objeto Date) para um formato legível.
 * @param {string | Date} dateTime - A data/hora a ser formatada.
 * @returns {string} - A data formatada como "DD/MM/AAAA HH:mm".
 */
export const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  try {
    const date = new Date(dateTime);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Data inválida";
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
export const exportToCSV = (data, filename = "export.csv") => {
  if (!data || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // Cabeçalho
    ...data.map((row) =>
      headers.map((fieldName) => JSON.stringify(row[fieldName])).join(",")
    ),
  ];

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Gera URL do WhatsApp com mensagem formatada do pedido
 * @param {Object} orderData - Dados do pedido
 * @param {Object} customerData - Dados do cliente
 * @param {Array} items - Itens do pedido
 * @returns {string} - URL do WhatsApp
 */
export const generateWhatsAppOrderURL = (orderData, customerData, items) => {
  const phoneNumber = "89981156819"; // Número da loja

  // Formatar data e hora
  const orderDate = formatDateTime(new Date());

  // Calcular totais
  const subtotal = items.reduce(
    (sum, item) => (item.price || 0) * (item.quantity || 1) + sum,
    0
  );
  const total = subtotal; // Sem taxa de entrega por enquanto

  // Construir mensagem
  let message = `#### NOVO PEDIDO ####\n\n`;
  message += `⿪   Nº pedido: ${
    orderData.numeroPedido || orderData.id || "N/A"
  }\n`;
  message += `feito em ${orderDate}\n\n`;
  message += `👤   ${customerData.name || "Cliente"}\n`;

  if (customerData.phone) {
    // Formatar telefone se necessário
    const formattedPhone = formatPhoneNumber(customerData.phone);
    message += `📞   ${formattedPhone}\n`;
  }

  message += `\n------- ITENS DO PEDIDO -------\n\n`;

  items.forEach((item, index) => {
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    const itemTotal = price * quantity;
    message += `${quantity} x ${item.name || "Produto"}\n`;
    message += `💵 ${quantity} x ${formatCurrency(price)} = ${formatCurrency(
      itemTotal
    )}\n\n`;
  });

  message += `-------------------------------\n\n`;
  message += `SUBTOTAL: ${formatCurrency(subtotal)}\n`;
  message += `VALOR FINAL: ${formatCurrency(total)}\n\n`;
  message += `📝 *Por favor, informe a forma de pagamento desejada.*`;

  console.log("Generated message:", message);

  // Codificar mensagem para URL
  const encodedMessage = encodeURIComponent(message);

  // Retornar URL do WhatsApp
  return `https://wa.me/55${phoneNumber}?text=${encodedMessage}`;
};

/**
 * Formata número de telefone para exibição
 * @param {string} phone - Número de telefone
 * @returns {string} - Número formatado
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");

  // Formato brasileiro: (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7
    )}`;
  }

  // Retorna como está se não conseguir formatar
  return phone;
};

/**
 * Abre WhatsApp com mensagem do pedido
 * @param {Object} orderData - Dados do pedido
 * @param {Object} customerData - Dados do cliente
 * @param {Array} items - Itens do pedido
 */
export const openWhatsAppOrder = (orderData, customerData, items) => {
  const whatsappURL = generateWhatsAppOrderURL(orderData, customerData, items);
  window.open(whatsappURL, "_blank");
};
