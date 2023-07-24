#[macro_use]
extern crate rocket;

mod game_data;
mod user;

use dotenv::dotenv;
use rocket::fairing::AdHoc;
use rocket::fs::FileServer;
use rocket::http::Cookie;
use rocket::serde::json::Json;
use rocket::time::{Duration, OffsetDateTime};
use rocket::{Config, State};
use std::env;
use std::fs::read_to_string;
use std::net::Ipv4Addr;
use std::path::Path;

use crate::game_data::{GameData, UploadData};
use crate::user::User;

struct AppState {
    upload_dir: String,
}

#[post("/save", data = "<upload_data>", format = "application/json")]
async fn api_save(
    upload_data: Json<UploadData>,
    user: &User,
    state: &State<AppState>,
) -> std::io::Result<String> {
    let upload_data = upload_data.into_inner();
    let game_data = GameData::new(upload_data.name, upload_data.data, user.id.clone())
        .save(&state.upload_dir)
        .await?;

    Ok(uri!(api_get_by_id(game_data.id)).to_string())
}

#[get("/list", format = "application/json")]
async fn api_list(state: &State<AppState>, user: &User) -> std::io::Result<Json<Vec<GameData>>> {
    // list all files in upload directory belonging to the current user
    let root = Path::new(&state.upload_dir);
    let files = root
        .read_dir()?
        .filter_map(|f| f.ok())
        .filter(|f| f.file_type().unwrap().is_file())
        .filter(|f| f.file_name().to_string_lossy().split('-').last() == Some(user.id.as_str()))
        .map(|f| {
            let file_name = f.path();
            let read = read_to_string(file_name).unwrap();
            let data: GameData = serde_json::from_str(&read).unwrap();
            data
        })
        .collect::<Vec<_>>();

    Ok(Json(files))
}

#[get("/get/<id>", format = "application/json")]
async fn api_get_by_id(id: String, user: &User, state: &State<AppState>) -> Option<Json<GameData>> {
    let path = Path::new(&state.upload_dir).join(GameData::file_name(id, user.id.clone()));
    let read = read_to_string(path).unwrap();
    let data: GameData = serde_json::from_str(&read).unwrap();

    if data.user_id != user.id {
        return None;
    }

    Some(Json(data))
}

#[catch(404)]
fn not_found() -> Json<&'static str> {
    Json("Not found")
}

#[launch]
async fn rocket() -> _ {
    dotenv().ok();

    let port = env::var("PORT")
        .unwrap_or("8000".to_owned())
        .parse::<_>()
        .unwrap();
    let address = env::var("HOST")
        .unwrap_or(Ipv4Addr::new(127, 0, 0, 1).to_string())
        .parse::<_>()
        .unwrap();
    let app_dir = env::var("APP_DIR").unwrap_or("/srv/app".to_owned());
    let upload_dir = env::var("UPLOAD_DIR").unwrap_or("/srv/upload".to_owned());

    rocket::build()
        .manage(AppState { upload_dir })
        .configure(Config {
            port,
            address,
            ..Default::default()
        })
        .attach(AdHoc::on_request("set-auth-cookie", |req, _| {
            Box::pin(async move {
                let user = req.guard::<&User>().await.unwrap();
                let cookie_to_set = Cookie::build("cluedo-auth", user.id.clone())
                    .http_only(true)
                    .expires(OffsetDateTime::now_utc() + Duration::weeks(52))
                    .finish();

                req.cookies().add(cookie_to_set);
            })
        }))
        .mount("/api", routes![api_save, api_list, api_get_by_id])
        .mount("/", FileServer::from(app_dir))
        .register("/", catchers![not_found])
}
