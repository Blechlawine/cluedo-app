use rocket::{
    request::{FromRequest, Outcome},
    Request,
};
use ulid::Ulid;

use crate::{db, AppState};

#[derive(Debug)]
pub struct UserId(pub String);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for &'r UserId {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // The return value of the request.local_cache closure is always the same for the same request
        Outcome::Success(
            request
                .local_cache_async(async {
                    let cookie = request.cookies().get("cluedo-auth");
                    let state = request.rocket().state::<AppState>().unwrap();
                    let id = cookie
                        .map(|cookie| cookie.value().to_string())
                        .unwrap_or(Ulid::new().to_string());

                    state
                        .db
                        .user()
                        .upsert(
                            db::user::id::equals(id.clone()),
                            vec![db::user::id::set(id.clone())],
                            vec![],
                        )
                        .exec()
                        .await
                        .unwrap();

                    UserId(id)
                })
                .await,
        )
    }
}
