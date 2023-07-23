// use chrono::prelude::*;
use rocket::request::FromParam;
use serde::{Deserialize, Serialize};
use std::env;
use std::path::{Path, PathBuf};
use ulid::Ulid;

#[derive(UriDisplayPath, Serialize, Deserialize, Debug, Clone)]
pub struct GameId(String);

impl GameId {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn file_path(&self) -> PathBuf {
        let upload_dir = env::var("UPLOAD_DIR").unwrap_or("upload".to_owned());
        let root = Path::new(&upload_dir);
        let own_path = Path::new(self.0.as_str());
        root.join(own_path)
    }
}

impl Default for GameId {
    fn default() -> Self {
        let id = Ulid::new();
        GameId(id.to_string())
    }
}

impl From<GameId> for String {
    fn from(val: GameId) -> Self {
        val.0
    }
}

impl<'a> FromParam<'a> for GameId {
    type Error = &'a str;

    fn from_param(param: &'a str) -> Result<Self, Self::Error> {
        param
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '_')
            .then(|| GameId(param.into()))
            .ok_or(param)
    }
}
