const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,ts,js,tsx,jsx}"],
    theme: {
        extend: {},
    },
    plugins: [
        require("daisyui"),
        iconsPlugin({
            collections: getIconCollections(["tabler"]),
            scale: 1.2,
        }),
    ],
};
