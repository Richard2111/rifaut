"use client"; // Directiva necesaria para componentes con interactividad en el App Router

import { useState, Fragment } from 'react'; // Importamos Fragment
import Image from 'next/image'; // Importamos el componente de Imagen de Next.js
import { banks } from './banks'; // Importamos la lista de bancos

// Lista de prefijos de operadoras
const phoneOperators = ['0412', '0424', '0414', '0416', '0426', '0422'];

export default function TicketForm() {
  // --- ESTADO DEL FORMULARIO ---
  // Usamos useState para manejar el estado de cada campo del formulario.
  const [ticketCount, setTicketCount] = useState(1); // Contador de tickets, inicia en 1
  const [operator, setOperator] = useState(phoneOperators[0]); // Operadora, inicia con la primera de la lista
  const [phoneNumber, setPhoneNumber] = useState(''); // Número de teléfono
  const [reference, setReference] = useState(''); // Referencia de pago
  const [fullName, setFullName] = useState(''); // Nombre y apellido
  const [copiedItem, setCopiedItem] = useState(null); // Estado para feedback visual al copiar
  const [selectedBankId, setSelectedBankId] = useState(banks[0].id); // Estado para el ID del banco seleccionado
  const [loading, setLoading] = useState(false); // Estado para el preloader

  // --- LÓGICA DE NEGOCIO ---
  const TICKET_PRICE = 100.0; // Precio por cada ticket
  const totalPrice = ticketCount * TICKET_PRICE; // Cálculo del precio total

  // --- MANEJADORES DE EVENTOS ---
  const handleIncrement = () => {
    setTicketCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    // Evita que el contador baje de 1
    setTicketCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
  };

  // Función para copiar texto al portapapeles
  const handleCopy = (textToCopy, itemName) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Muestra feedback visual
      setCopiedItem(itemName);
      // Resetea el feedback después de 2 segundos
      setTimeout(() => {
        setCopiedItem(null);
      }, 2000);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Mostrar preloader
    const MIN_TIMEOUT = 2000; // milisegundos
    const startTime = Date.now();
    const formData = {
      entradas: ticketCount,
      monto: totalPrice,
      phoneNumber: `${operator}${phoneNumber}`,
      bankId: selectedBankId,
      referenceNumber: reference,
      fullName,
    };
    console.log('JSON enviado:', JSON.stringify(formData)); // Imprime el JSON en consola
    try {
      // Reemplaza la URL por la de tu backend/API
      const response = await fetch("https://ejemplo.com/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      // Aquí puedes manejar la respuesta, por ejemplo mostrar un mensaje de éxito
      alert(`¡Gracias, ${fullName}! Tu compra ha sido registrada.`);
    } catch (error) {
      alert("Hubo un error al procesar la compra. Intenta de nuevo.");
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = MIN_TIMEOUT - elapsed;
      if (remaining > 0) {
        setTimeout(() => setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-xl shadow-lg">
      {/* Preloader */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 flex-col">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          <span className="ml-4 text-white text-xl font-bold">Por favor espera un momento, estamos procesando tu compra...</span>
          <p className="mt-4 text-white text-base text-center">No cierres, ni recargues la página hasta que el proceso termine.</p>
          <p className="mt-4 text-white text-base text-center">Si no se puede verificar el Pago Móvil verifique los datos ingresados e intente nuevamente.</p>
          <p className="mt-4 text-white text-base text-center">Si usted realizo el pago y esta completamente seguro que los datos que ingreso son correctos, por favor, comuniquese con Soporte mediante un mensaje de WhatsApp.</p>
        </div>
      )}

      <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
        {'"SBR 2025"'}
      </h2>

      <p className="text-center text-black mb-3">
        Premio: (1) Una - Moto SBR 2025.
      </p>

      {/* --- Imagen del Premio --- */}
      <div className="my-3">
        <Image
          src="/SBR-2025-NEGRO.png"
          alt="Moto Bera SBR"
          width={150}
          height={150}
          className="mx-auto rounded-lg shadow-md object-cover"
          priority // Ayuda a que la imagen cargue más rápido
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* --- Contador de Tickets --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccione la cantidad de Tickets que desea comprar
          </label>
          <div className="flex items-center justify-center gap-4 p-2 border rounded-lg">
            <button
              type="button"
              onClick={handleDecrement}
              className="px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition-colors"
            >
              -
            </button>
            <span className="text-2xl font-bold font-mono w-16 text-center text-gray-900">{ticketCount}</span>
            <button
              type="button"
              onClick={handleIncrement}
              className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* --- Precio Total --- */}
        <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
          <div>
            <span className="text-lg font-medium text-gray-600">Monto:</span>
            <span className="ml-2 text-2xl font-bold text-blue-600">
              Bs. {totalPrice.toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(totalPrice.toFixed(2), 'total')}
            className="rounded-md bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-300 transition-colors"
          >
            {copiedItem === 'total' ? '¡Copiado!' : 'Copiar'}
          </button>
        </div>

        {/* --- Datos para el Pago Móvil --- */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-center font-semibold text-gray-800">
            Datos para pagar por Pago Móvil
          </h3>
          {/* Cédula */}
          <div>
            <label className="text-sm font-medium text-gray-600">Cédula de Identidad</label>
            <div className="mt-1 flex items-center justify-between rounded-md bg-white p-2 border border-gray-300">
              <span className="font-mono text-lg font-bold text-gray-900">
                <span className="text-gray-500">V-</span>23526847
              </span>
              <button
                type="button"
                onClick={() => handleCopy('23526847', 'id')}
                className="rounded-md bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-300 transition-colors"
              >
                {copiedItem === 'id' ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
          {/* Teléfono */}
          <div>
            <label className="text-sm font-medium text-gray-600">Número de Teléfono</label>
            <div className="mt-1 flex items-center justify-between rounded-md bg-white p-2 border border-gray-300">
              <span className="font-mono text-lg font-bold text-gray-900">
                <span className="text-gray-500">0412-</span>8016133
              </span>
              <button
                type="button"
                onClick={() => handleCopy('8016133', 'phone')}
                className="rounded-md bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-300 transition-colors"
              >
                {copiedItem === 'phone' ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
          {/* Banco */}
          <div>
            <label className="text-sm font-medium text-gray-600">Banco</label>
            <div className="mt-1 rounded-md bg-white p-2 border border-gray-300 font-mono text-lg font-bold text-gray-900">
              0102 - Banesco
            </div>
          </div>
        </div>

{/* --- Nombre y Apellido --- */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Nombre y Apellido
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value.replace(/[^\p{L}\s]/gu, ''))} // Solo permite letras y espacios
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900"
            maxLength="30"
            required
          />
        </div>

        {/* --- Número de Teléfono --- */}
        <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Número de Teléfono
          </label>
          <div className="flex mt-1">
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="px-3 py-2 bg-white border border-r-0 border-gray-300 rounded-l-md focus:outline-none font-medium text-gray-800"
            >
              {phoneOperators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} // Solo permite dígitos
              maxLength="7"
              placeholder=""
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900"
              required
              pattern="\d{7}" // Valida que sean exactamente 7 dígitos
            />
          </div>
        </div>

        {/* --- Selector de Banco --- */}
        <div>
          <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
            Banco desde donde se realizó el Pago Móvil
          </label>
          <select
            id="bank"
            value={selectedBankId}
            onChange={(e) => setSelectedBankId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900"
            required
          >
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.id} - {bank.name}
              </option>
            ))}
          </select>
        </div>

        {/* --- Referencia --- */}
        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
            Referencia del Pago Móvil (Últimos 6 dígitos)
          </label>
          <input
            type="text"
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value.replace(/\D/g, ''))} // Solo permite dígitos
            minLength={6} // Mínimo 6 caracteres
            maxLength="6"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900"
            required
            pattern="\d{6}"
          />
        </div>

        {/* --- Botón de Envío --- */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        >
          Comprar Tickets
        </button>
      </form>

<div className="flex justify-center mt-6">
  <a
    href="https://wa.me/584125977292" // Reemplaza por el número de soporte
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-full shadow hover:bg-green-600 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="text-white">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.85.504 3.59 1.382 5.08L2 22l5.08-1.382A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.64 0-3.17-.5-4.45-1.36l-.32-.21-3.01.82.81-2.94-.21-.33A7.96 7.96 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.13-6.19c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.51.12-.15.23-.58.75-.71.9-.13.15-.26.17-.49.06-.23-.12-.97-.36-1.85-1.13-.68-.6-1.14-1.34-1.27-1.57-.13-.23-.01-.35.1-.47.1-.1.23-.26.34-.39.11-.13.15-.23.23-.38.08-.15.04-.29-.02-.41-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39-.13-.01-.29-.01-.45-.01-.16 0-.41.06-.62.29-.21.23-.81.79-.81 1.93s.83 2.23.95 2.39c.12.15 1.63 2.5 3.95 3.4.55.19.98.3 1.31.38.55.14 1.05.12 1.45.07.44-.07 1.36-.56 1.55-1.1.19-.54.19-1 .13-1.1-.06-.1-.21-.16-.44-.28z"/>
    </svg>
    <span className="text-white font-semibold">Soporte WhatsApp</span>
  </a>
</div>
    </div>
  );
}