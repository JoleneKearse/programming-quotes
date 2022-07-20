(function () {
    const quotesEl = document.querySelector(".quotes");
    const loader = document.querySelector(".loader");
    // CONTROL VARIABLES //////////////////////////////////////////////
    let currentPage = 1;
    // how many quotes to load each time
    const limit = 5;
    // store total quotes returned from API
    let total = 0;

    // QUOTE FUNCTIONS ////////////////////////////////////////////////
    const getQuotes = async (page, limit) => {
        const API_URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
        const response = await fetch(API_URL);
        // handle 404
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
        }
        return await response.json();
    };

    const showQuotes = (quotes) => {
        quotes.forEach((quote) => {
            const quoteEl = document.createElement("blockquote");
            quoteEl.classList.add("quote");

            quoteEl.innerHTML = `
            <span>${quote.id})</span>
            ${quote.quote}
            <footer>--  ${quote.author}</footer>
        `;

            quotesEl.appendChild(quoteEl);
        });
    };

    // returns true if first fetch or there are more quotes to fetch
    const hasMoreQuotes = (page, limit, total) => {
        const startIndex = (page - 1) * limit + 1;
        return total === 0 || startIndex < total;
    };

    // load quotes: show indicator, get quotes, show quotes, hide indicator
    const loadQuotes = async (page, limit) => {
        // show loader
        showLoader();
        // set how long loader will show
        setTimeout(async () => {
            try {
                // if more quotes to fetch
                if (hasMoreQuotes(page, limit, total)) {
                    // call API for quotes
                    const response = await getQuotes(page, limit);
                    // show quotes
                    showQuotes(response.data);
                    // update total
                    total = response.total;
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                hideLoader();
            }
        }, 500);
    };

    // HIDE/SHOW INDICATOR FUNCTIONS ///////////////////////////////////
    const hideLoader = () => {
        loader.classList.remove("show");
    };

    const showLoader = () => {
        loader.classList.add("show");
    };

    // SCROLL EVENT ///////////////////////////////////////////////////
    window.addEventListener(
        "scroll",
        () => {
            const { scrollTop, scrollHeight, clientHeight } =
                document.documentElement;

            if (
                scrollTop + clientHeight >= scrollHeight - 5 &&
                hasMoreQuotes(currentPage, limit, total)
            ) {
                currentPage++;
                loadQuotes(currentPage, limit);
            }
        },
        {
            passive: true,
        }
    );

    loadQuotes(currentPage, limit);
})();
