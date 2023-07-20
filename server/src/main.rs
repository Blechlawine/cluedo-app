#[macro_use]
extern crate rocket;

mod game_data;
mod game_id;

use dotenv::dotenv;
use game_data::GameData;
use game_id::GameId;
use rocket::fs::FileServer;
use rocket::serde::json::Json;
use rocket::tokio::fs::File;
use rocket::tokio::io::AsyncWriteExt;
use rocket::{Config, State};
use std::env;
use std::fs::read_to_string;
use std::net::Ipv4Addr;
use std::path::Path;

use crate::game_data::UploadData;

struct AppState {
    upload_dir: String,
}

#[post("/save", data = "<upload_data>", format = "application/json")]
async fn api_save(upload_data: Json<UploadData>) -> std::io::Result<String> {
    let data = upload_data.into_inner();
    let game_data = GameData::from(data);
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
        .map(|f| {
            let file_name = f.unwrap().path();
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
    rocket::build()
        .manage(AppState { upload_dir })
        .configure(Config {
            port,
            address,
            ..Default::default()
        })
        .mount("/api", routes![api_save, api_list, api_get_by_id])
        .mount("/", FileServer::from(app_dir))
        .register("/", catchers![not_found])
}
