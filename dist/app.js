const form = document.getElementById("form");
const titleInput = document.getElementById("title");
const tagsInput = document.getElementById("tags");
const inprotainInput = document.getElementById("inprotain");
const gramInput = document.getElementById("gram");
const searchInput = document.getElementById("search");
const protainList = document.getElementById("protain-list");
const cospa = document.getElementById("cospa");
let Protains = [];
let editID = null;
form.addEventListener("click", () => {
    if (editID !== null) {
        Protains = Protains.map((protain) => {
            if (editID == protain.id) {
                return Object.assign(Object.assign({}, protain), { title: titleInput.value, inprotain: inprotainInput.value, gram: gramInput.value, cospa: Number(inprotainInput.value) / Number(gramInput.value), tags: tagsInput.value.split(',').map(tag => {
                        return tag.trim();
                    }) });
            }
            else {
                return protain;
            }
        });
    }
    else {
        const NewProtain = {
            id: Date.now(),
            title: titleInput.value,
            tags: tagsInput.value.split(',').map((tag) => {
                return tag.trim();
            }),
            inprotain: inprotainInput.value,
            gram: gramInput.value,
            cospa: Number(inprotainInput.value) / Number(gramInput.value),
            isFavorite: false,
        };
        Protains.push(NewProtain);
    }
    Protains.sort((a, b) => {
        return b.cospa - a.cospa;
    });
    titleInput.value = "";
    tagsInput.value = "";
    inprotainInput.value;
    gramInput.value = "";
    renderProtain();
});
function saveProtains() {
    localStorage.setItem("Protains", JSON.stringify(Protains));
}
const savedProtains = localStorage.getItem("saveProtains");
if (savedProtains) {
    Protains = JSON.parse(savedProtains);
}
function renderProtain(displayProtains = Protains) {
    protainList.innerHTML = "";
    displayProtains.forEach((protain) => {
        const div = document.createElement("div");
        protainList.appendChild(div);
        div.innerHTML = `
        <p>${protain.title}</p>
        <p>${protain.inprotain}</p>
        <p>${protain.gram}</p>
        <p>コスパ:${Number(protain.inprotain) / Number(protain.gram)}</p>
        `;
        protain.tags.forEach((tag) => {
            const tagsSpan = document.createElement("span");
            tagsSpan.textContent = `#${tag}`;
            tagsSpan.addEventListener("click", () => {
                const tagsFilter = Protains.filter((protain) => {
                    return protain.tags.includes(tag);
                });
                renderProtain(tagsFilter);
            });
            div.appendChild(tagsSpan);
        });
        const deleteButton = document.createElement("Button");
        deleteButton.textContent = "削除";
        div.appendChild(deleteButton);
        deleteButton.addEventListener("click", () => {
            Protains = Protains.filter((item) => {
                return protain.id !== item.id;
            });
            renderProtain(Protains);
        });
        const editButton = document.createElement("button");
        editButton.textContent = "編集";
        div.appendChild(editButton);
        editButton.addEventListener("click", () => {
            editID = protain.id;
        });
        const favoriteButton = document.createElement("button");
        if (protain.isFavorite === true) {
            favoriteButton.textContent = "★お気に入り";
        }
        else {
            favoriteButton.textContent = "☆お気に入り";
        }
        favoriteButton.addEventListener("click", () => {
            protain.isFavorite = !protain.isFavorite;
            renderProtain();
        });
        div.appendChild(favoriteButton);
    });
}
searchInput.addEventListener("input", () => {
    const searchFilter = Protains.filter((protain) => {
        return protain.title.includes(searchInput.value);
    });
    renderProtain(searchFilter);
});
renderProtain();
export {};
