use std::hash::Hash;

use rocket::{
    request::{FromRequest, Outcome},
    Request,
};
use serde::{Deserialize, Serialize};
use ulid::Ulid;

use crate::{db, AppState};

#[derive(Debug, Deserialize, Serialize, Clone, Eq, PartialEq)]
pub struct User {
    pub id: String,
}

impl User {
    pub fn new(id: Option<String>) -> Self {
        Self {
            id: id.unwrap_or(Ulid::new().to_string()),
        }
    }
}

impl Hash for User {
    fn hash<H>(&self, hasher: &mut H)
    where
        H: std::hash::Hasher,
    {
        self.id.hash(hasher);
    }
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for &'r User {
    type Error = ();

    
}
