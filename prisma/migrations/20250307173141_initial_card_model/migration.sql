-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'en',
    "released_at" TIMESTAMP(3),
    "mana_cost" TEXT,
    "cmc" DOUBLE PRECISION,
    "type_line" TEXT,
    "oracle_text" TEXT,
    "power" TEXT,
    "toughness" TEXT,
    "colors" TEXT[],
    "color_identity" TEXT[],
    "set" TEXT NOT NULL,
    "set_name" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "flavor_text" TEXT,
    "artist" TEXT,
    "image_uri_normal" TEXT,
    "image_uri_small" TEXT,
    "price_usd" DOUBLE PRECISION,
    "price_usd_foil" DOUBLE PRECISION,
    "legalities" JSONB,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);
