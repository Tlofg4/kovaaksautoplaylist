(async () => {
const usernames = [
"minigod",
"Lored",
"florescent",
"Loita",
"Anima",
"sunflower",
"m0narcS",
"wapaam!",
"d3mur",
"darkwizarrddd",
"A1D",
"Viscose",
"kynave",
"cartoon",
"MattyOW",
"AnimaAim",
"thundah",
"reiuy",
"e1se",
"4BangerKovaaks"
];

//poner al umikown
//y a mas gente que haga rutinas utiles para debilidades ect
//crear el script que snipea a las rutinas a las que esta suscrito alguien asi saco todas las rutinas de kayak chronicle sato ect
//ir a el playlist compendium y sacar mas playlist de los creadores que salgan ahi

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchWithTimeout(url, timeout = 30000) {
    const controller = new AbortController();

    const timer = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        const res = await fetch(url, {
            signal: controller.signal
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

for (const username of usernames) {
    console.log(`\n========== ${username} ==========`);

    let page = 0;
    let allPlaylists = [];

    while (true) {
        const url =
            `https://kovaaks.com/webapp-backend/user/playlist/creator` +
            `?username=${encodeURIComponent(username)}` +
            `&page=${page}&max=100`;

        let success = false;
        let retries = 3;

        while (!success && retries > 0) {
            try {
                console.log(
                    `${username} | Fetching page ${page}...`
                );

                const data = await fetchWithTimeout(
                    url,
                    30000
                );

                const playlists = data.data || [];

                allPlaylists.push(...playlists);

                console.log(
                    `${username} | Page ${page} | ${playlists.length} playlists`
                );

                success = true;

                if (playlists.length < 100) {
                    page = -1;
                } else {
                    page++;
                }

            } catch (err) {
                retries--;

                console.warn(
                    `${username} | Page ${page} failed (${err.message}) | Retries left: ${retries}`
                );

                if (retries > 0) {
                    await sleep(10000);
                }
            }
        }

        if (!success) {
            console.error(
                `${username} | Skipping remaining pages`
            );
            break;
        }

        if (page === -1) {
            break;
        }

        await sleep(5000);
    }

    allPlaylists.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
    );

    console.log(
        `${username} | Total playlists: ${allPlaylists.length}`
    );

    allPlaylists.forEach((p, i) => {
        console.log(
            `${i + 1}. ${p.created?.slice(0,10) || ""} | ${p.playlistName || ""} | ${p.playlistCode || ""}`
        );
    });

    const csv = [
        [
            "Creator",
            "Created",
            "Playlist Name",
            "Share Code",
            "Description"
        ],
        ...allPlaylists.map(p => [
            username,
            p.created?.slice(0,10) || "",
            `"${(p.playlistName || "").replace(/"/g, '""')}"`,
            p.playlistCode || "",
            `"${(p.description || "")
                .replace(/"/g, '""')
                .replace(/\n/g, ' ')
                .replace(/\r/g, ' ')}"`
        ])
    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob(
        [csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${username}_playlists.csv`;
    a.click();

    URL.revokeObjectURL(a.href);

    console.log(
        `Downloaded: ${username}_playlists.csv`
    );

    console.log(
        `Waiting 10 seconds before next creator...`
    );

    await sleep(10000);
}

console.log("\nALL CREATORS FINISHED");

})();