import Groq from "groq-sdk";
import pool from "./pool";
import dbSchemaContext from "./contexts/schema.context";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateChatCompletion(prompt: string): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: prompt }],
    });

    return (
      response.choices[0]?.message?.content || "Error processing response."
    );
  } catch (error) {
    console.error("Error generating chat completion:", error);
    throw new Error("Failed to generate chat completion.");
  }
}

async function processQuery(adminQuery: string) {
  const prompt = `
    You are an AI assistant for a library management system.
    The admin has asked: "${adminQuery}"

    Decide if this question requires a database query.
    If it does, generate a SQL query for a PostgreSQL database.

    - If it is a factual question (e.g., "Explain the borrowing process"), respond directly.
    - If it requires real-time data, generate an SQL query.

    You can use this schema context to know how to structure SQL queries: ${dbSchemaContext}
    it is worth noting that all table names use camel casing so take that into consideration when writing your queries. 
    Answer format (valid JSON only):
    
    {
      "needsDatabaseQuery": true/false,
      "sqlQuery": "SELECT ...",
      "explanation": "Why this query is needed"
    }
  `;

  try {
    const rawContent = await generateChatCompletion(prompt);
    const cleanedContent = rawContent.replace(/```json|```/g, "");

    const decision = JSON.parse(cleanedContent);
    return decision;
  } catch (error) {
    console.error("Error processing query:", error);
    throw new Error("Failed to process admin query.");
  }
}

 async function fetchDataFromDB(sqlQuery: string) {
  try {
    const result = await pool.query(sqlQuery);
    return result.rows;
  } catch (error) {
    console.error("Database Query Error:", error);
   throw new Error("Failed to fetch data from the database.");
  }
}

async function formatAIResponse(query: string, data: any) {
  const prompt = `
    You are an AI assistant providing data insights for an admin.
    The admin asked: "${query}"
    
    Here is the raw database data:
    ${JSON.stringify(data)}
    
    Convert this into a well-structured, human-friendly response.
  `;

  try {
    return await generateChatCompletion(prompt);
  } catch (error) {
    console.error("Error formatting AI response:", error);
    throw new Error("Failed to format AI response.");
  }
}


export { processQuery, fetchDataFromDB, formatAIResponse };
