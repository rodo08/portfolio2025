"use strict";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { config, businessInfo } from "./config.js";

const apiKey = process.env.APP_API_KEY;

const genAi = new GoogleGenerativeAI(apiKey);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: businessInfo,
});

let messages = {
  history: [],
};

// Función para crear mensajes en el chat
const createMessageDiv = (message, messageType = "user") => {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(messageType);

  const messageParagraph = document.createElement("p");
  messageParagraph.textContent = message;

  messageDiv.appendChild(messageParagraph);

  const chatWindow = document.querySelector(".chat-window .chat");
  chatWindow.appendChild(messageDiv);
};

const sendMessage = async () => {
  const userMessage = document.querySelector(".chat-window input").value;
  const errorUserMessage = "Oh no, an Error :( !!...try again later";

  if (userMessage.length === 0) return;

  try {
    // Mensaje del usuario
    createMessageDiv(userMessage, "user");

    // Crear y agregar el loader
    const loaderDiv = document.createElement("div");
    loaderDiv.classList.add("loader");
    const chatWindow = document.querySelector(".chat-window .chat");
    chatWindow.appendChild(loaderDiv);

    // Iniciar chat con Gemini
    const chat = model.startChat(messages);
    let result = await chat.sendMessage(userMessage);

    // Respuesta de Gemini
    const aiResponse = result.response.text();
    createMessageDiv(aiResponse, "model");

    // Limpiar el input
    document.querySelector(".chat-window input").value = "";
  } catch (error) {
    console.error(error);

    // Mensaje de error
    createMessageDiv(errorUserMessage, "model-error");
  }

  // Limpiar loader después de recibir la respuesta
  const loader = document.querySelector(".chat-window .loader");
  if (loader) {
    loader.remove();
  }
};

document
  .querySelector(".chat-window .input-area button")
  .addEventListener("click", sendMessage);

document
  .querySelector(".chat-window input")
  .addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendMessage();
  });
