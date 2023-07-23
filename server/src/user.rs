use std::{
    collections::HashSet,
    hash::Hash,
    sync::{Arc, Mutex},
};

use rocket::{
    request::{FromRequest, Outcome},
    Request,
};
use serde::{Deserialize, Serialize};
use ulid::Ulid;

use crate::AppState;

#[derive(Debug, Deserialize, Serialize, Clone, Eq, PartialEq)]
pub struct User {
    pub id: String,
    pub game_data_ids: HashSet<String>,
}

impl User {
    pub fn new(id: Option<String>) -> Self {
        Self {
            id: id.unwrap_or(Ulid::new().to_string()),
            game_data_ids: HashSet::new(),
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

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // The return value of the request.local_cache closure is always the same for the same request
        Outcome::Success(request.local_cache(|| {
            let cookie = request.cookies().get("cluedo-auth");
            let state = request.rocket().state::<AppState>().unwrap();
            let user = User::new(cookie.map(|cookie| cookie.value().to_string()));
            state.users.clone().lock().unwrap().insert(user.clone());
            user
        }))
    }
}
