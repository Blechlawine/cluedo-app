use std::{
    ops::Add,
    path::{Path, PathBuf},
};

use chrono::{DateTime, Utc};
use rocket::tokio::fs::File;
use rocket::tokio::io::AsyncWriteExt;
use serde::{Deserialize, Serialize};
use ulid::Ulid;

#[derive(Deserialize, Serialize)]
pub struct GameData {
    pub id: String,
    pub name: String,
    pub timestamp: String,
    pub user_id: String,
    pub data: Data,
}

impl GameData {
    pub fn new(name: String, data: Data, user_id: String) -> Self {
        Self {
            id: Ulid::new().to_string(),
            user_id,
            name,
            timestamp: Utc::now().to_rfc3339(),
            data,
        }
    }

    pub async fn save(self, upload_dir: &String) -> std::io::Result<Self> {
        // save GameData to file
        let mut file = File::create(&self.relative_file_path(upload_dir)).await?;
        file.write_all(serde_json::to_string(&self)?.as_bytes())
            .await?;

        Ok(self)
    }

    pub fn relative_file_path(&self, upload_dir: &String) -> PathBuf {
        let root = Path::new(upload_dir);
        let file_name = GameData::file_name(self.id.clone(), self.user_id.clone());
        root.join(Path::new(&file_name))
    }

    pub fn file_name(id: String, user_id: String) -> String {
        id.add("-").add(user_id.as_str())
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
