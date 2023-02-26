// use chrono::prelude::*;
use rocket::request::FromParam;
use std::borrow::Cow;
use std::path::{Path, PathBuf};

#[derive(UriDisplayPath)]
pub struct GameId<'a>(Cow<'a, str>);

impl GameId<'_> {
    // pub fn new() -> GameId<'static> {
    //     let now = Utc::now().to_string();
    //     GameId(Cow::Owned(now))
    // }

    pub fn file_path(&self) -> PathBuf {
        let upload_dir = option_env!("UPLOAD_DIR").unwrap_or("upload");
        let root = Path::new(upload_dir);
        root.join(self.0.as_ref())
    }
}

impl<'a> FromParam<'a> for GameId<'a> {
    type Error = &'a str;

    fn from_param(param: &'a str) -> Result<Self, Self::Error> {
        param
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '_')
            .then(|| GameId(param.into()))
            .ok_or(param)
    }
}
