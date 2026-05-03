const form = document.getElementById('articleForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const contentInput = document.getElementById('content');
const articleIdInput = document.getElementById('articleId');
const formTitle = document.getElementById('formTitle');
const btnSubmit = document.getElementById('btnSubmit');
const btnCancel = document.getElementById('btnCancel');
const articleList = document.getElementById('articleList');

let articles = JSON.parse(localStorage.getItem('simple_cms_articles')) || [];
let isEditing = false;
renderArticles();


form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!titleInput.value || !authorInput.value || !contentInput.value) {
        alert("Harap isi semua field!");
        return;
    }

    const articleData = {
        id: isEditing ? articleIdInput.value : Date.now().toString(),
        title: titleInput.value,
        author: authorInput.value,
        content: contentInput.value
    };

    if (isEditing) {
        articles = articles.map(article =>
            article.id === articleData.id ? articleData : article
        );
        alert("Artikel berhasil diubah!");
    } else {
        articles.push(articleData);
        alert("Artikel berhasil disimpan!");
    }

    saveData();
    resetForm();
    renderArticles();
});

btnCancel.addEventListener('click', resetForm);

function saveData() {
    localStorage.setItem('simple_cms_articles', JSON.stringify(articles));
}

function renderArticles() {
    articleList.innerHTML = '';

    if (articles.length === 0) {
        articleList.innerHTML = '<p>Belum ada artikel yang ditambahkan.</p>';
        return;
    }

    articles.forEach(article => {
        const div = document.createElement('div');
        div.className = 'article-item';
        div.innerHTML = `
            <h3>${article.title}</h3>
            <p><strong>Penulis:</strong> ${article.author}</p>
            <p>${article.content}</p>
            <div class="action-btn">
                <button class="btn-edit" onclick="editArticle('${article.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteArticle('${article.id}')">Hapus</button>
            </div>
        `;
        articleList.appendChild(div);
    });
}

window.deleteArticle = function (id) {
    if (confirm("Yakin ingin menghapus artikel ini?")) {
        articles = articles.filter(article => article.id !== id);
        saveData();
        renderArticles();
    }
};

window.editArticle = function (id) {
    const article = articles.find(a => a.id === id);
    if (article) {
        isEditing = true;
        articleIdInput.value = article.id;
        titleInput.value = article.title;
        authorInput.value = article.author;
        contentInput.value = article.content;

        formTitle.textContent = "Edit Artikel";
        btnSubmit.textContent = "Update";
        btnCancel.style.display = 'inline-block';
    }
};

function resetForm() {
    form.reset();
    isEditing = false;
    articleIdInput.value = '';
    formTitle.textContent = "Tambah Artikel";
    btnSubmit.textContent = "Simpan";
    btnCancel.style.display = 'none';
}