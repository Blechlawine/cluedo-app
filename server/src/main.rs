#[macro_use]
extern crate rocket;

mod game_id;

use game_id::GameId;
use rocket::data::{Data, ToByteUnit};
use rocket::serde::json::Json;
use rocket::tokio::fs::File;
use std::path::Path;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[post("/save/<id>", data = "<game_data>")]
async fn save(id: GameId<'_>, game_data: Data<'_>) -> std::io::Result<String> {
    game_data
        .open(128.kibibytes())
        .into_file(id.file_path())
        .await?;
    Ok(uri!(get_by_id(id)).to_string())
}

#[get("/list")]
fn list() -> Json<Vec<String>> {
    // list all files in upload directory
    let upload_dir = option_env!("UPLOAD_DIR").unwrap_or("upload");
    let root = Path::new(upload_dir);
    let files = root
        .read_dir()
        .unwrap()
        .map(|f| f.unwrap().file_name().to_str().unwrap().to_owned())
        .collect::<Vec<_>>();

    Json(files)
}

#[get("/<id>")]
async fn get_by_id(id: GameId<'_>) -> Option<File> {
    File::open(id.file_path()).await.ok()
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, save, get_by_id, list])
}
