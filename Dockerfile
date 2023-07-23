# Customized from https://github.com/patrick-fitzgerald/actix-web-docker-example/blob/develop/Dockerfile
# More info https://shaneutt.com/blog/rust-fast-small-docker-image-builds/
# another example: https://jakewharton.com/cross-compiling-static-rust-binaries-in-docker-for-raspberry-pi/

# ------------------------------------------------------------------------------
# Backend Build Stage
# ------------------------------------------------------------------------------

FROM messense/rust-musl-cross:armv7-musleabihf as backend-builder

WORKDIR /home/rust/cluedo_app
# Only build the dependencies, so docker can cache them
COPY ./server/Cargo.toml ./Cargo.toml
COPY ./server/prisma-cli/Cargo.toml ./prisma-cli/Cargo.toml
RUN mkdir src/
RUN mkdir prisma-cli/src

RUN echo "fn main() {println!(\"if you see this, the build broke\")}" > src/main.rs
RUN echo "fn main() {println!(\"if you see this, the build broke\")}" > prisma-cli/src/main.rs

RUN cargo build --release

# Now build the actual app
# this line prevents the dependencies from being built again (when src/*.rs files change)
RUN rm ./target/armv7-unknown-linux-musleabihf/release/deps/cluedo_app*
COPY ./server .
RUN cargo prisma generate
RUN cargo build --release

# ------------------------------------------------------------------------------
# Frontend Build Stage
# ------------------------------------------------------------------------------

FROM node:16 as frontend-builder

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

COPY ./src ./src/
COPY ./public ./public/
COPY ./vite.config.ts ./vite.config.ts
COPY ./postcss.config.cjs ./postcss.config.cjs
COPY ./tailwind.config.cjs ./tailwind.config.cjs
COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.node.json ./tsconfig.node.json
COPY ./index.html ./index.html

RUN yarn build

# ------------------------------------------------------------------------------
# Final Stage
# ------------------------------------------------------------------------------

FROM --platform=$BUILDPLATFORM alpine as runner

WORKDIR /app
COPY --from=backend-builder /home/rust/cluedo_app/target/armv7-unknown-linux-musleabihf/release/cluedo_app ./cluedo_app

ENV HOST=127.0.0.1
ENV PORT=3000
ENV UPLOAD_DIR=/srv/upload
ENV APP_DIR=/srv/app

COPY --from=frontend-builder /app/dist /srv/app

EXPOSE $PORT

CMD ["./cluedo_app"]