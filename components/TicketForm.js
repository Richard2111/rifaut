"use client"; // Directiva necesaria para componentes con interactividad en el App Router

import { useState } from 'react';

// Lista de prefijos de operadoras
const phoneOperators = ['0414', '0424', '0412', '0416', '0426'];

export default function TicketForm() {
  // --- ESTADO DEL FORMULARIO ---
  // Usamos useState para manejar el estado de cada campo del formulario.
  const [ticketCount, setTicketCount] = useState(1); // Contador de tickets, inicia en 1
  const [operator, setOperator] = useState(phoneOperators[0]); // Operadora, inicia con la primera de la lista
  const [phoneNumber, setPhoneNumber] = useState(''); // Número de teléfono
  const [reference, setReference] = useState(''); // Referencia de pago
  const [fullName, setFullName] = useState(''); // Nombre y apellido

  // --- LÓGICA DE NEGOCIO ---
  const TICKET_PRICE = 5.0; // Precio por cada ticket
  const totalPrice = ticketCount * TICKET_PRICE; // Cálculo del precio total

  // --- MANEJADORES DE EVENTOS ---
  const handleIncrement = () => {
    setTicketCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    // Evita que el contador baje de 1
    setTicketCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Previene que la página se recargue al enviar

    // Aquí es donde enviarías los datos a tu backend o API
    const formData = {
      tickets: ticketCount,
      total: totalPrice,
      phone: `${operator}${phoneNumber}`,
      reference,
      fullName,
    };

    console.log('Datos del formulario a enviar:', formData);
    alert(`Se esta validando el Pago Móvil.`);
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Rifa bera SBR con el luis
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Completa el formulario para asegurar tu compra.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Contador de Tickets --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad de Tickets
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
        <div className="text-center bg-gray-100 p-4 rounded-lg">
          <span className="text-lg font-medium text-gray-600">Precio Total:</span>
          <span className="ml-2 text-2xl font-bold text-blue-600">
            ${totalPrice.toFixed(2)}
          </span>
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
              placeholder="1234567"
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900"
              required
              pattern="\d{7}" // Valida que sean exactamente 7 dígitos
            />
          </div>
        </div>

        {/* --- Referencia --- */}
        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
            Número de Referencia del Pago Móvil, ultimos 6 dígitos.
          </label>
          <input
            type="text"
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value.replace(/\D/g, ''))} // Solo permite dígitos
            maxLength="6"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900"
            required
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
    </div>
  );
}