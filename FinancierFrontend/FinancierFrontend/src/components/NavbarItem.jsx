export default function NavBarItem({menuItem}) {
    return (
        <li className="nav-item nav-custom-link">
          <a className="nav-link" href="index.html">{menuItem} <i className="icon ion-ios-arrow-forward icon-mobile"></i></a>
        </li>
    )
}
