use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::game_id::GameId;

#[derive(Deserialize, Serialize)]
pub struct GameData {
    pub id: GameId,
    pub name: String,
    pub timestamp: String,
    pub data: Data,
}

impl GameData {
    pub fn new(name: String, data: Data) -> Self {
        Self {
            id: GameId::new(),
            name,
            timestamp: Utc::now().to_rfc3339(),
            data,
        }
    }
}

impl From<UploadData> for GameData {
    fn from(data: UploadData) -> Self {
        Self::new(data.name, data.data)
    }
}

#[derive(Deserialize, Serialize)]
pub struct UploadData {
    pub name: String,
    pub data: Data,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Data {
    cards: Vec<Card>,
    players: Vec<Player>,
    questions: Vec<Question>,
    #[serde(rename = "playerCardRelations")]
    player_card_relations: Vec<PlayerCardRelation>,
}

#[derive(Debug, Deserialize, Serialize)]
struct Card {
    id: String,
    name: String,
    category: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct Player {
    id: String,
    name: String,
    #[serde(rename = "cardAmount")]
    card_amount: i32,
}

#[derive(Debug, Deserialize, Serialize)]
struct Question {
    id: String,
    #[serde(rename = "askingPlayerId")]
    asking_player_id: String,
    #[serde(rename = "answeringPlayerId")]
    answering_player_id: String,
    #[serde(rename = "playersThatDidntHaveAnythingIds")]
    players_that_didnt_have_anything_ids: Vec<String>,
    #[serde(rename = "suspectCardId")]
    suspect_card_id: String,
    #[serde(rename = "weaponCardId")]
    weapon_card_id: String,
    #[serde(rename = "locationCardId")]
    location_card_id: String,
    timestamp: DateTime<chrono::Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
struct PlayerCardRelation {
    #[serde(rename = "playerId")]
    player_id: String,
    #[serde(rename = "cardId")]
    card_id: String,
    value: bool,
}
