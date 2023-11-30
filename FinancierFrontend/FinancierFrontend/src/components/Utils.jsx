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


export function getFormattedDate(val) {
    if (val === undefined)
        return undefined

    // Get year, month, and day part from the date
    var year = val.toLocaleString("default", { year: "numeric" });
    var month = val.toLocaleString("default", { month: "2-digit" });
    var day = val.toLocaleString("default", { day: "2-digit" });
    
    return year + "-" + month + "-" + day;
}

export function getOffsetDate(date, period="default") {
    var val = new Date(date)
    
    switch (period) {
    case "day": val.setMonth(val.getMonth() - 2); return val;
    case "week": val.setMonth(val.getMonth() - 4); return val;
    case "month": val.setMonth(val.getMonth() - 48); return val;
    case "quarter": val.setMonth(val.getMonth() - 48); return val;
    case "year": val.setMonth(val.getMonth() - 48); return val;
    default: return val;
    }
}

export function getDefaultVisibleOffset(period) {
    switch (period) {
    case "day": return [0, 180];
    case "week": return [0, 104];
    case "month": return [0, 88]; 
    case "quarter": return [0, 40]; 
    case "year": return [0, 10];
    default: return [0, 180];
    }
}

export function getDefaultDate(period="default") {
    var currentDate = new Date()
    var offsetDate = new Date()

    switch(period) {
    case "day": offsetDate.setMonth(offsetDate.getMonth() - 10); break;
    case "week": offsetDate.setMonth(offsetDate.getMonth() - 24); break;
    case "month": offsetDate.setMonth(offsetDate.getMonth() - 100); break;
    case "quarter": offsetDate.setMonth(offsetDate.getMonth() - 120); break;
    case "year": offsetDate.setMonth(offsetDate.getMonth() - 120); break;
    default: offsetDate.setMonth(offsetDate.getMonth() - 24); break;
    }
    
    return [getFormattedDate(offsetDate), getFormattedDate(currentDate)]
}


export function getWeightedAverage(trade, current, num, weight) {
    current = (((trade.Open + trade.Close)/2) + current*num*weight) / (num*weight + 1)
    num += 1

    return [current, num]
}


export function  getLogoName(name) {return name.replaceAll(" ", "_")}

export const backendURL = "http://localhost:8000"

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







