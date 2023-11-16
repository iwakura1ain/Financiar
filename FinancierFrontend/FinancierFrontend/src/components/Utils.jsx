// TODO: refactor into object
// export const GraphSize = () => {
//     // console.log('outer-width:',window.outerWidth, 'outer-height:', window.outerHeight);
//     // console.log('inner-width:',window.innerWidth, 'inner-height:', window.innerHeight);
    
//     if(window.innerWidth >= 2160) {
//         width = window.innerWidth*0.7
//         height = 700
//     }

//     if(window.innerWidth >= 1440 && window.innerWidth < 2160) {
//         width = window.innerWidth*0.7
//         height = 600
//     }

//     if(window.innerWidth >= 992 && window.innerWidth < 1440) {
//         width = window.innerWidth*0.9
//         height = 540
//     }

//     if(window.innerWidth >= 768 && window.innerWidth < 992) {
//         width = window.innerWidth*0.7
//         height = 500
//     }

//     console.log('width:', width, 'height:', height);
// }

export function getSlicedStockData(data, visibleOffset) {
    let start = data.length - (visibleOffset[0] + visibleOffset[1])
    let end = data.length - (visibleOffset[0])
    let padding = start < 0 ? Array.apply(null, Array(Math.abs(start))).map(function () {}) : []

    return [...padding, ...data.slice(start > 0 ? start : 0, end)]
}

export function getDefaultDate() {    
    // Create a date object from a date string
    var date = new Date();

    var prevDate = new Date();
    prevDate.setFullYear(date.getFullYear() - 1);

    const getFormatted = (date) => {
        // Get year, month, and day part from the date
        var year = date.toLocaleString("default", { year: "numeric" });
        var month = date.toLocaleString("default", { month: "2-digit" });
        var day = date.toLocaleString("default", { day: "2-digit" });

        return year + "-" + month + "-" + day;
    }
    
    return [getFormatted(date), getFormatted(prevDate)]
}

export function getFormattedDate(date, offset=false) {
    if (date === undefined)
        return date
    
    var val = new Date(date);

    if (offset) {
        val.setMonth(val.getMonth() - 6);
    }
    
    // Get year, month, and day part from the date
    var year = val.toLocaleString("default", { year: "numeric" });
    var month = val.toLocaleString("default", { month: "2-digit" });
    var day = val.toLocaleString("default", { day: "2-digit" });

    return year + "-" + month + "-" + day;
}

export function getWeightedAverage(trade, current, num, weight) {
    current = (((trade.Open + trade.Close)/2) + current*num*weight) / (num*weight + 1)
    num += 1

    return [current, num]
}

export function  getLogoName(name) {return name.replaceAll(" ", "_")}

export const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque, tortor nec mattis feugiat, velit purus euismod odio, quis vulputate velit urna sit amet enim. Maecenas vulputate auctor ligula sed sollicitudin."

export const sectorList = [
    'Industrials',
    'Health Care',
    'Information Technology',
    'Communication Services',
    'Consumer Staples',
    'Utilities',
    'Financials',
    'Materials',
    'Real Estate',
    'Consumer Discretionary',
    'Energy'
]
