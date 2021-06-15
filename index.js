let currentComicNumber

const fetchComics = async (comicNumber) => {

    const response = await fetch(`https://xkcd-api-ridvanaltun.vercel.app/api/comics/${comicNumber}`)
    if (response.ok) {
        return response.json()
    }
}

const fetchLatestComic = async () => {

    const response = await fetch(`https://xkcd-api-ridvanaltun.vercel.app/api/comics/latest`)
    if (response.ok) {
        return response.json()
    }
}


const fetchAndLoadLatestComic = () => {
    fetchLatestComic()
        .then(response => {
            localStorage.setItem('maxComic', response.num)
            currentComicNumber = response.num
            updateAndWriteCount()
            document.getElementById("comicImg").src = response.img
            document.getElementById("comicImg").style.display = 'block'
        })
        .catch(err => {
            console.log(err)
        })
}

const goBack = () => {
    if (!currentComicNumber) {
        const maxComic = localStorage.getItem('maxComic')
        if (!maxComic || maxComic < 2) {
            return
        } else {
            window.location.href=`?comic=${maxComic - 1}`
        }
    } else if (currentComicNumber < 2) {
        return
    } else {
        window.location.href=`?comic=${currentComicNumber - 1}`
    }
}

const goNext = () => {
    const maxComic = localStorage.getItem('maxComic')
    
    if (!maxComic || !currentComicNumber || parseInt(currentComicNumber) >= parseInt(maxComic)) {
        return
    }
    window.location.href = `?comic=${parseInt(currentComicNumber) + 1}`
}

const getRandom = () => {
    const maxComic = localStorage.getItem('maxComic')
    if (!maxComic) {
        return
    }
    const randomComic = Math.trunc(Math.random() * maxComic + 1)
    window.location.href = `?comic=${randomComic}`
}

const updateAndWriteCount = () => {
    let countMap
    let count
    const countStorage = localStorage.getItem('count')
    
    if (countStorage) {
        countMap = new Map(JSON.parse(countStorage))
        count = countMap.get(currentComicNumber)
    } else {
        countMap = new Map()
    }

    if (!count) {
        count = 1
    }
    
    const countTag = document.getElementById('viewCount')
    const countText = document.createTextNode(`Comic view count: ${count}`)
    countTag.append(countText)
    countMap.set(currentComicNumber, count + 1)
    localStorage.setItem('count', JSON.stringify(Array.from(countMap.entries())))
}

const urlSearchParams = new URLSearchParams(window.location.search)
currentComicNumber = urlSearchParams.get('comic')

const prevButton = document.getElementById('btnPrev')
prevButton.addEventListener('click', goBack)

const nextButton = document.getElementById('btnNext')
nextButton.addEventListener('click', goNext)

const btnRandom = document.getElementById('btnRandom')
btnRandom.addEventListener('click', getRandom)

if (currentComicNumber) {
    fetchComics(currentComicNumber)
        .then(response => {
            document.getElementById("comicImg").src = response.img
            document.getElementById("comicImg").style.display = 'block'
            updateAndWriteCount()
        })
        .catch(err => {
            console.log(err)
        })
} else {
    fetchAndLoadLatestComic()
}