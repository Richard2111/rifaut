"use client"; // Directiva necesaria para componentes con interactividad en el App Router

import { useState } from 'react';
import Image from 'next/image'; // Importamos el componente de Imagen de Next.js

// Lista de prefijos de operadoras
const phoneOperators = ['0414', '0424', '0412', '0422', '0416', '0426'];

export default function TicketForm() {
  // --- ESTADO DEL FORMULARIO ---
  // Usamos useState para manejar el estado de cada campo del formulario.
  const [ticketCount, setTicketCount] = useState(1); // Contador de tickets, inicia en 1
  const [operator, setOperator] = useState(phoneOperators[0]); // Operadora, inicia con la primera de la lista
  const [phoneNumber, setPhoneNumber] = useState(''); // Número de teléfono
  const [reference, setReference] = useState(''); // Referencia de pago
  const [fullName, setFullName] = useState(''); // Nombre y apellido
  const [copiedItem, setCopiedItem] = useState(null); // Estado para feedback visual al copiar

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

      {/* --- Imagen del Premio --- */}
      <div className="my-6">
        <Image
          src="/SBR-2025-NEGRO.png" // Asegúrate de que este sea el nombre de tu archivo en la carpeta /public
          alt="Premio de la rifa: Moto Bera SBR"
          width={100}
          height={100}
          className="mx-auto rounded-lg shadow-md object-cover"
          priority // Ayuda a que la imagen cargue más rápido
        />
      </div>

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
        <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
          <div>
            <span className="text-lg font-medium text-gray-600">Precio Total:</span>
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

        {/* --- Datos para el Pago Móvil --- */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-center font-semibold text-gray-800">
            Datos para el Pago Móvil
          </h3>
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
          {/* Banco */}
          <div>
            <label className="text-sm font-medium text-gray-600">Banco</label>
            <div className="mt-1 rounded-md bg-white p-2 border border-gray-300 font-mono text-lg font-bold text-gray-900">
              Banesco
            </div>
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