// src/scripts/ingestScryfall.ts
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const SCRYFALL_API = 'https://api.scryfall.com';

async function fetchCards(url = `${SCRYFALL_API}/cards/search?q=set:dom&order=set`) {
  try {
    console.log(`Fetching cards from: ${url}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching from Scryfall:', error);
    throw error;
  }
}

async function ingestCards() {
  try {
    let nextUrl = `${SCRYFALL_API}/cards/search?q=set:dft&order=set`;
    let totalImported = 0;

    // Keep fetching while there are more pages
    while (nextUrl) {
      const data = await fetchCards(nextUrl);
      
      // Process each card
      for (const cardData of data.data) {
        // Map Scryfall data to our schema
        const card = {
          id: cardData.id,
          name: cardData.name,
          lang: cardData.lang,
          released_at: cardData.released_at ? new Date(cardData.released_at) : null,
          mana_cost: cardData.mana_cost || null,
          cmc: cardData.cmc || null,
          type_line: cardData.type_line || null,
          oracle_text: cardData.oracle_text || null,
          power: cardData.power || null,
          toughness: cardData.toughness || null,
          colors: cardData.colors || [],
          color_identity: cardData.color_identity || [],
          set: cardData.set,
          set_name: cardData.set_name,
          rarity: cardData.rarity,
          flavor_text: cardData.flavor_text || null,
          artist: cardData.artist || null,
          image_uri_normal: cardData.image_uris?.normal || null,
          image_uri_small: cardData.image_uris?.small || null,
          price_usd: cardData.prices?.usd ? parseFloat(cardData.prices.usd) : null,
          price_usd_foil: cardData.prices?.usd_foil ? parseFloat(cardData.prices.usd_foil) : null,
          legalities: cardData.legalities || null
        };

        // Insert or update card
        await prisma.card.upsert({
          where: { id: card.id },
          update: card,
          create: card
        });

        totalImported++;
      }

      console.log(`Imported ${totalImported} cards so far`);
      
      // Check if there are more pages
      nextUrl = data.has_more ? data.next_page : null;
      
      // Respect Scryfall's rate limiting
      if (nextUrl) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Completed! Total cards imported: ${totalImported}`);
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
ingestCards()
  .then(() => console.log('Script completed'))
  .catch(console.error);