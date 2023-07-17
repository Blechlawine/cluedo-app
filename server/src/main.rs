#[macro_use]
extern crate rocket;

mod game_id;

use dotenv::dotenv;
use game_id::GameId;
use rocket::data::{Data, ToByteUnit};
use rocket::fs::FileServer;
use rocket::serde::json::Json;
use rocket::tokio::fs::File;
use rocket::{Config, State};
use std::env;
use std::path::Path;

struct AppState {
    upload_dir: String,
}

// #[get("/<path..>")]
// async fn index(state: &State<AppState>, path: PathBuf) -> Option<NamedFile> {
//     let app_dir = &state.app_dir;
//     NamedFile::open(Path::new(app_dir).join(path)).await.ok()
// }

#[post("/save/<id>", data = "<game_data>")]
async fn api_save(id: GameId<'_>, game_data: Data<'_>) -> std::io::Result<String> {
    game_data
        .open(128.kibibytes())
        .into_file(id.file_path())
        .await?;
    Ok(uri!(api_get_by_id(id)).to_string())
}

#[get("/list")]
fn api_list(state: &State<AppState>) -> Json<Vec<String>> {
    // list all files in upload directory
    let root = Path::new(&state.upload_dir);
    let files = root
        .read_dir()
        .unwrap()
        .map(|f| f.unwrap().file_name().to_str().unwrap().to_owned())
        .collect::<Vec<_>>();

    Json(files)
}

#[get("/<id>")]
async fn api_get_by_id(id: GameId<'_>) -> Option<File> {
    File::open(id.file_path()).await.ok()
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
    let app_dir = env::var("APP_DIR").unwrap_or("/srv/app".to_owned());
    let upload_dir = env::var("UPLOAD_DIR").unwrap_or("/srv/upload".to_owned());
    rocket::build()
        .manage(AppState { upload_dir })
        .configure(Config {
            port,
            ..Default::default()
        })
        .mount("/", FileServer::from(app_dir))
        .mount("/api", routes![api_save, api_list, api_get_by_id])
        .register("/", catchers![not_found])
}
