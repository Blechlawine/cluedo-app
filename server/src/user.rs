use rocket::{
    request::{FromRequest, Outcome},
    Request,
};
use ulid::Ulid;

#[derive(Debug)]
pub struct User {
    pub id: String,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for &'r User {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // The return value of the request.local_cache closure is always the same for the same request
        Outcome::Success(
            request
                .local_cache_async(async {
                    let cookie = request.cookies().get("cluedo-auth");
                    let id = cookie
                        .map(|cookie| cookie.value().to_string())
                        .unwrap_or(Ulid::new().to_string());

                    User { id }
                })
                .await,
        )
    }
}
