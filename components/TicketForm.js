"use client"; // Directiva necesaria para componentes con interactividad en el App Router

import { useState, Fragment } from 'react'; // Importamos Fragment
import Image from 'next/image'; // Importamos el componente de Imagen de Next.js
import { Combobox, Transition } from '@headlessui/react'; // Importamos el Combobox
import { banks } from './banks'; // Importamos la lista de bancos

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
  const [copiedItem, setCopiedItem] = useState(null); // Estado para feedback visual al copiar
  const [selectedBank, setSelectedBank] = useState(banks[0]); // Estado para el banco seleccionado
  const [query, setQuery] = useState(''); // Estado para la búsqueda en el combobox

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

  // Lógica para filtrar los bancos según la búsqueda del usuario
  const filteredBanks =
    query === ''
      ? banks
      : banks.filter((bank) =>
          bank.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')) ||
          bank.id.includes(query)
        );

  const handleSubmit = (event) => {
    event.preventDefault(); // Previene que la página se recargue al enviar

    // Aquí es donde enviarías los datos a tu backend o API
    const formData = {
      tickets: ticketCount,
      total: totalPrice,
      phone: `${operator}${phoneNumber}`,
      bankId: selectedBank.id, // Añadimos el ID del banco seleccionado
      reference,
      fullName,
    };

    console.log('Datos del formulario a enviar:', formData);
    alert(`¡Gracias, ${fullName}! Tu compra de ${ticketCount} ticket(s) por Bs. ${totalPrice.toFixed(2)} ha sido registrada.`);
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        {'Rifa "Los Mirandinos"'}
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
        Completa el formulario para asegurar tu compra ganadora.
        Premios:
        1 - SBR 2025.
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
              placeholder=""
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
              Banesco
            </div>
          </div>
        </div>

        {/* --- Selector de Banco de Origen --- */}
        <div>
          <Combobox
            value={selectedBank}
            onChange={(bank) => {
              // Previene que la aplicación falle si el usuario borra la búsqueda.
              // Se asegura de que `selectedBank` no pueda ser nulo, manteniendo siempre un banco seleccionado.
              if (bank) setSelectedBank(bank);
            }}
          >
            <Combobox.Label className="block text-sm font-medium text-gray-700">Banco desde donde se realizó el Pago Móvil</Combobox.Label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <Combobox.Input
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-gray-900"
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(bank) => `${bank.id} - ${bank.name}`}
                placeholder="Buscar por nombre o código..."
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
              </Combobox.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery('')}
              >
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredBanks.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                      No se encontró el banco.
                    </div>
                  ) : (
                    filteredBanks.map((bank) => (
                      <Combobox.Option
                        key={bank.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                          }`
                        }
                        value={bank}
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {bank.id} - {bank.name}
                            </span>
                            {selected ? (
                              <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-indigo-600'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>

        {/* --- Referencia --- */}
        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
            Referencia de Pago
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