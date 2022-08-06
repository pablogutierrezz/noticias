import keys from "./keys.js";
let sectionNews = document.querySelector(".contenedor-noticias"),
inputText = document.querySelector(".input-text"),
button = document.querySelector(".button"),
next = document.querySelector(".next"),
prev = document.querySelector(".prev"),
page = 1,
pageNum = 20,
loader= document.querySelector(".loader")
function loadBegin() {   
    fetch(`https://newsapi.org/v2/top-headlines?country=us&page=${page}&apiKey=${keys.key1}`)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(json=>{
        loader.style.display = "none"
        json.articles.forEach(el => {
            sectionNews.innerHTML += `
            <article class="article-noticia">
        <h1>${el.title}</h1>
        <p>Autor: ${el.author || "desconocido"}</p>
        <p class="descripcion">${el.content}</p>
        <a href="${el.url}" target="_blank">ver más</a>
        <img src="${el.urlToImage}" alt="${el.description || el.title}">
        </article>
        `
    });  
    if (json.articles.length === 0) {
        next.style.pointerEvents = "none"
        document.querySelector(".error").innerHTML = `No hay mas resultados`
        
    }else{
        document.querySelector(".error").innerHTML = ""
        next.style.pointerEvents = "unset"
    }                              
})
.catch(err=>{
    loader.style.display = "none"
    document.querySelector(".error").innerHTML = `ocurrió un error inesperado al solicitar los datos ${err.status}: ${err.statusText}`
})
}
loadBegin()
async function loadNews(value) {
    try {
        let res = await fetch(`https://newsapi.org/v2/everything?q=${value}&from=2022-08-04&sortBy=popularity&apiKey=${keys.key1}`),
        json = await res.json()
        if(!res.ok) throw{status: res.status, statusText: res.statusText}
        if (json.articles.length===0) {
            loader.style.display = "none"
            document.querySelector(".error").innerHTML = `No se encontraron noticias sobre ${inputText.value.toUpperCase()}`
            document.querySelector(".contenedor-btn").style.display = "none"
        }else{
            document.querySelector(".error").innerHTML = ""
            document.querySelector(".contenedor-btn").style.display = "none"
            loader.style.display = "none"
            for (let i = 0; i < json.articles.length; i++) {
                if (i=== 10) {
                    break;
                }      
                let el = json.articles[i]          
                sectionNews.innerHTML += `
                <article class="article-noticia">
                <h1>${el.title}</h1>
                <p>Autor: ${el.author || "desconocido"}</p>
                <p class="descripcion">${el.content}</p>
                <a href="${el.url}" target="_blank">ver más</a>
                <img src="${el.urlToImage}" alt="${el.description || el.title}">
                </article>
                `
            }   
        }
    } catch (err) {
        document.querySelector(".contenedor-btn").style.display = "none"
        loader.style.display = "none"
        document.querySelector(".error").innerHTML = `ocurrió un error inesperado al solicitar los datos ${err.status}: ${err.statusText}`
    }
}
button.addEventListener("click", e=>{
    loader.style.display = "block"
    sectionNews.innerHTML = ""
    loadNews(inputText.value)
})
inputText.addEventListener("keyup",e=>{
    if (e.key=== "Enter") {
        loader.style.display = "block"
        sectionNews.innerHTML = ""
        loadNews(e.target.value.toLowerCase())
    }
})
next.addEventListener("click",e=>{
    sectionNews.innerHTML = ""
    page++
    loadBegin()
})
prev.addEventListener("click",e=>{
    if (page >1) {   
        sectionNews.innerHTML = ""
        page--
        loadBegin()
    }
})