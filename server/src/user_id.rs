use rocket::{
    request::{FromRequest, Outcome},
    Request,
};
use ulid::Ulid;

use crate::AppState;

#[derive(Debug)]
pub struct UserId(pub String);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for &'r UserId {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // The return value of the request.local_cache closure is always the same for the same request
        Outcome::Success(request.local_cache(|| {
            let cookie = request.cookies().get("cluedo-auth");
            let state = request.rocket().state::<AppState>().unwrap();
            UserId(match cookie {
                Some(cookie) => cookie.value().to_string(),
                None => Ulid::new().to_string(),
            })
        }))
    }
}
