#[macro_use]
extern crate rocket;

mod game_data;
mod game_id;
mod user;

use dotenv::dotenv;
use rocket::config::SecretKey;
use rocket::fairing::AdHoc;
use rocket::fs::FileServer;
use rocket::http::Cookie;
use rocket::serde::json::Json;
use rocket::time::{Duration, OffsetDateTime};
use rocket::tokio::fs::File;
use rocket::tokio::io::AsyncWriteExt;
use rocket::{Config, State};
use std::collections::HashSet;
use std::env;
use std::fs::read_to_string;
use std::net::Ipv4Addr;
use std::path::Path;
use std::sync::{Arc, Mutex};

use crate::game_data::{GameData, UploadData};
use crate::game_id::GameId;
use crate::user::User;

struct AppState {
    upload_dir: String,
    users: Arc<Mutex<HashSet<User>>>,
}

#[post("/save", data = "<upload_data>", format = "application/json")]
async fn api_save(upload_data: Json<UploadData>, user: &User) -> std::io::Result<String> {
    let data = upload_data.into_inner();
    let game_data = GameData::from(data);
    // user.game_data_ids.insert(game_data.id.into());
    // save GameData to file
    let mut file = File::create(game_data.id.file_path()).await?;
    file.write_all(serde_json::to_string(&game_data)?.as_bytes())
        .await?;

    Ok(uri!(api_get_by_id(game_data.id)).to_string())
}

#[get("/list", format = "application/json")]
fn api_list(state: &State<AppState>) -> std::io::Result<Json<Vec<GameData>>> {
    // list all files in upload directory
    let root = Path::new(&state.upload_dir);
    let files = root
        .read_dir()?
        .filter_map(|f| f.ok())
        .filter(|f| f.file_type().unwrap().is_file())
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
fn api_get_by_id(id: GameId) -> std::io::Result<Json<GameData>> {
    let path = id.file_path();
    dbg!(&path);
    let read = read_to_string(path)?;
    let data = serde_json::from_str(&read)?;
    Ok(Json(data))
}

#[catch(404)]
fn not_found() -> Json<&'static str> {
    Json("Not found")
}

#[launch]
fn rocket() -> _ {
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
    let secret_key = env::var("SECRET_KEY").expect("Environment variable SECRET_KEY must be set");

    let users_path = Path::new(&upload_dir)
        .join(Path::new("db"))
        .join(Path::new("users.json"));
    let users = read_to_string(&users_path).unwrap_or("[]".to_string());
    let users: HashSet<User> = serde_json::from_str(&users).unwrap();

    rocket::build()
        .manage(AppState {
            upload_dir,
            users: Arc::new(Mutex::new(users)),
        })
        .configure(Config {
            port,
            address,
            secret_key: SecretKey::from(secret_key.as_bytes()),
            ..Default::default()
        })
        .attach(AdHoc::on_request("set-auth-cookie", |req, _| {
            Box::pin(async move {
                let user_id = req.guard::<&User>().await.unwrap();
                let cookie_to_set = Cookie::build("cluedo-auth", user_id.id.clone())
                    .http_only(true)
                    .expires(OffsetDateTime::now_utc() + Duration::weeks(52))
                    .finish();

                dbg!(&cookie_to_set);

                req.cookies().add(cookie_to_set);
            })
        }))
        .attach(AdHoc::on_shutdown("save-users", |app| {
            Box::pin(async move {
                let state = app.state::<AppState>().unwrap();
                let users = state.users.clone();
                let serialized = serde_json::to_string(&users).unwrap();
                let mut file = File::create(users_path).await.unwrap();
                file.write_all(serialized.as_bytes()).await.unwrap();
            })
        }))
        .mount("/api", routes![api_save, api_list, api_get_by_id])
        .mount("/", FileServer::from(app_dir))
        .register("/", catchers![not_found])
}
