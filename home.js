/**
 * @author Remil Michael
 * 
 */

// variable name to store the current comic number
let currentComicNumber

/**
 * async function to fetch a particular comic using the
 * comicNumber parameter.
 * 
 * @function fetchComics
 * @param {string} comicNumber 
 * @returns Promise
 */
const fetchComics = async (comicNumber) => {
    const response = await fetch(`https://xkcd-api-ridvanaltun.vercel.app/api/comics/${comicNumber}`)
    if (response.ok) {
        return response.json()
    }
}


/**
 * async function to fetch the latest comic as returns
 * the response as a promise object
 * 
 * @function fetchLatestComic
 * @returns Promise
 */
const fetchLatestComic = async () => {
    const response = await fetch(`https://xkcd-api-ridvanaltun.vercel.app/api/comics/latest`)
    if (response.ok) {
        return response.json()
    }
}


/**
 * function to process the fetched latest comic and update
 * DOM.
 * 
 * @function fetchAndLoadLatestComic
 */
const fetchAndLoadLatestComic = () => {
    fetchLatestComic()
        .then(response => {
            localStorage.setItem('maxComic', response.num)
            currentComicNumber = response.num
            updateAndWriteCount()
            updateDOMElements(response)
        })
        .catch(err => {
            console.log(err)
        })
}


/**
 * function to navigate to the previous comic
 * 
 * @function goBack
 * @returns undefined
 */
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


/**
 * function to navigate to the next comic
 * 
 * @function goNext
 * @returns undefined
 */
const goNext = () => {
    const maxComic = localStorage.getItem('maxComic')
    
    if (!maxComic || !currentComicNumber || parseInt(currentComicNumber) >= parseInt(maxComic)) {
        return
    }
    window.location.href = `?comic=${parseInt(currentComicNumber) + 1}`
}


/**
 * function to get a random comic
 * 
 * @function getRandom
 * @returns undefined
 */
const getRandom = () => {
    const maxComic = localStorage.getItem('maxComic')
    if (!maxComic) {
        return
    }
    const randomComic = Math.trunc(Math.random() * maxComic + 1)
    window.location.href = `?comic=${randomComic}`
}

/**
 * function to update localStorage when a comic is viewed
 * 
 * @function updateAndWriteCount
 */
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

/**
 * function to convert month number to month name
 * 
 * @function getMonthName
 * @param {string} monthNumber 
 * @returns string
 */

const getMonthName = (monthNumber) => {
    if (monthNumber === '1') return 'January'
    if (monthNumber === '2') return 'February'
    if (monthNumber === '3') return 'March'
    if (monthNumber === '4') return 'April'
    if (monthNumber === '5') return 'May'
    if (monthNumber === '6') return 'June'
    if (monthNumber === '7') return 'July'
    if (monthNumber === '8') return 'August'
    if (monthNumber === '9') return 'September'
    if (monthNumber === '10') return 'October'
    if (monthNumber === '11') return 'November'
    if (monthNumber === '12') return 'December'
}

/**
 * function to update the DOM based on the response
 * received.
 * 
 * @function updateDOMElements
 * @param {Object} response 
 */
const updateDOMElements = (response) => {
    const monthName = getMonthName(response.month)
    document.getElementById('comicImg').src = response.img
    document.getElementById('comicImg').alt = response.alt
    document.getElementById('comicImg').style.display = 'block'
    document.getElementById('comicTitle').append(document.createTextNode(response.title))
    document.getElementById('comicDate').append(document.createTextNode(`${monthName} ${response.day}, ${response.year}`))
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
            updateDOMElements(response)
            updateAndWriteCount()
        })
        .catch(err => {
            console.log(err)
        })
} else {
    fetchAndLoadLatestComic()
}