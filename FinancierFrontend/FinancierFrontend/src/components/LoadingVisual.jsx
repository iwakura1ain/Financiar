export function LoadingDots({status}) {
    if (status) {
        return (
            <span className="loader-outer">
              <div className="loader">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
                <span className="dot dot-4"></span>
              </div>
            </span>
        )
    }
    else 
        return <></>
    
}

export function LoadingSpinny({status}) {
    if (status) {
        return (<div className="lds-ring"><div></div><div></div><div></div><div></div></div>)
    }
}
