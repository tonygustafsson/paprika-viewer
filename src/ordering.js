import sort from 'fast-sort';

export const changeSortOrder = (sortArg, sortOrder, sortOrderDirection) => {
    if (sortArg === sortOrder) {
        sortOrderDirection = sortOrderDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortOrderDirection = 'desc';
    }

    sortOrder = sortArg;

    orderTickers();
};

const sortTickersByLambda = (lambda, sortOrderDirection) => {
    if (sortOrderDirection === 'asc') {
        tickers = sort(tickers).asc(lambda);
    } else {
        tickers = sort(tickers).desc(lambda);
    }
};

export const orderTickers = (sortOrder, sortOrderDirection) => {
    switch (sortOrder) {
        case 'rank':
            sortTickersByLambda(x => x.rank, sortOrderDirection);
            break;
        case 'symbol':
            sortTickersByLambda(x => x.symbol, sortOrderDirection);
            break;
        case 'name':
            sortTickersByLambda(x => x.name, sortOrderDirection);
            break;
        case 'price':
            sortTickersByLambda(x => x.quotes.USD.price, sortOrderDirection);
            break;
        case 'volume_24h':
            sortTickersByLambda(x => x.quotes.USD.volume_24h, sortOrderDirection);
            break;
        case '1h':
            sortTickersByLambda(x => x.quotes.USD.percent_change_1h, sortOrderDirection);
            break;
        case '12h':
            sortTickersByLambda(x => x.quotes.USD.percent_change_12h, sortOrderDirection);
            break;
        case '24h':
            sortTickersByLambda(x => x.quotes.USD.percent_change_24h, sortOrderDirection);
            break;
        case '7d':
            sortTickersByLambda(x => x.quotes.USD.percent_change_7d, sortOrderDirection);
            break;
        case '30d':
            sortTickersByLambda(x => x.quotes.USD.percent_change_30d, sortOrderDirection);
            break;
        case 'ath':
            sortTickersByLambda(x => x.quotes.USD.percent_from_price_ath, sortOrderDirection);
            break;
        default:
            sortTickersByLambda(x => x.quotes.USD.market_cap, sortOrderDirection);
    }
};
