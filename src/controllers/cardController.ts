import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient(); 

// create me a card controller
// get all cards
export const getAllCards = async (req: express.Request, res: express.Response) => {
    try {
        const cards = await prisma.card.findMany();
        res.json(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ message: 'Error fetching cards' });
    }    
}

// query parameter e.g. /cards/search?name=Liliana&type=planeswalker&sortBy=name&sortOrder=desc
export const searchCards = async (req: Request, res: Response) => {
    try {
        const { 
            name, 
            type, 
            rarity, 
            color, 
            cmc, 
            set, 
            artist,
            power,
            toughness,
            oracle_text,
            sortBy,
            sortOrder
        } = req.query;
        
        // Build dynamic where clause
        const whereClause: any = {};
        
        if (name) {
            whereClause.name = { contains: name as string, mode: 'insensitive' };
        }
        
        if (type) {
            whereClause.type_line = { contains: type as string, mode: 'insensitive' };
        }
        
        if (rarity) {
            whereClause.rarity = { equals: rarity as string };
        }
        
        if (color) {
            // This will search for cards that have this color in their colors array
            whereClause.colors = { has: color as string };
        }
        
        if (cmc) {
            whereClause.cmc = { equals: parseFloat(cmc as string) };
        }
        
        if (set) {
            whereClause.set = { equals: set as string };
        }
        
        if (artist) {
            whereClause.artist = { contains: artist as string, mode: 'insensitive' };
        }
        
        if (power) {
            whereClause.power = { equals: power as string };
        }
        
        if (toughness) {
            whereClause.toughness = { equals: toughness as string };
        }
        
        if (oracle_text) {
            whereClause.oracle_text = { contains: oracle_text as string, mode: 'insensitive' };
        }
        
        let sortOption = 'name';
        if (sortBy) {
            if (!['name', 'type_line', 'rarity', 'color', 'cmc', 'set', 'artist', 'power', 'toughness', 'oracle_text'].includes(sortBy as string)) {
                res.status(400).json({ message: 'Invalid sortBy option' });
                return;
            }
            sortOption = sortBy as string;
        }
        
        let sortOrderOption = 'asc';
        if (sortOrder) {
            if (!['asc', 'desc'].includes(sortOrder as string)) {
                res.status(400).json({ message: 'Invalid sortOrder option' });
                return;
            }
            sortOrderOption = sortOrder as string;
        }
        
        const cards = await prisma.card.findMany({
            where: whereClause,
            orderBy: { [sortOption]: sortOrderOption }
        });
        res.json(cards);
    } catch (error) {
        console.error('Error searching cards:', error);
        res.status(500).json({ message: 'Error searching cards' });
    }
};

export const getCardsByType = async (req: Request, res: Response) => {
    try {
        const { type } = req.params;
        const cards = await prisma.card.findMany({ 
            where: { 
                type_line: { 
                    contains: type as string,
                    mode: 'insensitive'  // Case-insensitive search
                } 
            } 
        });
        
        console.log(`Found ${cards.length} cards with type: ${type}`);
        res.json(cards);
    } catch (error) {
        console.error('Error fetching cards by type:', error);
        res.status(500).json({ message: 'Error fetching cards by type' });
    }
};

export const getCardById = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const card = await prisma.card.findUnique({ where: { id } });
        if (!card) {    
            res.status(404).json({ message: 'Card not found' });
        } else {
            res.json(card);
        }
    } catch (error) {
        console.error('Error fetching card:', error);
        res.status(500).json({ message: 'Error fetching card' });
    }
};